import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function BlogCard({
  blog,
  onDelete,
  onEdit,
  showAuthor = false,
}) {
  const { currentUser } = useApp();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      setError("Both title and content are required.");
      return;
    }

    const result = await onEdit(blog._id, title, content);

    if (result.success) {
      setEditing(false);
      setError("");
    } else {
      setError(result.error || "Failed to update blog");
    }
  }

  function handleCancel() {
    setTitle(blog.title);
    setContent(blog.content);
    setEditing(false);
    setError("");
  }

  if (editing) {
    return (
      <div className="bg-slate-900 border border-indigo-500/40 rounded-xl p-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog title"
          className="w-full mb-3 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Blog content..."
          rows={5}
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-sm outline-none focus:border-indigo-500 transition-colors resize-y"
        />

        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

        <div className="flex gap-2 mt-3">
          <button
            onClick={handleSave}
            className="text-xs px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-colors"
          >
            Save Changes
          </button>

          <button
            onClick={handleCancel}
            className="text-xs px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors">
      <h3 className="text-slate-100 font-semibold text-base mb-2">
        {blog.title}
      </h3>

      <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
        {blog.content}
      </p>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        {!JSON.parse(localStorage.getItem("is_admin") || "false") && (
          <span className="text-xs bg-indigo-900/40 text-indigo-400 rounded-md px-2 py-0.5">
            {currentUser?.uniqueId === blog.userId?.uniqueId
              ? "YOU"
              : `@${blog.userId?.name}`}
          </span>
        )}

        <span className="text-xs text-slate-600">
          {new Date(blog.createdAt).toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {currentUser?.uniqueId === blog.userId?.uniqueId && (
        <div className="flex gap-2 mt-3">
          {onEdit && (
            <button
              onClick={() => setEditing(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
            >
              ✏️ Edit
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(blog._id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
