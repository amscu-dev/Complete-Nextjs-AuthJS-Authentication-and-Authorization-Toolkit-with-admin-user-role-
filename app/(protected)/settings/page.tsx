import SettingsForm from "@/components/settings/settings-form";
import { curentUser } from "@/lib/curent-user";

async function SettingsPage() {
  const user = await curentUser();

  return <SettingsForm user={user} />;
}

export default SettingsPage;
