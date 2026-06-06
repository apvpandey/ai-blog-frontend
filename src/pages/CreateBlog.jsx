import { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../components/TopBar";
import BlogCard from "../components/BlogCard";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_KEY);

const generateWithGemini = async (topic) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
Generate a blog post in valid JSON format.

Topic: ${topic}

Rules:
- Return ONLY JSON.
- No markdown.
- No code blocks.
- Title should be catchy.
- Content should be around 80 words.
- Use simple English.

{
  "title": "",
  "content": ""
}
`;

  try {
    const result = await model.generateContent(prompt);

    const rawText = result.response.text();

    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const titleMatch = cleaned.match(/"title"\s*:\s*"([^"]+)"/);
      const contentMatch = cleaned.match(/"content"\s*:\s*"([\s\S]+?)"\s*}/);

      if (titleMatch && contentMatch) {
        parsed = {
          title: titleMatch[1],
          content: contentMatch[1],
        };
      } else {
        throw new Error("Could not parse AI response.");
      }
    }

    if (!parsed.title || !parsed.content) {
      throw new Error("AI returned incomplete data.");
    }

    return {
      title: parsed.title,
      content: parsed.content,
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "Failed to generate blog");
  }
};

function AIGenerateModal({ onClose, onUse }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!prompt.trim()) {
      setError("Please enter a topic or instruction first.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await generateWithGemini(prompt.trim());
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleUse() {
    if (result) {
      onUse(result);
      onClose();
    }
  }

  async function handleRegenerate() {
    setResult(null);
    await handleGenerate();
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
    if (e.key === "Escape") onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={handleBackdrop}
    >
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h3 className="text-slate-100 font-bold text-base">
              Generate Blog with AI
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors text-xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Prompt input */}
          <div className="mb-4">
            <label className="block text-slate-400 text-sm mb-2 font-medium">
              What should the blog be about?
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-500 text-base pointer-events-none">
                🤖
              </span>
              <textarea
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Tips for beginner React developers, or — the future of AI in healthcare..."
                rows={3}
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors text-sm resize-none"
                disabled={loading}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-2 px-3 py-2 rounded-lg bg-red-900/30 border border-red-800 text-red-400 text-xs">
                ⚠️ {error}
              </div>
            )}

            <p className="text-slate-600 text-xs mt-1.5">
              Press{" "}
              <kbd className="bg-slate-700 px-1 rounded text-slate-400">
                Enter
              </kbd>{" "}
              or click Generate
            </p>
          </div>

          {/* Generate button — shown when no result yet */}
          {!result && (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating your blog...
                </>
              ) : (
                "✨ Generate"
              )}
            </button>
          )}

          {/* Result preview */}
          {result && (
            <div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-4 max-h-64 overflow-y-auto">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Preview
                </p>

                <div className="mb-3">
                  <p className="text-xs text-slate-600 mb-1">Title</p>
                  <p className="text-slate-100 font-semibold text-sm leading-snug">
                    {result.title}
                  </p>
                </div>

                <div className="h-px bg-slate-700 mb-3" />

                <div>
                  <p className="text-xs text-slate-600 mb-1">Content</p>
                  <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                    {result.content}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleUse}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all text-sm font-semibold"
                >
                  ✅ Use This Blog
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 disabled:opacity-50 transition-all text-sm font-semibold"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-slate-300 rounded-full animate-spin" />
                  ) : (
                    "🔄 Retry"
                  )}
                </button>
              </div>

              <p className="text-center text-slate-600 text-xs mt-3">
                "Use This Blog" fills the title & content fields automatically.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main CreateBlog Page ─────────────────────────────────────

export default function CreateBlog() {
  const { currentUser, createBlog, editBlog, deleteBlog, getMyBlogs } =
    useApp();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);

  const myBlogs = getMyBlogs();

  function showMsg(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  function handlePost() {
    if (!title.trim()) return showMsg("error", "Please enter a blog title.");
    if (!content.trim()) return showMsg("error", "Please enter blog content.");

    const result = createBlog(title, content);
    if (result.success) {
      setTitle("");
      setContent("");
      showMsg("success", "Blog posted successfully! 🎉");
    } else {
      showMsg("error", result.error);
    }
  }

  function handleAIResult({ title: aiTitle, content: aiContent }) {
    setTitle(aiTitle);
    setContent(aiContent);
    showMsg("success", "AI content loaded! Review and post when ready. ✨");
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <TopBar title={`Hi, ${currentUser?.name} 👋`} showLogout />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* User info bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-900/60 border border-indigo-700/40 flex items-center justify-center text-indigo-300 font-bold text-sm">
            {currentUser?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-slate-200 font-semibold text-sm">
              {currentUser?.name}
            </p>
            <p className="text-slate-600 text-xs">
              ID: {currentUser?.uniqueId}
            </p>
          </div>
          <span className="ml-auto text-xs bg-indigo-900/30 text-indigo-400 border border-indigo-700/30 px-2 py-1 rounded-lg">
            {myBlogs.length} blog{myBlogs.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Create blog form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-slate-100 font-bold text-base mb-5">
            + New Blog Post
          </h2>

          {/* Alert message */}
          {message && (
            <div
              className={`mb-4 px-4 py-3 rounded-lg text-sm ${
                message.type === "error"
                  ? "bg-red-900/30 text-red-400 border border-red-800"
                  : "bg-green-900/30 text-green-400 border border-green-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-slate-400 text-sm mb-2 font-medium">
              Blog Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your blog a catchy title..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors text-sm"
            />
          </div>

          <div className="mb-5">
            <label className="block text-slate-400 text-sm mb-2 font-medium">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts here..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors text-sm resize-y"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePost}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all text-sm font-semibold shadow-lg shadow-indigo-900/30"
            >
              📝 Post Blog
            </button>

            <button
              onClick={() => setShowAIModal(true)}
              className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:border-indigo-500/50 hover:text-indigo-300 transition-all text-sm font-semibold flex items-center gap-2"
            >
              ✨ Generate with AI
            </button>
          </div>
        </div>

        {/* Blog list */}
        <div>
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4">
            My Blogs ({myBlogs.length})
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
                  key={blog.id}
                  blog={blog}
                  onDelete={deleteBlog}
                  onEdit={editBlog}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Modal */}
      {showAIModal && (
        <AIGenerateModal
          onClose={() => setShowAIModal(false)}
          onUse={handleAIResult}
        />
      )}
    </div>
  );
}
