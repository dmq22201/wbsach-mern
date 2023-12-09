import { apiSlice } from "../api/apiSlice";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const genresAdapter = createEntityAdapter();

//  mục đích sinh ra state shape: {ids: [], entities: {}}
const initialState = genresAdapter.getInitialState();

export const genreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGenres: builder.query({
      query: () => "/api/v1/genres",
      transformResponse: (responseData) => {
        // khi làm việc vói mongodb ta cần phải transformResponse bởi vì normilize data cần sử dụng field id không phải _id
        const loadedGenres = responseData.data.map((genre) => {
          genre.id = genre._id;
          return genre;
        });

        return genresAdapter.setAll(initialState, loadedGenres); // đưa dữ liệu vào {ids: [], entities: {}}
      },
      providesTags: (result, error, arg) => [
        { type: "Genre", id: "LIST" },
        ...result.ids.map((id) => ({ type: "Genre", id })),
      ],
    }),
  }),
});

export const { useGetGenresQuery } = genreApiSlice;

// Calling `someEndpoint.select(someArg)` generates a new selector that will return
// the query result object for a query with those parameters.
// To generate a selector for a specific query argument, call `select(theQueryArg)`.
// In this case, the users query has no params, so we don't pass anything to select()

// Ta dùng cách này bởi vì cấu trúc initialState khác với Redux Toolkit. Nên ta không sử dụng cách cũ như là const selectBooks = state => state.books được
export const selectGenresResult = genreApiSlice.endpoints.getGenres.select();

// Memorize Selector
const selectGenresData = createSelector(selectGenresResult, (genresResult) => {
  // console.log(booksResult); // kết quả 1 object chứa kết quả và quá trình fetch
  return genresResult.data; // truy xuất field data trong object promise
});

// getSelectors sử dụng kết quả trả về từ selector trước đó để tạo ra các selectors khác để truy cập dữ liệu entities.
export const {
  selectAll: selectAllGenres,
  selectById: selectGenreById,
  selectIds: selectGenreIds,
} = genresAdapter.getSelectors((state) => {
  // console.log(state);
  return selectGenresData(state) ?? initialState;
});
