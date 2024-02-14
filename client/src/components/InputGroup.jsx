function InputGroup({ children, isHorizontal, isVertical = true }) {
  if (isVertical)
    return (
      <div className="flex flex-col gap-2 dark:text-gray-100">{children}</div>
    );

  if (isHorizontal)
    return (
      <div className="flex items-center gap-2 dark:text-gray-100">
        {children}
      </div>
    );
}

export default InputGroup;
