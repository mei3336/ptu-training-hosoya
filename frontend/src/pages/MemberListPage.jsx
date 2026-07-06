import MemberCard from "../components/MemberCard";

function MemberListPage() {
  const members = [
    {
      id: 1,
      name: "田中 一郎",
      nickname: "いっちゃん",
      role: "admin",
      roleLabel: "管理者",

      bio: "町内会の清掃活動や防災訓練によく参加しています。地域のみなさんと交流するのが楽しみです。",
      avatarUrl: "",
    },
    {
      id: 2,
      name: "鈴木 恵子",
      nickname: "けいこさん",
      role: "member",
      roleLabel: "メンバー",
      bio: "季節のイベントや夏祭りのお手伝いをしています。気軽に声をかけてください。",
      avatarUrl: "",
    },
  ];
  
  return (
    <div>
      <h1>メンバー一覧</h1>
      
      <div className="member-list">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onClick={() => console.log(member)}
          />
        ))}
      </div>

    </div>
  );
}

export default MemberListPage;