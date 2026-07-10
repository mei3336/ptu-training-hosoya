import Modal from "./Modal";
import Button from "./Button";

export default function OrganizationWithdrawModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-overlay">
        <div className="modal-container">
          <h2 className="text-red-600">
            アプリ利用終了の確認
          </h2>

          <p className="mt-4">
            アプリ利用を終了すると、
            コミュニティに登録されているすべてのユーザー情報
            および関連データが削除されます。
          </p>

          <p className="mt-2 font-bold text-red-600">
            この操作は取り消せません。
          </p>

          <p className="mt-2">
            本当にアプリ利用を終了しますか？
          </p>

          <div className="flex gap-2 justify-end mt-6">
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
              利用を終了する
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}