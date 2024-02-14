function Switch({ val, handleFn }) {
  return (
    <div
      className={`flex h-6 w-12 rounded-full  transition-all ${
        val === "dark" ? "bg-violet-500" : "bg-slate-500"
      }`}
      onClick={handleFn}
    >
      <span
        className={`h-6 w-6 rounded-full bg-white transition-all ${
          val === "dark" ? "ml-6" : ""
        }`}
      ></span>
    </div>
  );
}

export default Switch;
