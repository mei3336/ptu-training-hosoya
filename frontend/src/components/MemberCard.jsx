import "./MemberCard.css";
import Badge from "./badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

function MemberCard({ member, onClick }) {
  return (
    <div
      className="member-card"
      onClick={() => onClick?.(member)}
    >
      <Avatar className="member-avatar">
        <AvatarImage src={member.avatarUrl} />

        <AvatarFallback>
          {member.name?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="member-content">
        <h3 className="member-name">
          {member.name}
        </h3>

        <p className="member-nickname">
          @{member.nickname}
        </p>

        <Badge
          className={
            member.role === "admin"
              ? "badge-admin"
              : "badge-member"
          }
        >
          {member.roleLabel}
        </Badge>

        <p className="member-bio">
          {member.bio}
        </p>
      </div>
    </div>
  );
}

export default MemberCard;