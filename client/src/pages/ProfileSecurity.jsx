import DeleteAccountButton from "../features/auth/DeleteAccountButton";
import EmailForm from "../features/auth/EmailForm";
import UpdatePasswordForm from "../features/auth/UpdatePasswordForm";

function ProfileSecurity() {
  return (
    <div className="divide flex flex-col gap-10">
      <EmailForm />
      <UpdatePasswordForm />
      <DeleteAccountButton />
    </div>
  );
}

export default ProfileSecurity;
