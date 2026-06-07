import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import BlogCard from "../components/BlogCard";

export default function AllBlog() {
  const { currentUser, editBlog, deleteBlog, getAllBlog } = useApp();

  const [myBlogs, setMyBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const data = await getAllBlog();
      setMyBlogs(data || []);
    };

    if (currentUser) {
      fetchBlogs();
    }
  }, [currentUser, getAllBlog, myBlogs]);

  const handleEditBlog = async (blogId, title, content) => {
    console.log("blogId", blogId);
    const result = await editBlog(blogId, title, content);

    console.log("result", result);

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
        <div>
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">
            Blogs
          </h2>

          {myBlogs.length === 0 ? (
            <div className="text-center py-16 text-slate-600">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-sm">
                No blogs yet. Write your first one above!
              </p>
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
    </div>
  );
}
