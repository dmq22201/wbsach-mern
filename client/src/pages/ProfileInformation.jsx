import AvatarForm from "../features/auth/AvatarForm";
import InformationForm from "../features/auth/InformationForm";

function ProfileInformation() {
  return (
    <div className="flex flex-col gap-10">
      <AvatarForm />
      <InformationForm />
    </div>
  );
}

export default ProfileInformation;
