import {
  HiOutlineFaceFrown,
  HiMiniArrowLeft,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { Link } from "react-router-dom";

function MsgPage({ msgFromServer }) {
  const statesIcon = {
    success: <HiOutlineCheckCircle className="h-20 w-20 text-green-500" />,
    error: <HiOutlineFaceFrown className="h-20 w-20 text-red-500" />,
  };

  const statesClass = {
    success: "text-green-500 font-semibold",
    error: "text-red-500 font-semibold",
  };

  return (
    <div className="flex items-center">
      <div className="mx-auto flex flex-col gap-6 rounded-lg bg-white p-8 shadow-md md:w-[39.75rem]">
        <Link to="/home">
          <div className="flex items-center gap-2 font-semibold transition-colors hover:text-violet-500">
            <HiMiniArrowLeft />
            <span>Quay về trang chủ</span>
          </div>
        </Link>
        <div className="flex flex-col items-center justify-center gap-8">
          {msgFromServer.status === "success"
            ? statesIcon["success"]
            : statesIcon["error"]}
          <p
            className={
              msgFromServer.status === "success"
                ? statesClass["success"]
                : statesClass["error"]
            }
          >
            {msgFromServer.message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MsgPage;
