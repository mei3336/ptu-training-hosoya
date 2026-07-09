import Modal from "./Modal";
import Button from "./Button";

export default function UserDeleteModal({
  isOpen,
  onClose,
  user,
  onDelete,
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>ユーザー削除</h2>

            <p>
            {user?.name} さんを削除しますか？
            </p>

            <div className="flex gap-2 justify-end">
                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    キャンセル
                </Button>

                <Button
                    variant="danger"
                    onClick={onDelete}
                >
                    削除する
                </Button>
            </div>
          </div>
        </div>
    </Modal>
  );
}