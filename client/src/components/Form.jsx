function Form({ children, onSubmit, headingText }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {headingText && (
        <span className="block pb-6 text-center text-xl font-medium uppercase sm:text-2xl">
          {headingText}
        </span>
      )}
      {children}
    </form>
  );
}

export default Form;
