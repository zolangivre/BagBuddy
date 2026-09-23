import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react-native";
import AuthScreen from "@/components/AuthScreen";
import AuthField from "@/components/AuthField";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { AuthContext } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import client, { withEndpoint } from "@/lib/apolloClient";
import { graphqlErrorCode } from "@/lib/graphqlError";
import { REGISTER, SEND_VERIFICATION_EMAIL } from "@/lib/graphql/users";
import {
  enterApp,
  isValidEmail,
  NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from "@/utils/authForm";

/** Codes de userservice qui désignent un champ précis du formulaire. */
const FIELD_ERRORS = {
  email_already_used: "email",
  password_rejected: "password",
};

export default function RegisterScreen() {
  const { state, signIn } = useContext(AuthContext);
  const { i18n, language } = useLanguage();
  const params = useLocalSearchParams();
  const [register] = useMutation(REGISTER, { context: withEndpoint("users") });

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: params.email ?? "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    if (state.isSignedIn && state.userInfo) enterApp();
  }, [state.isSignedIn, state.userInfo]);

  const update = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const { firstName, lastName, email, password, confirmPassword } = form;
    const next = {};
    if (!firstName.trim()) next.firstName = i18n.t("auth_error_first_name_required");
    else if (firstName.trim().length > NAME_MAX_LENGTH)
      next.firstName = i18n.t("auth_error_name_too_long");
    if (!lastName.trim()) next.lastName = i18n.t("auth_error_last_name_required");
    else if (lastName.trim().length > NAME_MAX_LENGTH)
      next.lastName = i18n.t("auth_error_name_too_long");
    if (!email.trim()) next.email = i18n.t("auth_error_email_required");
    else if (!isValidEmail(email)) next.email = i18n.t("auth_error_email_invalid");
    if (!password) next.password = i18n.t("auth_error_password_required");
    else if (password.length < PASSWORD_MIN_LENGTH)
      next.password = i18n.t("auth_error_password_too_short", {
        count: PASSWORD_MIN_LENGTH,
      });
    else if (password.length > PASSWORD_MAX_LENGTH)
      next.password = i18n.t("auth_error_password_too_long");
    if (!confirmPassword)
      next.confirmPassword = i18n.t("auth_error_confirm_password_required");
    else if (password && confirmPassword !== password)
      next.confirmPassword = i18n.t("auth_error_password_mismatch");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setFailure(null);
    if (!validate()) return;
    setSubmitting(true);
    const email = form.email.trim().toLowerCase();

    try {
      await register({
        variables: {
          input: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email,
            password: form.password,
          },
        },
      });
    } catch (error) {
      const code = graphqlErrorCode(error);
      const field = FIELD_ERRORS[code];
      if (field) {
        setErrors((prev) => ({ ...prev, [field]: i18n.t(`auth_error_${code}`) }));
        const fieldRefs = {
          lastName: lastNameRef,
          email: emailRef,
          password: passwordRef,
          confirmPassword: confirmPasswordRef,
        };
        fieldRefs[field]?.current?.focus();
      } else if (CombinedGraphQLErrors.is(error)) {
        // Sans code, un refus vient de la validation du schéma : une valeur a
        // passé nos règles mais pas celles du serveur.
        setFailure(i18n.t("auth_error_register_rejected"));
      } else {
        setFailure(i18n.t("auth_error_register_unavailable"));
      }
      setSubmitting(false);
      return;
    }

    // Le compte existe : on enchaîne sur une connexion plutôt que de renvoyer
    // vers un formulaire que l'utilisateur vient de remplir.
    let accessToken;
    try {
      accessToken = await signIn(email, form.password);
    } catch {
      router.replace({
        pathname: "/login",
        params: { email, notice: "account_created" },
      });
      return;
    }

    // Sans attendre ni bloquer l'arrivée : si l'envoi échoue, le bandeau de
    // vérification du profil permet de le relancer.
    client
      .mutate({
        mutation: SEND_VERIFICATION_EMAIL,
        variables: { language },
        context: {
          ...withEndpoint("users"),
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      })
      .catch(() => {});
  };

  return (
    <AuthScreen
      title={i18n.t("auth_register_title")}
      subtitle={i18n.t("auth_register_subtitle")}
      banner={failure ? { tone: "error", text: failure } : null}
      footerText={i18n.t("auth_have_account")}
      footerLinkText={i18n.t("auth_login_link")}
      onFooterLinkPress={() =>
        router.replace({ pathname: "/login", params: { email: form.email } })
      }
    >
      <View style={styles.row}>
        <AuthField
          style={styles.half}
          label={i18n.t("auth_first_name")}
          value={form.firstName}
          onChangeText={update("firstName")}
          placeholder={i18n.t("auth_first_name_placeholder")}
          error={errors.firstName}
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => lastNameRef.current?.focus()}
          maxLength={NAME_MAX_LENGTH}
          testID="register-first-name"
        />
        <AuthField
          style={styles.half}
          label={i18n.t("auth_last_name")}
          inputRef={lastNameRef}
          value={form.lastName}
          onChangeText={update("lastName")}
          placeholder={i18n.t("auth_last_name_placeholder")}
          error={errors.lastName}
          autoCapitalize="words"
          autoComplete="family-name"
          textContentType="familyName"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => emailRef.current?.focus()}
          maxLength={NAME_MAX_LENGTH}
          testID="register-last-name"
        />
      </View>

      <AuthField
        label={i18n.t("auth_email")}
        icon={Mail}
        inputRef={emailRef}
        value={form.email}
        onChangeText={update("email")}
        placeholder={i18n.t("auth_email_placeholder")}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="username"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordRef.current?.focus()}
        testID="register-email"
      />

      <AuthField
        label={i18n.t("auth_password")}
        icon={Lock}
        password
        inputRef={passwordRef}
        value={form.password}
        onChangeText={update("password")}
        placeholder="••••••••"
        error={errors.password}
        hint={i18n.t("auth_password_hint", { count: PASSWORD_MIN_LENGTH })}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
        maxLength={PASSWORD_MAX_LENGTH}
        testID="register-password"
      />

      <AuthField
        label={i18n.t("auth_confirm_password")}
        icon={ShieldCheck}
        password
        inputRef={confirmPasswordRef}
        value={form.confirmPassword}
        onChangeText={update("confirmPassword")}
        placeholder="••••••••"
        error={errors.confirmPassword}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={handleSubmit}
        maxLength={PASSWORD_MAX_LENGTH}
        testID="register-confirm-password"
      />

      <Button
        onPress={handleSubmit}
        text={i18n.t("auth_register_button")}
        loading={submitting}
        rightIcon={<ArrowRight size={22} color={Colors.white} />}
        testID="register-submit"
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
});
