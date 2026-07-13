import Modal from "./Modal";
import Button from "./Button";

const roleLabels = {
  admin: "管理者",
  member: "一般メンバー",
};

export default function ConfirmRoleModal({
  isOpen,
  onClose,
  user,
  role,
  onConfirm,
  isSubmitting = false,
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-overlay">
        <div className="modal-container">
          <h2>権限変更の確認</h2>

          <p>
            {user?.name} さんの権限を
            <strong>「{roleLabels[role]}」</strong>
            に変更しますか？
          </p>

          <div className="flex gap-2 justify-end mt-6">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>

            <Button
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "処理中..." : "OK"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}