import {
  HiChevronDoubleLeft,
  HiChevronLeft,
  HiChevronDoubleRight,
  HiChevronRight,
} from "react-icons/hi2";
import { useForm } from "react-hook-form";

import Form from "./Form";
import Input from "./Input";
import InputGroup from "./InputGroup";
import Button from "./Button";

function Pagination({ books, currentPage, searchParams, setSearchParams }) {
  const gotoPage = searchParams.get("page") ?? 1;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      gotoPage,
    },
  });

  const handlePreviousPage = () => {
    if (currentPage < 1) {
      searchParams.set("page", 1);
      setSearchParams(searchParams);
    } else {
      searchParams.set("page", currentPage - 1);
      setSearchParams(searchParams);
    }
  };

  const handleNextPage = () => {
    if (currentPage > books.totalPages) return;
    searchParams.set("page", currentPage + 1);
    setSearchParams(searchParams);
  };

  const onSubmit = (data) => {
    searchParams.set("page", data.gotoPage);
    setSearchParams(searchParams);
  };

  return (
    <div className="mt-8 flex flex-col items-center justify-center gap-6 font-roboto font-semibold md:flex-row md:justify-start">
      <div className="flex items-center gap-2">
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
            className="flex h-8 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <HiChevronLeft />
            <span>Trước</span>
          </button>
        </div>

        <div className="flex gap-2 text-xs md:text-base">
          <span>
            {currentPage} / {books.totalPages}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            disabled={currentPage >= books.totalPages}
            className="flex h-8 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            onClick={handleNextPage}
          >
            <span>Sau</span>
            <HiChevronRight />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <Form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <InputGroup isVertical={false} isHorizontal={true}>
            <Input
              type="number"
              min="1"
              max={books.totalPages}
              {...register("gotoPage")}
            />
            <Button type="primary" component="button">
              GO
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
}

export default Pagination;
