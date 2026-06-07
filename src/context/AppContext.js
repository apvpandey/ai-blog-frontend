import React, { createContext, useContext, useState, useEffect } from "react";
import { getFromStorage, saveToStorage, generateId } from "../utils/storage";
import axios from "axios";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [users, setUsers] = useState(() => getFromStorage("blog_users", []));
  const [currentUser, setCurrentUser] = useState(() =>
    getFromStorage("current_user", null),
  );
  const [isAdmin, setIsAdmin] = useState(() =>
    getFromStorage("is_admin", false),
  );

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
      saveToStorage("current_user", data.user);

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
  async function loginUser(name) {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        {
          name,
        },
      );

      setCurrentUser(data.data);
      saveToStorage("current_user", data.data);

      return {
        success: true,
        user: data.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Login failed",
      };
    }
  }

  // Admin login
  async function loginAdmin(name, phoneNo) {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/admin-login`,
        {
          name,
          phoneNo,
        },
      );

      setIsAdmin(true);
      saveToStorage("is_admin", true);

      return {
        success: true,
        admin: data.admin,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Admin login failed",
      };
    }
  }

  // Logout (both user and admin)
  function logout() {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.clear();
  }

  // Create a blog post
  async function createBlog(title, content) {
    try {
      if (!currentUser) {
        return { success: false, error: "Not logged in." };
      }
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/blogs`,
        {
          userId: currentUser._id,
          title: title.trim(),
          content: content.trim(),
        },
      );

      return {
        success: true,
        blog: data.blog,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  // Edit a blog post
  async function editBlog(blogId, title, content) {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/blogs/${blogId}`,
        {
          title: title,
          content: content,
        },
      );

      return { success: true, blog: data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update blog",
      };
    }
  }

  // Delete a blog post
  async function deleteBlog(blogId) {
    try {
    await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/blogs/${blogId}`
    );

    return { success: true };
  } catch (error) {
    console.error("Delete blog error:", error);

    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete blog",
    };
  }
  }

  async function getBlogsByUser(userId) {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/blogs/user/${userId}`,
      );

      return data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to fetch blogs",
      };
    }
  }

  async function getMyBlogs() {
    try {
      if (!currentUser) return [];

      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/user/${currentUser.id}`,
      );

      return data.blogs;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function getAllBlog() {
    try {
      if (!currentUser) return [];
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/blogs/all`,
      );
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function getAllUser() {
    try {
      if (!isAdmin) return [];
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/auth/user`,
      );

      return data.users;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  return (
    <AppContext.Provider
      value={{
        getAllUser,
        // blogs,
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
        getAllBlog,
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
