const API_BASE_URL = "http://localhost:3000/api/v1";

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      data,
    };
  }

  return data;
};
export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  return response.json();
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_BASE_URL}/me`, {
    credentials: "include",
  });

  return response.json();
};

export const verifyMfaLogin = async (userId, code) => {
  const response = await fetch(`${API_BASE_URL}/mfa/verify_login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ user_id: userId, code }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      data,
    };
  }

  return data;
};

export const setupMfa = async () => {
  const response = await fetch(`${API_BASE_URL}/mfa/setup`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw { status: response.status, data };
  }

  return data;
};

export const verifyMfaSetup = async (secret, code) => {
  const response = await fetch(`${API_BASE_URL}/mfa/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ secret, code }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw { status: response.status, data };
  }

  return data;
};

export const disableMfa = async () => {
  const response = await fetch(`${API_BASE_URL}/mfa`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw { status: response.status, data };
  }

  return data;
};