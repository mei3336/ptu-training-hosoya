function MemberListPage() {
  const members = [
    {
      id: 1,
      name: "山田 太郎",
      email: "yamada@example.com",
      department: "営業部",
    },
    {
      id: 2,
      name: "佐藤 花子",
      email: "sato@example.com",
      department: "開発部",
    },
  ];

  return (
    <div>
      <h1>メンバー一覧</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>氏名</th>
            <th>メールアドレス</th>
            <th>部署</th>
          </tr>
        </thead>

        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>{member.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MemberListPage;