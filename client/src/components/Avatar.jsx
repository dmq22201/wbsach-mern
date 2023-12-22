import { EmptyAvatar } from "./Icons";

function Avatar({ currentUser, size }) {
  const generalClass = "inline-block rounded-full object-cover";

  const sizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-14 h-14",
    big: "w-28 h-28",
  };

  return (
    <img
      src={currentUser.avatar}
      className={`${generalClass} ${sizes[size]}`}
      alt={`Ảnh đại diện của ${currentUser.fullName}`}
    />
  );
}

export default Avatar;
