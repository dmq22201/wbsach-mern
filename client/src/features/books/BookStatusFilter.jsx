function BookStatusFilter({ status, searchParams, setSearchParams }) {
  const handleSetFilterStatus = (status) => {
    searchParams.set("page", 1);
    searchParams.set("status", status);
    setSearchParams(searchParams);
  };

  return (
    <div className="flex snap-x snap-mandatory items-center gap-6 overflow-auto">
      <button
        className={`flex-shrink-0 snap-center p-2 transition-all ${
          status === "inStock" ? "rounded-lg bg-violet-500 text-white" : ""
        }`}
        onClick={() => handleSetFilterStatus("inStock")}
      >
        Còn hàng
      </button>
      <button
        className={`flex-shrink-0 snap-center p-2 transition-all ${
          status === "outOfStock" ? "rounded-lg bg-violet-500 text-white" : ""
        }`}
        onClick={() => handleSetFilterStatus("outOfStock")}
      >
        Hết hàng
      </button>
    </div>
  );
}

export default BookStatusFilter;
