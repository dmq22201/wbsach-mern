function InputMsg({ msg, msgFromServer, isFromServer = false }) {
  if (isFromServer) {
    const states = {
      error: "text-red-600 bg-red-100 dark:text-white dark:bg-red-600",
      success: "text-green-600 bg-green-100 dark:text-white dark:bg-green-600",
    };

    let stateClass;
    if (msgFromServer?.status === "success") {
      stateClass = states["success"];
    } else if (msgFromServer?.status === "fail") {
      stateClass = states["error"];
    } else if (msgFromServer?.status === "error") {
      stateClass = states["error"];
    } else {
      stateClass = states["error"];
    }

    return (
      <p className={`rounded-lg p-3 font-medium ${stateClass}`}>
        {msgFromServer?.message ||
          "Hiện tại không thể xử lý yêu cầu của bạn. Vui lòng thử lại sau"}
      </p>
    );
  }

  return <p className="font-medium text-red-600 dark:text-red-400">{msg}</p>;
}

export default InputMsg;
