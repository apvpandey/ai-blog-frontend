import React, { createContext, useContext, useState, useEffect } from "react";
import { getFromStorage, saveToStorage, generateId } from "../utils/storage";
import axios from "axios";

const ADMIN_CREDENTIALS = {
  name: "Admin",
  phone: "9999999999",
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [users, setUsers] = useState(() => getFromStorage("blog_users", []));
  const [blogs, setBlogs] = useState(() => getFromStorage("blog_posts", []));
  const [currentUser, setCurrentUser] = useState(() =>
    getFromStorage("current_user", null),
  );
  const [isAdmin, setIsAdmin] = useState(() =>
    getFromStorage("is_admin", false),
  );

  // Persist to localStorage whenever state changes
  useEffect(() => {
    saveToStorage("blog_users", users);
  }, [users]);
  useEffect(() => {
    saveToStorage("blog_posts", blogs);
  }, [blogs]);
  useEffect(() => {
    saveToStorage("current_user", currentUser);
  }, [currentUser]);
  useEffect(() => {
    saveToStorage("is_admin", isAdmin);
  }, [isAdmin]);

  // Register a new user

  async function registerUser(name) {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
        {
          name,
        },
      );

      setCurrentUser(data.user);

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      };
    }
  }

  // Login existing user
  function loginUser(name) {
    const trimmed = name.trim();
    const user = users.find(
      (u) => u.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!user) {
      return {
        success: false,
        error: "User not found. Please register first.",
      };
    }
    setCurrentUser(user);
    return { success: true, user };
  }

  // Admin login
  function loginAdmin(name, phone) {
    if (
      name.trim() === ADMIN_CREDENTIALS.name &&
      phone.trim() === ADMIN_CREDENTIALS.phone
    ) {
      setIsAdmin(true);
      return { success: true };
    }
    return {
      success: false,
      error: "Invalid admin credentials. Try Admin / 9999999999",
    };
  }

  // Logout (both user and admin)
  function logout() {
    setCurrentUser(null);
    setIsAdmin(false);
  }

  // Create a blog post
  function createBlog(title, content) {
    if (!currentUser) return { success: false, error: "Not logged in." };
    const blog = {
      id: generateId(),
      userId: currentUser.id,
      userName: currentUser.name,
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    setBlogs((prev) => [...prev, blog]);
    return { success: true, blog };
  }

  // Edit a blog post
  function editBlog(blogId, title, content) {
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === blogId
          ? { ...b, title: title.trim(), content: content.trim() }
          : b,
      ),
    );
  }

  // Delete a blog post
  function deleteBlog(blogId) {
    setBlogs((prev) => prev.filter((b) => b.id !== blogId));
  }

  // Get blogs for a specific user
  function getBlogsByUser(userId) {
    return blogs.filter((b) => b.userId === userId);
  }

  // Get all blogs for current logged-in user
  function getMyBlogs() {
    if (!currentUser) return [];
    return blogs.filter((b) => b.userId === currentUser.id);
  }

  return (
    <AppContext.Provider
      value={{
        users,
        blogs,
        currentUser,
        isAdmin,
        registerUser,
        loginUser,
        loginAdmin,
        logout,
        createBlog,
        editBlog,
        deleteBlog,
        getBlogsByUser,
        getMyBlogs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
