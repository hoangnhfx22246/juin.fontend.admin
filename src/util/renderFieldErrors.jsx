const renderFieldErrors = (fieldName, error) => {
  const fieldError =
    (Array.isArray(error) && error.filter((err) => err.field === fieldName)) ||
    [];

  if (fieldError?.length === 0) return; // Không có lỗi cho trường này

  return (
    <div className="rounded-md bg-red-50 p-4">
      {fieldError.map((err) =>
        err.messages.map((message, i) => (
          <div key={`${fieldName}-${i}`} className="text-sm text-red-700">
            {message}
          </div>
        ))
      )}
    </div>
  );
};
export default renderFieldErrors;
