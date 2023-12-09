import { apiSlice } from "../api/apiSlice";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const authorsAdapter = createEntityAdapter();

//  mục đích sinh ra state shape: {ids: [], entities: {}}
const initialState = authorsAdapter.getInitialState();

export const authorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuthors: builder.query({
      query: () => "/api/v1/authors",
      transformResponse: (responseData) => {
        // khi làm việc vói mongodb ta cần phải transformResponse bởi vì normilize data cần sử dụng field id không phải _id
        const loadedAuthors = responseData.data.map((author) => {
          author.id = author._id;
          return author;
        });

        return authorsAdapter.setAll(initialState, loadedAuthors); // đưa dữ liệu vào {ids: [], entities: {}}
      },
      providesTags: (result, error, arg) => [
        { type: "Author", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Author", id })),
      ],
    }),
  }),
});

export const { useGetAuthorsQuery } = authorApiSlice;

// Calling `someEndpoint.select(someArg)` generates a new selector that will return
// the query result object for a query with those parameters.
// To generate a selector for a specific query argument, call `select(theQueryArg)`.
// In this case, the users query has no params, so we don't pass anything to select()

// Ta dùng cách này bởi vì cấu trúc initialState khác với Redux Toolkit. Nên ta không sử dụng cách cũ như là const selectBooks = state => state.books được
export const selectAuthorsResult = authorApiSlice.endpoints.getAuthors.select();

// Memorize Selector
const selectAuthorsData = createSelector(
  selectAuthorsResult,
  (authorsResult) => {
    // console.log(booksResult); // kết quả 1 object chứa kết quả và quá trình fetch
    return authorsResult.data; // truy xuất field data trong object promise
  },
);

// getSelectors sử dụng kết quả trả về từ selector trước đó để tạo ra các selectors khác để truy cập dữ liệu entities.
export const {
  selectAll: selectAllAuthors,
  selectById: selectAuthorId,
  selectIds: selectAuthorIds,
} = authorsAdapter.getSelectors((state) => {
  // console.log(state);
  return selectAuthorsData(state) ?? initialState;
});
