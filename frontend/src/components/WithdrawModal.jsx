import Modal from "./Modal";
import Button from "./Button";

export default function WithdrawModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-overlay">
        <div className="modal-container">
          <h2>アカウント退会</h2>

          <p className="mt-4">
            アカウントを退会します。
          </p>

          <p className="mt-2">
            退会すると、あなたのアカウント情報は削除され、
            現在の組織へログインできなくなります。
          </p>

          <p className="mt-2">
            よろしいですか？
          </p>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              キャンセル
            </Button>

            <Button
              variant="danger"
              onClick={onConfirm}
            >
              退会する
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}