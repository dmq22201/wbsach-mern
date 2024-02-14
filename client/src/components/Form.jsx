function Form({ children, onSubmit, headingText, className, ...props }) {
  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-6 ${className}`}
      {...props}
    >
      {headingText && (
        <span className="block pb-6 text-center font-roboto text-xl font-medium uppercase dark:text-white sm:text-2xl">
          {headingText}
        </span>
      )}
      {children}
    </form>
  );
}

export default Form;
