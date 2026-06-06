import { useState } from 'react';
import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';
import BlogCard from '../components/BlogCard';

export default function AdminDashboard() {
  const { users, deleteBlog, getBlogsByUser } = useApp();
  const [selectedUser, setSelectedUser] = useState(null);

  const selectedBlogs = selectedUser ? getBlogsByUser(selectedUser.id) : [];

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar title="Admin Dashboard" showLogout />

      <div className="flex h-[calc(100vh-57px)]">
        {/* Sidebar - User list */}
        <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden">
          <div className="px-4 py-4 border-b border-slate-800">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Registered Users ({users.length})
            </h2>
          </div>

          <div className="overflow-y-auto flex-1 p-3 space-y-1">
            {users.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-8">No users yet.</p>
            ) : (
              users.map((user) => {
                const blogCount = getBlogsByUser(user.id).length;
                const isActive = selectedUser?.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full text-left px-3 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-slate-800 border border-indigo-500/40'
                        : 'border border-transparent hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-indigo-900/50 border border-indigo-700/40 flex items-center justify-center text-indigo-300 font-bold text-sm flex-shrink-0">
                        {user.name[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-slate-200 text-sm font-semibold truncate">{user.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-600">ID: {user.id}</span>
                          <span className="text-xs text-slate-500">
                            {blogCount} blog{blogCount !== 1 ? 's' : ''}
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

        {/* Main panel - Blog list */}
        <main className="flex-1 overflow-y-auto p-6">
          {selectedUser ? (
            <div>
              {/* Selected user header */}
              <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-800">
                <div className="w-12 h-12 rounded-full bg-indigo-900/50 border border-indigo-700/40 flex items-center justify-center text-indigo-300 font-bold text-lg">
                  {selectedUser.name[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-slate-100 font-bold text-lg">{selectedUser.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs bg-slate-800 text-slate-500 border border-slate-700 rounded-md px-2 py-0.5">
                      ID: {selectedUser.id}
                    </span>
                    <span className="text-xs text-slate-500">
                      {selectedBlogs.length} blog{selectedBlogs.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Blogs */}
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">
                Blogs by {selectedUser.name}
              </h3>

              {selectedBlogs.length === 0 ? (
                <div className="text-center py-16 text-slate-600">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-sm">This user has no blogs yet.</p>
                </div>
              ) : (
                <div className="space-y-3 max-w-2xl">
                  {[...selectedBlogs].reverse().map((blog) => (
                    <BlogCard
                      key={blog.id}
                      blog={blog}
                      onDelete={deleteBlog}
                      showAuthor
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
              <div className="text-5xl mb-4">👤</div>
              <p className="text-sm">Select a user from the sidebar to view their blogs.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
