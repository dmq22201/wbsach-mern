import { HiOutlineFaceFrown, HiMiniArrowLeft } from "react-icons/hi2";
import { Link } from "react-router-dom";

function NotFound({ msg = "Trang bạn đang truy cập không tồn tại :(" }) {
  return (
    <div className="flex h-screen items-center p-4 dark:bg-slate-900 md:p-10">
      <div className="mx-auto flex flex-col gap-6 rounded-lg bg-white p-8 shadow-md dark:bg-slate-800 dark:text-white md:w-[36.75rem]">
        <Link to="/home">
          <div className="flex items-center gap-2 font-semibold transition-colors hover:text-violet-500">
            <HiMiniArrowLeft />
            <span>Quay về trang chủ</span>
          </div>
        </Link>
        <div className="flex flex-col items-center justify-center gap-8">
          <HiOutlineFaceFrown className="h-20 w-20 text-red-600" />
          <p className="font-semibold text-red-600">{msg}</p>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
