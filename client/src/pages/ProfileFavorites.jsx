import FavoriteTable from "../features/auth/FavoriteTable";

function ProfileFavorites() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <span className="font-roboto text-xl font-medium uppercase">
          Danh sách yêu thích
        </span>
        <span>
          (Đây là các nơi lưu lại các quyển sách mà bạn chưa thể mua hoặc sau
          này mua )
        </span>
      </div>

      <FavoriteTable />
    </div>
  );
}

export default ProfileFavorites;
