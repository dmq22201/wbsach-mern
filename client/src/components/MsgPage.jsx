import {
  HiOutlineFaceFrown,
  HiMiniArrowLeft,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { Link } from "react-router-dom";

function MsgPage({ msgFromServer }) {
  const statesIcon = {
    success: (
      <HiOutlineCheckCircle className="h-20 w-20 text-green-600 dark:text-green-400" />
    ),
    error: (
      <HiOutlineFaceFrown className="h-20 w-20 text-red-600 dark:text-red-400" />
    ),
  };

  const statesClass = {
    success: "text-green-600 font-semibold",
    error: "text-red-600 font-semibold dark:text-red-400",
  };

  let stateClass;
  let stateIcon;
  if (msgFromServer?.status === "success") {
    stateClass = statesClass["success"];
    stateIcon = statesIcon["success"];
  } else if (msgFromServer?.status === "fail") {
    stateClass = statesClass["error"];
    stateIcon = statesIcon["error"];
  } else if (msgFromServer?.status === "error") {
    stateClass = statesClass["error"];
    stateIcon = statesIcon["error"];
  } else {
    stateClass = statesClass["error"];
    stateIcon = statesIcon["error"];
  }

  return (
    <div className="flex items-center">
      <div className="mx-auto flex flex-col gap-6">
        <Link to="/home">
          <div className="flex items-center gap-2 font-semibold transition-colors hover:text-violet-500">
            <HiMiniArrowLeft />
            <span>Quay về trang chủ</span>
          </div>
        </Link>
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          {stateIcon}
          <p className={stateClass}>{msgFromServer?.message}</p>
        </div>
      </div>
    </div>
  );
}

export default MsgPage;
