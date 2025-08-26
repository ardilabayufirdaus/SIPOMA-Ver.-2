import SettingsSection from "./SettingsSection";
import ProfileSettings from "./ProfileSettings";
import ThemeSettings from "./ThemeSettings";
import LanguageSettings from "./LanguageSettings";
import NotificationSettings from "./NotificationSettings";
import SecuritySettings from "./SecuritySettings";
import AppInfo from "./AppInfo";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <span role="img" aria-label="Settings">
          ⚙️
        </span>{" "}
        Settings
      </h1>
      <SettingsSection title="Profil & Akun">
        <ProfileSettings />
      </SettingsSection>
      <SettingsSection title="Preferensi Tema">
        <ThemeSettings />
      </SettingsSection>
      <SettingsSection title="Bahasa">
        <LanguageSettings />
      </SettingsSection>
      <SettingsSection title="Notifikasi">
        <NotificationSettings />
      </SettingsSection>
      <SettingsSection title="Keamanan">
        <SecuritySettings />
      </SettingsSection>
      <SettingsSection title="Info Aplikasi">
        <AppInfo />
      </SettingsSection>
    </div>
  );
}
