import { apiSlice } from "../api/apiSlice";

export const genreApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGenres: builder.query({
      query: () => "/api/v1/genres",
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Genres", id })),
              { type: "Genres", id: "LIST" },
            ]
          : [{ type: "Genres", id: "LIST" }],
    }),
  }),
});

export const { useGetGenresQuery } = genreApiSlice;
