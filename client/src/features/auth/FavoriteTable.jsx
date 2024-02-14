import { useSelector } from "react-redux";
import { selectCurrentUser } from "./authSlice";
import Table from "../../components/Table";
import { useSendDeleteFavoriteListMutation } from "./authApiSlice";

function FavoriteTable() {
  const currentUser = useSelector(selectCurrentUser);

  const [sendDeleteFavoriteList] = useSendDeleteFavoriteListMutation();

  const handleDeleteToFavorite = async (bookId) => {
    try {
      await sendDeleteFavoriteList({
        bookId: bookId,
      }).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Table isActions={true}>
      <Table.Header>
        <Table.HeaderName>Tên sách</Table.HeaderName>
      </Table.Header>
      <Table.Body>
        {currentUser.favoriteList.map((rowData) => (
          <Table.BodyRow
            rowData={{
              name: rowData.name,
            }}
            key={rowData._id}
          >
            <button
              className="font-semibold text-slate-400 transition-all hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-100"
              onClick={() => {
                handleDeleteToFavorite(rowData._id);
              }}
            >
              Bỏ theo dõi
            </button>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  );
}

export default FavoriteTable;
