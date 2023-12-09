function Label({ children, ...props }) {
  return (
    <label className="font-roboto font-medium dark:text-white" {...props}>
      {children}
    </label>
  );
}

export default Label;
