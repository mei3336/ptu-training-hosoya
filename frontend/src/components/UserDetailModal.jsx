import Modal from "./Modal";
import Avatar from "./Avatar";
import Badge from "./badge";
import Button from "./Button";
import "../styles/member-card-base.css";

export default function UserDetailModal({ isOpen, onClose, member }) {
  if (!member) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="member-card-base">
        <div className="member-top">
          <Avatar
            className="member-avatar"
            src={member.avatarUrl}
            fallback={member.name.charAt(0)}
          />

          <div className="member-content">
            <h3 className="member-name">{member.name}</h3>
            <p className="member-nickname">@{member.nickname}</p>
            <Badge role={member.role}>{member.roleLabel}</Badge>
          </div>
        </div>

        <div className="member-bio-container  border-t pt-3 mt-1">
          <p className="member-bio">{member.bio}</p>
        </div>

        <Button variant="secondary"
          onClick={onClose}
          className="mt-4 w-full text-white py-2 rounded-lg"
        >
          閉じる
        </Button>
      </div>
    </Modal>
  );
}

