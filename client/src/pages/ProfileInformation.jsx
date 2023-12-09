import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";

import AvatarForm from "../features/auth/AvatarForm";
import InformationForm from "../features/auth/InformationForm";

function ProfileInformation() {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <div className="flex flex-col gap-10">
      <AvatarForm />
      <span className="font-medium">
        Đăng ký vào thời gian: {currentUser.createdAt}
      </span>
      <InformationForm />
    </div>
  );
}

export default ProfileInformation;
