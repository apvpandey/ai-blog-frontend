import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import BlogCard from "../components/BlogCard";
import { useNavigate } from "react-router-dom";

export default function AllBlog() {
  const { currentUser, editBlog, deleteBlog, getAllBlog } = useApp();
  const navigate = useNavigate();
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);

        const data = await getAllBlog();
        setMyBlogs(data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchBlogs();
    } else {
      setLoading(false);
    }
  }, [currentUser, getAllBlog]);

  const handleEditBlog = async (blogId, title, content) => {
    const result = await editBlog(blogId, title, content);

    if (result.success) {
      setMyBlogs((prev) =>
        prev.map((blog) => (blog._id === blogId ? result.blog : blog)),
      );
    }

    return result;
  };

  const handleDeleteBlog = async (blogId) => {
    const result = await deleteBlog(blogId);

    if (result.success) {
      setMyBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
    }

    return result;
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar title={`Hi, ${currentUser?.name} 👋`} showLogout />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Blogs
          </h2>

          <button
            onClick={() => navigate("/create-blog")}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition"
          >
            + Create Blog
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-slate-500">Loading blogs...</p>
          </div>
        ) : myBlogs.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-sm">No blogs yet. Write your first one above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...myBlogs].reverse().map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onDelete={handleDeleteBlog}
                onEdit={handleEditBlog}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
