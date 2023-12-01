function InputGroup({ children, isHorizontal, isVertical = true }) {
  if (isVertical) return <div className="flex flex-col gap-2">{children}</div>;
  if (isHorizontal) return <div className="flex gap-2">{children}</div>;
}

export default InputGroup;
