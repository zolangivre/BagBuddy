package com.bagbuddy.stripeservice.controller;

import com.bagbuddy.stripeservice.service.StripeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.*;
import com.stripe.model.PaymentIntent;

import java.util.Map;
import java.util.HashMap;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/stripe")
public class StripeController {

    private final StripeService stripeService;

    public StripeController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/create-stripe-account")
    public Map<String, String> createAccount() throws Exception {
        return Map.of("account-id", stripeService.createAccount());
    }

    // Créer un lien d’onboarding → POST avec accountId dans le body
    public static class AccountIdRequest {
        public String accountId;

        public String getAccountId() {
            return accountId;
        }

        public void setAccountId(String accountId) {
            this.accountId = accountId;
        }
    }

    @PostMapping("/create-account-link")
    public Map<String, String> createAccountLink(@RequestBody AccountIdRequest request) throws Exception {
        return Map.of("account-link", stripeService.createAccountLink(request.getAccountId()));
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

    @GetMapping("/get-public-key")
    public Map<String, String> getPublicKey() {
        return Map.of("public-key", stripeService.getPublicKey());
    }

    @GetMapping("/onboarding/success")
    public void redirectSuccess(@RequestParam String accountId, HttpServletResponse response) throws IOException {
        response.sendRedirect("bagbuddy://onboarding/success?accountId=" + accountId);
    }

    @GetMapping("/onboarding/retry")
    public void redirectRetry(@RequestParam String accountId, HttpServletResponse response) throws IOException {
        response.sendRedirect("bagbuddy://onboarding/retry?accountId=" + accountId);
    }
}
