function InputMsg({ msg, msgFromServer, isFromServer = false }) {
  if (isFromServer) {
    const states = {
      error: "text-red-600 bg-red-100",
      success: "text-green-600 bg-green-100",
    };

    return (
      <p
        className={`rounded-lg p-3 font-medium ${
          msgFromServer.status === "success"
            ? states["success"]
            : states["error"]
        }`}
      >
        {msgFromServer?.message ||
          "Hiện tại không thể xử lý yêu cầu của bạn. Vui lòng thử lại sau"}
      </p>
    );
  }

  return <p className="text-sm font-medium text-red-600">{msg}</p>;
}

export default InputMsg;
