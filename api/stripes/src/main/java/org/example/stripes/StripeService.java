
package org.example.stripes;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import com.stripe.Stripe;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import java.io.BufferedReader;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;

@Service
public class StripeService {

    static {
        Stripe.apiKey = System.getenv("STRIPE_API_KEY");
    }

    public String createAccount() throws Exception {
        Account account = Account.create(AccountCreateParams.builder().build());
        return account.getId();
    }

    public String createAccountLink(String accountId) throws Exception {
        AccountLink accountLink = AccountLink.create(
                AccountLinkCreateParams.builder()
                        .setAccount(accountId)
                        .setReturnUrl("http://localhost:4242/return/" + accountId)
                        .setRefreshUrl("http://localhost:4242/refresh/" + accountId)
                        .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
                        .build()
        );
        return accountLink.getUrl();
    }

    /**
     * Cree un PaymentIntent en destination charge.
     *
     * @param amount montant total en centimes (ex: 2000 pour 20.00 EUR)
     * @param currency currency, ex "eur"
     * @param connectedAccountId id du compte connecte (acct_xxx)
     */
    public PaymentIntent createPaymentIntentForConnectedAccount(
            Long amount,
            String currency,
            String connectedAccountId,
            String annonceId
    ) throws Exception {

        PaymentIntentCreateParams.TransferData transferData =
                PaymentIntentCreateParams.TransferData.builder()
                        .setDestination(connectedAccountId)
                        .build();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency(currency)
                .setTransferData(transferData)
                .setApplicationFeeAmount(Math.round(amount*0.05)) // ta commission en centimes
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .putMetadata("annonce_id", annonceId)
                .build();

        return PaymentIntent.create(params);
    }

    public void handleStripeWebhook(String payload, String sigHeader) {
        String endpointSecret = System.getenv("WEBHOOK_SECRET");

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            throw new RuntimeException("Signature Stripe invalide", e);
        }

        if ("payment_intent.succeeded".equals(event.getType())) {
            PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                    .getObject().orElse(null);

            if (paymentIntent != null) {
                String paymentIntentId = paymentIntent.getId();
                String annonceId = paymentIntent.getMetadata().get("annonce_id");

                // TODO : traitement métier (BDD, log, notification, etc.)
                System.out.println("Paiement réussi : " + paymentIntentId + " pour annonce " + annonceId);
            }
        }
    }

    public String readBody(HttpServletRequest request) {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return sb.toString();
    }

}
