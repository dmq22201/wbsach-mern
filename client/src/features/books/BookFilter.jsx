import { useState } from "react";
import { HiOutlineFilter } from "react-icons/hi";
import { useSelector } from "react-redux";

import Button from "../../components/Button";
import Modal from "../../components/Modal";

function BookFilter() {
  const [filter, setFilter] = useState({});

  const handleFilter = (filterInput) => {};

  return (
    <Modal>
      <Modal.Open id="filter">
        <Button component="button" type="outline">
          <HiOutlineFilter />
          <span className="font-roboto">Bộ lọc</span>
        </Button>
      </Modal.Open>
      <Modal.Window id="filter">
        <div className="flex flex-col gap-10">
          {/* Thể loại */}
          <div className="flex flex-col gap-6">
            <p className="font-roboto text-xl font-medium">Thể loại</p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
              {/* {genres.map((genre) => {
                return (
                  <div
                    className="flex flex-row items-center gap-2"
                    key={genre.slug}
                  >
                    <input
                      value={genre.slug}
                      id={genre.slug}
                      name={genre.slug}
                      type="checkbox"
                    />
                    <label
                      htmlFor={genre.slug}
                      className="text-sm lg:text-base"
                    >
                      {genre.name} <span>({genre.books.length})</span>
                    </label>
                  </div>
                );
              })} */}
            </div>
          </div>

          {/* Giá */}
          <div className="flex flex-col gap-6">
            <p className="font-roboto text-xl font-medium">Giá</p>
          </div>
        </div>
      </Modal.Window>
    </Modal>
  );
}

export default BookFilter;
