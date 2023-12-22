import { apiSlice } from "../api/apiSlice";

export const authorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuthors: builder.query({
      query: () => "/api/v1/authors",
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Authors", id })),
              { type: "Authors", id: "LIST" },
            ]
          : [{ type: "Authors", id: "LIST" }],
    }),
  }),
});

export const { useGetAuthorsQuery } = authorApiSlice;
