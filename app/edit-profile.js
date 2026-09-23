import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  UserRound,
  Mail,
  Lock,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Phone,
  MapPin,
  Globe,
  Save,
} from "lucide-react-native";
import {
  ME,
  UPDATE_PROFILE,
  UPDATE_IDENTITY,
  CHANGE_PASSWORD,
  SEND_VERIFICATION_EMAIL,
} from "@/lib/graphql/users";
import { withEndpoint } from "@/lib/apolloClient";
import { graphqlErrorCode } from "@/lib/graphqlError";
import LoadingScreen from "@/components/LoadingScreen";
import ScreenHeader from "@/components/ScreenHeader";
import AuthField from "@/components/AuthField";
import FormBanner from "@/components/FormBanner";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import Colors from "@/theme/Colors";
import { globalStyles } from "@/theme/Styles";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthContext } from "@/contexts/AuthContext";
import {
  BIO_MAX_LENGTH,
  LOCATION_MAX_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  initialsOf,
  isValidEmail,
  isValidPhone,
} from "@/utils/authForm";

const USERS = withEndpoint("users");

/** Comparaison sans casse ni espaces autour : `A@b.fr ` n'est pas un nouvel email. */
const sameEmail = (a, b) =>
  (a ?? "").trim().toLowerCase() === (b ?? "").trim().toLowerCase();

/**
 * Compte et profil, sans quitter l'app.
 *
 * Trois formulaires indépendants, comme sur le web, parce qu'ils ne touchent pas
 * le même système : l'identité (nom, email) vit dans Keycloak et passe par
 * `updateIdentity`, le profil public (téléphone, localisation, bio) par
 * `updateProfile`, le mot de passe par `changePassword`. Enregistrer l'un ne
 * doit ni attendre ni perdre la saisie des deux autres.
 */
