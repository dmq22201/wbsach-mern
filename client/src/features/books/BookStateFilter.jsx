function BookStateFilter() {
  return (
    <div className="flex snap-x snap-mandatory gap-6 overflow-auto">
      <button className="flex-shrink-0 snap-center">Tất cả</button>
      <button className="flex-shrink-0 snap-center">Còn hàng</button>
      <button className="flex-shrink-0 snap-center">Hết hàng</button>
      <button className="flex-shrink-0 snap-center">Đang giảm giá</button>
    </div>
  );
}

export default BookStateFilter;
