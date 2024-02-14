function BookSortby({ sortby, searchParams, setSearchParams }) {
  const handleSetSortby = (e) => {
    searchParams.set("sortby", e.target.value);
    setSearchParams(searchParams);
  };

  return (
    <select
      id="filterBooks"
      className="block w-fit rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm font-semibold text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-violet-500 dark:focus:ring-violet-500"
      defaultValue={sortby ?? "price"}
      onChange={(e) => handleSetSortby(e)}
    >
      <option value="price">Giá từ thấp tới cao</option>
      <option value="-price">Giá từ cao tới thấp</option>
    </select>
  );
}

export default BookSortby;
