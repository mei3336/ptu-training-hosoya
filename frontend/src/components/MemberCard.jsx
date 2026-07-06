import "./MemberCard.css";
import Badge from "./badge";
import Avatar from "./Avatar";

function MemberCard({ member, onClick }) {
  return (
    <div
      className="member-card"
      onClick={() => onClick?.(member)}
    >
    <div className="member-top">
      <Avatar className="member-avatar"
        src={member.avatarUrl}
        fallback={member.name.charAt(0)}
      />

      <div className="member-content">
        <h3 className="member-name">
          {member.name}
        </h3>

        <p className="member-nickname">
          @{member.nickname}
        </p>

        <Badge role={member.role}>
          {member.roleLabel}
        </Badge>
      </div>
    </div>
    <div className="member-bio-container border-t pt-3 mt-1">
      <p className="member-bio">
        {member.bio}
      </p>
      </div>
    </div>
  );
}

export default MemberCard;