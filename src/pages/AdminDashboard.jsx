import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import BlogCard from "../components/BlogCard";

export default function AdminDashboard() {
  const { getAllUser, deleteBlog, getBlogsByUser } = useApp();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUser();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [getAllUser]);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!selectedUser) {
        setSelectedBlogs([]);
        return;
      }

      try {
        setLoadingBlogs(true);
        const blogs = await getBlogsByUser(selectedUser._id);
        setSelectedBlogs(Array.isArray(blogs) ? blogs : []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setSelectedBlogs([]);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchUserBlogs();
  }, [selectedUser, getBlogsByUser]);

  const handleDeleteBlog = async (blogId) => {
    try {
      await deleteBlog(blogId);

      const blogs = await getBlogsByUser(selectedUser._id);

      setSelectedBlogs(Array.isArray(blogs) ? blogs : []);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  console.log("selectedBlogs", selectedBlogs);

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar title="Admin Dashboard" showLogout />

      <div className="flex h-[calc(100vh-57px)]">
        <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden">
          <div className="px-4 py-4 border-b border-slate-800">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Registered Users ({users.length})
            </h2>
          </div>

          <div className="overflow-y-auto flex-1 p-3 space-y-1">
            {users.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-8">
                No users found.
              </p>
            ) : (
              users.map((user) => {
                const isActive = selectedUser?._id === user._id;

                return (
                  <button
                    key={user._id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full text-left px-3 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-slate-800 border border-indigo-500/40"
                        : "border border-transparent hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-900/50 border border-indigo-700/40 flex items-center justify-center text-indigo-300 font-bold text-sm flex-shrink-0">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>

                      <div className="min-w-0">
                        <p className="text-slate-200 text-sm font-semibold truncate">
                          {user.name}
                        </p>

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-600">
                            ID: {user.uniqueId}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          {selectedUser ? (
            <>
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-800">
                <div className="w-12 h-12 rounded-full bg-indigo-900/50 border border-indigo-700/40 flex items-center justify-center text-indigo-300 font-bold text-lg">
                  {selectedUser?.name?.[0]?.toUpperCase()}
                </div>

                <div>
                  <h2 className="text-slate-100 font-bold text-lg">
                    {selectedUser.name}
                  </h2>

                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs bg-slate-800 text-slate-500 border border-slate-700 rounded-md px-2 py-0.5">
                      ID: {selectedUser.uniqueId}
                    </span>

                    <span className="text-xs text-slate-500">
                      {selectedBlogs.length} blog
                      {selectedBlogs.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">
                Blogs by {selectedUser.name}
              </h3>

              {loadingBlogs ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : selectedBlogs.length === 0 ? (
                <div className="text-center py-16 text-slate-600">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-sm">This user has no blogs yet.</p>
                </div>
              ) : (
                <div className="space-y-3 max-w-2xl">
                  {[...selectedBlogs].reverse().map((blog) => (
                    <BlogCard
                      key={blog._id}
                      blog={blog}
                      onDelete={handleDeleteBlog}
                      showAuthor
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
              <div className="text-5xl mb-4">👤</div>
              <p className="text-sm">
                Select a user from the sidebar to view their blogs.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
