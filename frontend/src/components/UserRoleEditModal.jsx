import { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";

export default function UserRoleModal({
  isOpen,
  onClose,
  user,
  onUpdate,
}) {
  const [role, setRole] = useState("");

  useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);
  const originalRole = user?.role;

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-overlay">
        <div className="modal-container">
          <h2>ユーザー権限変更</h2>

          <p>
            {user?.name} さんの権限を変更しますか？
          </p>

          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
              />
              管理者
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="member"
                checked={role === "member"}
                onChange={(e) => setRole(e.target.value)}
              />
              一般メンバー
            </label>
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              キャンセル
            </Button>

            <Button
              disabled={role === originalRole}
              onClick={() => onUpdate(user.id, role)}
            >
              更新する
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}