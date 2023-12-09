function BookSortby() {
  return (
    <select
      id="filterBooks"
      className="block w-fit border border-gray-300 bg-gray-50 p-2.5 text-sm font-semibold text-gray-900 transition-all hover:border-violet-500 focus:border-violet-500 focus:outline-none focus:ring-violet-500"
    >
      <option selected disabled>
        Sắp xếp theo
      </option>
      <option value="price">Giá từ thấp tới cao</option>
      <option value="-price">Giá từ cao tới thấp</option>
    </select>
  );
}

export default BookSortby;
