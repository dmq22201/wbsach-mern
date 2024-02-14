import React from "react";

const Input = React.forwardRef(function Input({ type, ...props }, ref) {
  if (type === "checkbox" || type === "radio") {
    return (
      <input
        type={type}
        ref={ref}
        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-violet-600 focus:ring-2 focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-violet-600"
        {...props}
      />
    );
  }

  if (type === "file") {
    return (
      <input
        ref={ref}
        type="file"
        className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
        {...props}
      />
    );
  }

  return (
    <input
      type={type}
      ref={ref}
      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-black focus:border-violet-500 focus:outline-none focus:ring-violet-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-violet-500 dark:focus:ring-violet-500"
      {...props}
    />
  );
});

export default Input;