export default function EditProfileScreen() {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { i18n } = useLanguage();

  const { data, loading } = useQuery(ME, { context: USERS });
  const profile = data?.me;

  // Les champs du profil public alimentent aussi l'aperçu : ils vivent ici.
  const [publicFields, setPublicFields] = useState({
    phone: "",
    location: "",
    bio: "",
  });
  const [identityFields, setIdentityFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Rempli une seule fois : un rafraîchissement du cache (après une mutation,
  // au retour sur l'écran) ne doit pas écraser une saisie en cours.
  const initialized = useRef(false);
  useEffect(() => {
    if (!profile || initialized.current) return;
    initialized.current = true;
    setPublicFields({
      phone: profile.phone ?? "",
      location: profile.location ?? "",
      bio: profile.bio ?? "",
    });
    setIdentityFields({
      firstName: profile.givenName ?? "",
      lastName: profile.familyName ?? "",
      email: profile.email ?? "",
    });
  }, [profile]);

  if (!profile) {
    return loading ? (
      <LoadingScreen />
    ) : (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScreenHeader title={i18n.t("edit_profile")} />
        <View style={styles.content}>
          <FormBanner tone="error" text={i18n.t("account_error_load")} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader title={i18n.t("edit_profile")} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <PreviewCard
            profile={profile}
            identity={identityFields}
            publicFields={publicFields}
          />
          <IdentityCard
            profile={profile}
            fields={identityFields}
            setFields={setIdentityFields}
          />
          <PublicProfileCard
            profile={profile}
            fields={publicFields}
            setFields={setPublicFields}
          />
          <PasswordCard />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/** Carte de formulaire : pastille d'icône, titre, phrase d'explication. */
function SectionCard({ icon: Icon, title, lede, banner, children }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  return (
    <View
      style={[
        globalStyles.card,
        styles.card,
        { backgroundColor: theme.background_card },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Icon size={20} color={Colors.primary_color} />
        </View>
        <View style={styles.sectionTitles}>
          <Text style={theme.textStyles.cardTitle}>{title}</Text>
          {lede ? <Text style={theme.textStyles.bodySmall}>{lede}</Text> : null}
        </View>
      </View>
      {banner ? <FormBanner {...banner} /> : null}
      {children}
    </View>
  );
}

/** Bouton d'enregistrement d'une section, estompé tant qu'il n'y a rien à envoyer. */
function SaveButton({ enabled, ...props }) {
  return (
    <Button
      {...props}
      disabled={!enabled}
      style={!enabled && styles.buttonDisabled}
      leftIcon={<Save size={20} color={Colors.white} />}
    />
  );
}

/** Ce que voient les autres membres, mis à jour pendant la saisie. */
function PreviewCard({ profile, identity, publicFields }) {
  const { theme: colorScheme } = useThemeContext();
  const theme = Colors[colorScheme] ?? Colors.light;
  const { i18n } = useLanguage();

  const firstName = identity.firstName.trim() || profile.givenName;
  const lastName = identity.lastName.trim() || profile.familyName;
  const name = [firstName, lastName].filter(Boolean).join(" ") || profile.name;
  const verified = profile.emailVerified;
  const location = publicFields.location.trim();
  const bio = publicFields.bio.trim();

  return (
    <View
      style={[
        globalStyles.card,
        styles.preview,
        { backgroundColor: theme.background_card },
      ]}
    >
      <Text style={[theme.textStyles.caption, styles.previewLabel]}>
        {i18n.t("account_preview_title")}
      </Text>
      <Avatar
        initials={initialsOf({ givenName: firstName, familyName: lastName, name })}
        size={64}
      />
      <Text style={theme.textStyles.titleMedium}>{name}</Text>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: verified
              ? Colors.light_green_translucent
              : Colors.red_translucent,
          },
        ]}
      >
        {verified ? (
          <ShieldCheck size={14} color={Colors.success_color} />
        ) : (
          <ShieldAlert size={14} color={Colors.error_color} />
        )}
        <Text
          style={[
            styles.badgeText,
            { color: verified ? Colors.success_color : Colors.error_color },
          ]}
        >
          {i18n.t(verified ? "verified" : "not_verified")}
        </Text>
      </View>
      {location ? (
        <View style={styles.previewLine}>
          <MapPin size={14} color={theme.text} />
          <Text style={theme.textStyles.bodyMedium}>{location}</Text>
        </View>
      ) : null}
      <Text
        style={[theme.textStyles.bodyMedium, styles.previewBio]}
        numberOfLines={3}
      >
        {bio || i18n.t("account_no_bio")}
      </Text>
    </View>
  );
}

/**
 * Nom et email, portés par Keycloak. L'email est aussi l'identifiant de
 * connexion : le changer exige le mot de passe actuel, et la nouvelle adresse
 * repart non vérifiée — le lien de confirmation part aussitôt.
 */
function IdentityCard({ profile, fields, setFields }) {
  const { i18n, language } = useLanguage();
  const { refreshSession } = useContext(AuthContext);
  const [updateIdentity] = useMutation(UPDATE_IDENTITY, { context: USERS });
  const [sendVerification] = useMutation(SEND_VERIFICATION_EMAIL, {
    context: USERS,
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [saving, setSaving] = useState(false);

  const emailChanged = !sameEmail(fields.email, profile.email);
  const dirty =
    fields.firstName.trim() !== (profile.givenName ?? "") ||
    fields.lastName.trim() !== (profile.familyName ?? "") ||
    emailChanged;

  const update = (field) => (value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
    setBanner(null);
  };

  const validate = () => {
    const next = {};
    if (!fields.firstName.trim())
      next.firstName = i18n.t("auth_error_first_name_required");
    if (!fields.lastName.trim())
      next.lastName = i18n.t("auth_error_last_name_required");
    if (!fields.email.trim()) next.email = i18n.t("auth_error_email_required");
    else if (!isValidEmail(fields.email))
      next.email = i18n.t("auth_error_email_invalid");
    if (emailChanged && !currentPassword)
      next.currentPassword = i18n.t("auth_error_password_required");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    setBanner(null);
    if (!validate()) return;
    setSaving(true);
    const email = fields.email.trim().toLowerCase();
    try {
      // La réponse porte le profil à jour : le cache Apollo rafraîchit `me`,
      // et l'aperçu avec lui.
      await updateIdentity({
        variables: {
          input: {
            firstName: fields.firstName.trim(),
            lastName: fields.lastName.trim(),
            email,
            currentPassword: emailChanged ? currentPassword : null,
          },
        },
      });
    } catch (error) {
      const code = graphqlErrorCode(error);
      if (code === "invalid_current_password") {
        setErrors({ currentPassword: i18n.t("account_error_invalid_current_password") });
      } else if (code === "email_already_used") {
        setErrors({ email: i18n.t("auth_error_email_already_used") });
      } else {
        setBanner({ tone: "error", text: i18n.t("account_error_save") });
      }
      setSaving(false);
      setCurrentPassword("");
      return;
    }

    setCurrentPassword("");
    setFields((prev) => ({ ...prev, email }));
    // Le nom affiché partout vient du jeton : sans nouveau jeton, l'accueil
    // dirait encore bonjour à l'ancien prénom. Un échec ici n'annule rien.
    await refreshSession().catch(() => {});

    let sentTo = null;
    if (emailChanged) {
      try {
        const { data } = await sendVerification({ variables: { language } });
        if (data?.sendVerificationEmail) sentTo = email;
      } catch {
        // Le bandeau de vérification du profil permet de renvoyer le lien.
      }
    }
    setBanner({
      tone: "success",
      text: sentTo
        ? i18n.t("account_identity_updated_verification", { email: sentTo })
        : i18n.t("account_identity_updated"),
    });
    setSaving(false);
  };

  return (
    <SectionCard
      icon={UserRound}
      title={i18n.t("personal_information")}
      lede={i18n.t("account_identity_lede")}
      banner={banner}
    >
      <View style={styles.row}>
        <AuthField
          style={styles.half}
          label={i18n.t("auth_first_name")}
          value={fields.firstName}
          onChangeText={update("firstName")}
          error={errors.firstName}
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          maxLength={NAME_MAX_LENGTH}
        />
        <AuthField
          style={styles.half}
          label={i18n.t("auth_last_name")}
          value={fields.lastName}
          onChangeText={update("lastName")}
          error={errors.lastName}
          autoCapitalize="words"
          autoComplete="family-name"
          textContentType="familyName"
          maxLength={NAME_MAX_LENGTH}
        />
      </View>
      <AuthField
        label={i18n.t("auth_email")}
        icon={Mail}
        value={fields.email}
        onChangeText={update("email")}
        error={errors.email}
        hint={emailChanged ? i18n.t("account_email_change_note") : null}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
      />
      {emailChanged ? (
        <AuthField
          label={i18n.t("account_current_password")}
          icon={Lock}
          password
          value={currentPassword}
          onChangeText={(value) => {
            setCurrentPassword(value);
            setErrors((prev) => ({ ...prev, currentPassword: null }));
          }}
          error={errors.currentPassword}
          hint={i18n.t("account_current_password_email_hint")}
          autoComplete="current-password"
          textContentType="password"
          maxLength={PASSWORD_MAX_LENGTH}
        />
      ) : null}
      <SaveButton
        enabled={dirty}
        onPress={handleSave}
        loading={saving}
        text={i18n.t("account_save")}
      />
    </SectionCard>
  );
}

/** Téléphone, localisation et bio : ce que Keycloak ne porte pas. */
function PublicProfileCard({ profile, fields, setFields }) {
  const { i18n } = useLanguage();
  const [updateProfile] = useMutation(UPDATE_PROFILE, { context: USERS });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [saving, setSaving] = useState(false);

  const dirty =
    fields.phone.trim() !== (profile.phone ?? "") ||
    fields.location.trim() !== (profile.location ?? "") ||
    fields.bio.trim() !== (profile.bio ?? "");

  const update = (field) => (value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
    setBanner(null);
  };

  const handleSave = async () => {
    setBanner(null);
    if (!isValidPhone(fields.phone)) {
      setErrors({ phone: i18n.t("account_error_phone_invalid") });
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        variables: {
          input: {
            phone: fields.phone.trim(),
            location: fields.location.trim(),
            bio: fields.bio.trim(),
          },
        },
      });
      setBanner({ tone: "success", text: i18n.t("profile_updated_successfully") });
    } catch {
      setBanner({ tone: "error", text: i18n.t("account_error_save") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      icon={Globe}
      title={i18n.t("account_public_title")}
      lede={i18n.t("account_public_lede")}
      banner={banner}
    >
      <AuthField
        label={i18n.t("phone_number")}
        icon={Phone}
        value={fields.phone}
        onChangeText={update("phone")}
        placeholder="+33 6 12 34 56 78"
        error={errors.phone}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        maxLength={32}
      />
      <AuthField
        label={i18n.t("location")}
        icon={MapPin}
        value={fields.location}
        onChangeText={update("location")}
        placeholder={i18n.t("account_location_placeholder")}
        autoCapitalize="words"
        maxLength={LOCATION_MAX_LENGTH}
      />
      <AuthField
        label={i18n.t("bio")}
        value={fields.bio}
        onChangeText={update("bio")}
        placeholder={i18n.t("account_bio_placeholder")}
        hint={i18n.t("account_bio_count", {
          count: fields.bio.length,
          max: BIO_MAX_LENGTH,
        })}
        multiline
        autoCapitalize="sentences"
        autoCorrect
        maxLength={BIO_MAX_LENGTH}
      />
      <SaveButton
        enabled={dirty}
        onPress={handleSave}
        loading={saving}
        text={i18n.t("account_save")}
      />
    </SectionCard>
  );
}

/** Le mot de passe actuel est exigé : une session ouverte ne suffit pas. */
function PasswordCard() {
  const { i18n } = useLanguage();
  const [changePassword] = useMutation(CHANGE_PASSWORD, { context: USERS });
  const empty = { currentPassword: "", newPassword: "", confirmPassword: "" };
  const [fields, setFields] = useState(empty);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [saving, setSaving] = useState(false);
  const newRef = useRef(null);
  const confirmRef = useRef(null);

  const dirty = Object.values(fields).some(Boolean);

  const update = (field) => (value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
    setBanner(null);
  };

  const validate = () => {
    const { currentPassword, newPassword, confirmPassword } = fields;
    const next = {};
    if (!currentPassword)
      next.currentPassword = i18n.t("auth_error_password_required");
    if (!newPassword) next.newPassword = i18n.t("auth_error_password_required");
    else if (newPassword.length < PASSWORD_MIN_LENGTH)
      next.newPassword = i18n.t("auth_error_password_too_short", {
        count: PASSWORD_MIN_LENGTH,
      });
    if (!confirmPassword)
      next.confirmPassword = i18n.t("auth_error_confirm_password_required");
    else if (newPassword && confirmPassword !== newPassword)
      next.confirmPassword = i18n.t("auth_error_password_mismatch");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    setBanner(null);
    if (!validate()) return;
    setSaving(true);
    try {
      await changePassword({
        variables: {
          input: {
            currentPassword: fields.currentPassword,
            newPassword: fields.newPassword,
          },
        },
      });
      setFields(empty);
      setBanner({ tone: "success", text: i18n.t("account_password_updated") });
    } catch (error) {
      const code = graphqlErrorCode(error);
      if (code === "invalid_current_password") {
        setErrors({ currentPassword: i18n.t("account_error_invalid_current_password") });
        setFields((prev) => ({ ...prev, currentPassword: "" }));
      } else if (code === "password_rejected") {
        setErrors({ newPassword: i18n.t("auth_error_password_rejected") });
      } else {
        setBanner({ tone: "error", text: i18n.t("account_error_save") });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      icon={KeyRound}
      title={i18n.t("account_password_title")}
      lede={i18n.t("account_password_lede")}
      banner={banner}
    >
      <AuthField
        label={i18n.t("account_current_password")}
        icon={Lock}
        password
        value={fields.currentPassword}
        onChangeText={update("currentPassword")}
        error={errors.currentPassword}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => newRef.current?.focus()}
        maxLength={PASSWORD_MAX_LENGTH}
      />
      <AuthField
        label={i18n.t("account_new_password")}
        icon={Lock}
        password
        inputRef={newRef}
        value={fields.newPassword}
        onChangeText={update("newPassword")}
        error={errors.newPassword}
        hint={i18n.t("auth_password_hint", { count: PASSWORD_MIN_LENGTH })}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => confirmRef.current?.focus()}
        maxLength={PASSWORD_MAX_LENGTH}
      />
      <AuthField
        label={i18n.t("account_confirm_new_password")}
        icon={ShieldCheck}
        password
        inputRef={confirmRef}
        value={fields.confirmPassword}
        onChangeText={update("confirmPassword")}
        error={errors.confirmPassword}
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        onSubmitEditing={handleSave}
        maxLength={PASSWORD_MAX_LENGTH}
      />
      <SaveButton
        enabled={dirty}
        onPress={handleSave}
        loading={saving}
        text={i18n.t("account_save_password")}
      />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
    gap: 20,
  },
  card: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark_cyan_translucent,
  },
  sectionTitles: {
    flex: 1,
    gap: 2,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.45,
    shadowOpacity: 0,
    elevation: 0,
  },
  preview: {
    alignItems: "center",
    gap: 8,
  },
  previewLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  previewLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  previewBio: {
    textAlign: "center",
  },
});
