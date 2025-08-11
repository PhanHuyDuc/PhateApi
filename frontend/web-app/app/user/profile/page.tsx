import { getCurrentUser } from "@/lib/actions/authActions";
import ProfileForm from "./profile-form";

export default async function ProfilesPage() {
  const user = await getCurrentUser();
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="h2-bold">Profile</h2>
      <ProfileForm />
    </div>
  );
}
