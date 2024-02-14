function BookLimitPerPage({ limit, searchParams, setSearchParams }) {
  const handleSetLimitItemsPerPage = (e) => {
    searchParams.set("page", 1);
    searchParams.set("limit", e.target.value);
    setSearchParams(searchParams);
  };

  return (
    <select
      id="filterBooks"
      className="block w-fit rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm font-semibold text-gray-900 focus:border-violet-500 focus:outline-none focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-violet-500 dark:focus:ring-violet-500"
      defaultValue={limit}
      onChange={(e) => handleSetLimitItemsPerPage(e)}
    >
      <option value="8">Số lượng hiển thị / trang: 8</option>
      <option value="12">Số lượng hiển thị / trang: 12</option>
    </select>
  );
}

export default BookLimitPerPage;
