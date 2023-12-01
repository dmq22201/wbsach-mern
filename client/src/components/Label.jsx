function Label({ children, ...props }) {
  return (
    <label className="font-medium" {...props}>
      {children}
    </label>
  );
}

export default Label;
