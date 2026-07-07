// hooks/useMembers.js

export function useMembers() {
  const createUser = async (formData) => {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    return response.json();
  };

  return {
    createUser,
  };
}