export const ConfirmDialog = ({
  heading,
  isOpen,
  onConfirm,
  onCancel,
  message,
  btnText,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center z-50"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white/10 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4">{heading}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="rounded-md border border-gray-700 px-6 py-2 hover:border-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700  cursor-pointer"
          >
            {btnText}
          </button>
        </div>
      </div>
    </div>
  );
};
