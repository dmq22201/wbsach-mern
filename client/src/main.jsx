import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./app/store.js";
import { genreApiSlice } from "./features/genres/genreApiSlice.js";
import { authorApiSlice } from "./features/authors/authorApiSlice.js";
import Theme from "./components/Theme.jsx";

// store.dispatch(bookApiSlice.endpoints.getBooks.initiate());
// store.dispatch(genreApiSlice.endpoints.getGenres.initiate());
// store.dispatch(authorApiSlice.endpoints.getAuthors.initiate());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Theme>
        <App />
      </Theme>
    </Provider>
  </React.StrictMode>,
);
