import { apiSlice } from "../api/apiSlice";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const booksAdapter = createEntityAdapter();

//  mục đích sinh ra state shape: {ids: [], entities: {}}
const initialState = booksAdapter.getInitialState();

export const bookApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: () => "/api/v1/books",
      transformResponse: (responseData) => {
        // khi làm việc vói mongodb ta cần phải transformResponse bởi vì normilize data cần sử dụng field id không phải _id
        const loadedBooks = responseData.data.map((book) => {
          book.id = book._id;
          return book;
        });

        return booksAdapter.setAll(initialState, loadedBooks); // đưa dữ liệu vào {ids: [], entities: {}}
      },
      providesTags: (result, error, arg) => [
        { type: "Book", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Book", id })),
      ],
    }),
  }),
});

export const { useGetBooksQuery } = bookApiSlice;

// Calling `someEndpoint.select(someArg)` generates a new selector that will return
// the query result object for a query with those parameters.
// To generate a selector for a specific query argument, call `select(theQueryArg)`.
// In this case, the users query has no params, so we don't pass anything to select()

// Ta dùng cách này bởi vì cấu trúc initialState khác với Redux Toolkit. Nên ta không sử dụng cách cũ như là const selectBooks = state => state.books được
export const selectBooksResult = bookApiSlice.endpoints.getBooks.select();

// Memorize Selector
const selectBooksData = createSelector(selectBooksResult, (booksResult) => {
  // console.log(booksResult); // kết quả 1 object chứa kết quả và quá trình fetch
  return booksResult.data; // truy xuất field data trong object promise
});

// getSelectors sử dụng kết quả trả về từ selector trước đó để tạo ra các selectors khác để truy cập dữ liệu entities.
export const {
  selectAll: selectAllBooks,
  selectById: selectBookById,
  selectIds: selectBookIds,
} = booksAdapter.getSelectors((state) => {
  // console.log(state);
  return selectBooksData(state) ?? initialState;
});
