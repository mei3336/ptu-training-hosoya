export const createUser = async (userData) => {
  const response = await fetch(
    "http://localhost:3000/api/v1/users",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userData,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.join(", ") || "登録失敗");
  }

  return data;
};