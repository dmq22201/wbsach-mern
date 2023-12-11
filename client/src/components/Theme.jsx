import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

function Theme({ children }) {
  const [theme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme")) ?? "light",
  );

  const handleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.remove("dark");
    }

    if (theme === "dark") {
      document.body.classList.add("dark");
    }

    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ handleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default Theme;
