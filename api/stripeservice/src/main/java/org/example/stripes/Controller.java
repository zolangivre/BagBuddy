package org.example.stripes;

import com.stripe.model.Account;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.*;
import com.stripe.model.PaymentIntent;

import java.io.IOException;
import java.util.Map;
import java.util.HashMap;
import javax.servlet.http.HttpServletRequest;

import org.example.stripes.StripeService;

@RestController
@RequestMapping("/stripe")
public class Controller {

    private final StripeService stripeService;

    public Controller(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello, Spring Boot!";
    }

    @PostMapping("/create-stripe-account")
    public String createAccount() throws Exception {
        return stripeService.createAccount();
    }

    // Créer un lien d’onboarding → POST avec accountId dans le body
    public static class AccountIdRequest {
        public String accountId;
        public String getAccountId() { return accountId; }
        public void setAccountId(String accountId) { this.accountId = accountId; }
    }

    @PostMapping("/create-account-link")
    public String createAccountLink(@RequestBody AccountIdRequest request) throws Exception {
        return stripeService.createAccountLink(request.getAccountId());
    }


    @PostMapping("/create-payment-intent")
    public Map<String, Object> createPaymentIntentConnected(@RequestBody Map<String, Object> payload) throws Exception {
        Long amount = ((Number) payload.get("amount")).longValue();
        String currency = (String) payload.getOrDefault("currency", "eur");
        String connectedAccountId = (String) payload.get("connectedAccountId"); // acct_xxx
        Long fee = payload.containsKey("applicationFeeAmount") ?
                ((Number) payload.get("applicationFeeAmount")).longValue() : 0L;
        String annonce_id = (String) payload.get("annonceId");

        PaymentIntent pi = stripeService.createPaymentIntentForConnectedAccount(amount, currency, connectedAccountId, annonce_id);

        Map<String, Object> res = new HashMap<>();
        res.put("id", pi.getId());
        res.put("client_secret", pi.getClientSecret());
        res.put("amount", pi.getAmount());
        res.put("currency", pi.getCurrency());
        res.put("status", pi.getStatus());
        return res;
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody byte[] payload,  // corps brut
            @RequestHeader("Stripe-Signature") String sigHeader) {

        stripeService.handleStripeWebhook(new String(payload), sigHeader);
        return ResponseEntity.ok("ok");
    }

}
