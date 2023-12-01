import React from "react";

const Input = React.forwardRef(function Input({ type, state, ...props }, ref) {
  const types = {
    text: "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-violet-500 focus:ring-violet-500 disabled:cursor-not-allowed disabled:bg-gray-100 focus:outline-none transition-colors",
    password:
      "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-violet-500 focus:ring-violet-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 transition-colors",
    checkbox:
      "w-4 h-4 text-violet-600 bg-gray-100 border-gray-300 rounded focus:ring-violet-500",
    radio: "",
    file: "block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100",
  };

  const states = {
    success:
      "bg-green-50 border border-green-500 text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 transition-colors",
    error:
      "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 transition-colors",
  };

  return (
    <input
      state={state}
      ref={ref}
      type={type}
      className={`${types[type]} ${states[state]}`}
      {...props}
    />
  );
});

export default Input;
