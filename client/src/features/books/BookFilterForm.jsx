import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

import InputGroup from "../../components/InputGroup";
import Label from "../../components/Label";
import Form from "../../components/Form";
import Button from "../../components/Button";
import Input from "../../components/Input";

function BookFilterForm({ genres, onCloseModal }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      minPrice: searchParams.get("minPrice") ?? 100000,
      maxPrice: searchParams.get("maxPrice") ?? 1000000,
      genres: searchParams.get("genres")
        ? [...searchParams.get("genres").split(",")]
        : [],
    },
  });

  const onSubmit = (data) => {
    const strGenres = data.genres.join(",");
    searchParams.set("genres", strGenres);
    searchParams.set("minPrice", data.minPrice);
    searchParams.set("maxPrice", data.maxPrice);
    setSearchParams(searchParams);

    onCloseModal?.();
  };

  return (
    <div className="flex flex-col gap-10 overflow-auto">
      {/* Thể loại */}
      <div className="flex flex-col gap-6 divide-y divide-slate-200 dark:divide-slate-700">
        <p className="font-roboto text-xl font-medium">Thể loại</p>
        <div className="grid max-h-52 grid-cols-1 gap-6 overflow-auto pt-6 md:grid-cols-3 lg:max-h-full lg:grid-cols-5">
          {genres.data.map((genre) => {
            return (
              <div
                key={genre.slug}
                className="flex flex-row items-center gap-2"
              >
                <Input
                  value={genre.slug}
                  id={genre.slug}
                  type="checkbox"
                  {...register("genres")}
                />
                <label
                  htmlFor={genre.slug}
                  className="text-sm capitalize lg:text-base"
                >
                  {genre.name} <span>({genre.books.length})</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
      {/* Giá */}
      <div className="flex flex-col gap-6 divide-y divide-slate-200 dark:divide-slate-700">
        <p className="font-roboto text-xl font-medium">Giá</p>
        <div className="pt-6">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center gap-6">
              <InputGroup isVertical={false} isHorizontal={true}>
                <Label htmlFor="minPrice">Từ</Label>
                <Input
                  type="number"
                  placeholder="Giá nhỏ nhất"
                  id="minPrice"
                  min="100000"
                  max="1000000"
                  autoComplete="on"
                  {...register("minPrice")}
                />
              </InputGroup>
              <InputGroup isVertical={false} isHorizontal={true}>
                <Label htmlFor="maxPrice">Tới</Label>
                <Input
                  type="number"
                  placeholder="Giá lớn nhất"
                  id="maxPrice"
                  min="100000"
                  max="1000000"
                  autoComplete="on"
                  {...register("maxPrice")}
                />
              </InputGroup>
            </div>
            {/* Buttons */}
            <div className="ml-auto flex items-center gap-6">
              <Button
                component="button"
                type="danger"
                onClick={() => {
                  navigate("/books", { replace: true });
                  onCloseModal?.();
                }}
              >
                Xóa bộ lọc
              </Button>
              <Button component="button" type="success">
                Lọc sản phẩm
              </Button>
              <Button
                component="button"
                type="outline"
                canSubmit={false}
                onClick={() => onCloseModal?.()}
              >
                Hủy
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default BookFilterForm;
