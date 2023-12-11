import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";

import AvatarForm from "../features/auth/AvatarForm";
import InformationForm from "../features/auth/InformationForm";
import { timeAgo } from "../utilities/helper";
import { parseISO } from "date-fns";

function ProfileInformation() {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <div className="flex flex-col gap-10">
      <AvatarForm />
      <span className="font-semibold italic">
        Đăng ký vào thời gian: {timeAgo(parseISO(currentUser.createdAt))}
      </span>
      <InformationForm />
    </div>
  );
}

export default ProfileInformation;
