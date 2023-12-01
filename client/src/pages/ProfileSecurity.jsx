import DeleteAccountForm from "../features/auth/DeleteAccountForm";
import EmailForm from "../features/auth/EmailForm";
import UpdatePasswordForm from "../features/auth/UpdatePasswordForm";

function ProfileSecurity() {
  return (
    <div className="divide flex flex-col gap-10">
      <EmailForm />
      <UpdatePasswordForm />
      <DeleteAccountForm />
    </div>
  );
}

export default ProfileSecurity;
