export const ConfirmDialog = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white/10 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4">Confirm Invite</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700  cursor-pointer"
          >
            Invite
          </button>
        </div>
      </div>
    </div>
  );
};
