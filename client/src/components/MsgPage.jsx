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
    success: "text-green-600 font-semibold dark:text-green-400",
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
    <div className="mx-auto flex w-fit items-center rounded-lg bg-white p-10 shadow-md dark:bg-slate-800 md:w-[36.75rem]">
      <div className="flex w-full flex-col gap-6">
        <Link to="/books">
          <div className="flex  items-center gap-2 justify-self-start font-semibold transition-colors hover:text-violet-500">
            <HiMiniArrowLeft />
            <span>Quay về trang chủ</span>
          </div>
        </Link>
        <div className="mx-auto flex flex-col items-center justify-center gap-8 text-center">
          {stateIcon}
          <p className={stateClass}>{msgFromServer?.message}</p>
        </div>
      </div>
    </div>
  );
}

export default MsgPage;
