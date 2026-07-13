import Modal from "./Modal";
import Button from "./Button";

export default function LastAdminWarningModal({
  isOpen,
  onClose,
  onOrganizationWithdraw,
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-overlay">
        <div className="modal-container">
          <h2>アカウントを退会できません</h2>

          <p className="mt-4">
            現在、あなたが組織内の唯一の管理者です。
          </p>

          <p className="mt-2">
            管理者が不在となるため、
            アカウントのみを退会することはできません。
          </p>

          <p className="mt-2">
            他のユーザーへ管理者権限を付与してから退会するか、
            管理するコミュニティ全体のアプリ利用を終了してください。
          </p>

          <div className="flex gap-2 justify-end mt-6">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              閉じる
            </Button>

            <Button
              variant="danger"
              onClick={onOrganizationWithdraw}
            >
              アプリ利用を終了する
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}