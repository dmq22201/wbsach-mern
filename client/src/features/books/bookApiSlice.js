import { apiSlice } from "../api/apiSlice";

export const bookApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: (filter) => {
        return {
          url: `/api/v1/books/`,
          params: { ...filter },
        };
      },
    }),
    providesTags: (result, error, arg) =>
      result
        ? [
            ...result.data.map(({ id }) => ({ type: "Books", id })),
            { type: "Books", id: "PARTIAL-LIST" },
          ]
        : [{ type: "Books", id: "PARTIAL-LIST" }],
  }),
});

export const { useGetBooksQuery } = bookApiSlice;
