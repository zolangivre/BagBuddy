import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Mail, Lock, ArrowRight } from "lucide-react-native";
import AuthScreen from "@/components/AuthScreen";
import AuthField from "@/components/AuthField";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { typography } from "@/theme/Fonts";
import { AuthContext, AuthError } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { enterApp, isValidEmail } from "@/utils/authForm";

/** Messages d'arrivée, passés en paramètre par l'écran d'où l'on vient. */
const NOTICES = {
  account_created: "auth_notice_account_created",
};

export default function LoginScreen() {
  const { state, signIn } = useContext(AuthContext);
  const { i18n } = useLanguage();
  const params = useLocalSearchParams();

  const [email, setEmail] = useState(params.email ?? "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const passwordRef = useRef(null);

  // Navigation une fois l'état de session publié, et non à la fin de signIn :
  // l'écran des onglets renvoie ici tant qu'il ne voit pas isSignedIn.
  useEffect(() => {
    if (state.isSignedIn && state.userInfo) enterApp();
  }, [state.isSignedIn, state.userInfo]);

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = i18n.t("auth_error_email_required");
    else if (!isValidEmail(email)) next.email = i18n.t("auth_error_email_invalid");
    if (!password) next.password = i18n.t("auth_error_password_required");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setFailure(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error) {
      const code = error instanceof AuthError ? error.code : "unavailable";
      setFailure(i18n.t(`auth_error_${code}`));
      if (code === "invalid_credentials") setPassword("");
      setSubmitting(false);
    }
  };

  const notice = NOTICES[params.notice];
  const banner = failure
    ? { tone: "error", text: failure }
    : notice
      ? { tone: "success", text: i18n.t(notice) }
      : null;

  return (
    <AuthScreen
      title={i18n.t("auth_login_title")}
      subtitle={i18n.t("auth_login_subtitle")}
      banner={banner}
      footerText={i18n.t("auth_no_account")}
      footerLinkText={i18n.t("auth_create_account")}
      onFooterLinkPress={() =>
        router.replace({ pathname: "/register", params: { email } })
      }
    >
      <AuthField
        label={i18n.t("auth_email")}
        icon={Mail}
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
        }}
        placeholder={i18n.t("auth_email_placeholder")}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="username"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        submitBehavior="submit"
        testID="login-email"
      />

      <View style={styles.passwordBlock}>
        <AuthField
          label={i18n.t("auth_password")}
          icon={Lock}
          password
          inputRef={passwordRef}
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
          }}
          placeholder="••••••••"
          error={errors.password}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
          testID="login-password"
        />
        <TouchableOpacity
          style={styles.forgot}
          onPress={() =>
            router.push({ pathname: "/forgot-password", params: { email } })
          }
          hitSlop={8}
        >
          <Text style={styles.link}>{i18n.t("auth_forgot_password")}</Text>
        </TouchableOpacity>
      </View>

      <Button
        onPress={handleSubmit}
        text={i18n.t("auth_login_button")}
        loading={submitting}
        rightIcon={<ArrowRight size={22} color={Colors.white} />}
        testID="login-submit"
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  passwordBlock: {
    gap: 10,
  },
  forgot: {
    alignSelf: "flex-end",
  },
  link: {
    ...typography.title3,
    color: Colors.primary_color,
  },
});
