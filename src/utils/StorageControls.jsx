// src/utils/StorageControls.jsx

const STORAGE_KEY = "user";

// Save user object to localStorage
export const saveUserToStorage = (user) => {
  if (user && typeof user === "object") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
};

// Retrieve user object from localStorage
export const getUserFromStorage = () => {
  const user = localStorage.getItem(STORAGE_KEY);
  return user ? JSON.parse(user) : null;
};

// Remove user from localStorage
export const removeUserFromStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// Check if user is logged in
export const isUserLoggedIn = () => {
  return !!getUserFromStorage();
};
