import "../styles/member-card-base.css";
import Badge from "./badge";
import Avatar from "./Avatar";

function MemberCard({ member, onClick }) {
  
  const ROLE_MAP = {
    admin: '管理者',
    member: '一般メンバー'
  };

  return (
    <div
      className="member-card"
      onClick={() => onClick?.(member)}
    >
    <div className="member-top">
      console.log(user);
      <Avatar
        className="member-avatar"
          src={member.icon_image_url}
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
          {ROLE_MAP[member.role] || '未設定'}
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