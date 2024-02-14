import { HiOutlineFilter } from "react-icons/hi";
import { useGetGenresQuery } from "../genres/genreApiSlice";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import BookFilterForm from "./BookFilterForm";

function BookFilter() {
  const {
    data: genres,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetGenresQuery();

  let content;

  if (isLoading) {
    content = <h1>Loading</h1>;
  } else if (isError) {
    content = <h1>Error</h1>;
  } else if (isSuccess) {
    content = <BookFilterForm genres={genres} />;
  }

  return (
    <Modal>
      <Modal.Open id="filter">
        <Button component="button" type="outline">
          <HiOutlineFilter />
          <span className="font-roboto">Bộ lọc</span>
        </Button>
      </Modal.Open>
      <Modal.Window id="filter" isCloseWhenClickOuside={false}>
        {content}
      </Modal.Window>
    </Modal>
  );
}

export default BookFilter;
