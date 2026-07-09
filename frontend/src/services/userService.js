export const createUser = async (userData) => {
  const formData = new FormData();

  Object.entries(userData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(`user[${key}]`, value);
    }
  });

  const response = await fetch(
    "http://localhost:3000/api/v1/users",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.join(", ") || "登録失敗");
  }

  return data;
};

export const editUser = async (id, userData) => {
  const formData = new FormData();

  Object.entries(userData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(`user[${key}]`, value);
    }
  });

  const response = await fetch(
    `http://localhost:3000/api/v1/users/${id}`,
    {
      method: "PATCH",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.join(", ") || "更新失敗");
  }

  return data;
};
