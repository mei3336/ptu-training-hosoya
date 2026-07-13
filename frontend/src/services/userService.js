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
    throw {
      response: {
        status: response.status,
        data: data,
      }
    }
  }
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
        throw {
      response: {
        status: response.status,
        data: data,
      }
    }
  }
};
