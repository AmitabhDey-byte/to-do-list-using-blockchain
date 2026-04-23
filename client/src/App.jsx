import React, { useEffect, useState, useRef } from "react";
import { getUser, createTask, getTasks, toggleTask } from "../soroban";
import "./styling1.css";

export default function App() {
  const [wallet, setWallet] = useState("");
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const connect = async () => {
    const user = await getUser();
    setWallet(user);
    load();
  };

  const load = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  const add = async () => {
    if (!input.trim()) return;
    setLoading(true);
    await createTask(input.trim());
    await new Promise((r) => setTimeout(r, 1500));
    setInput("");
    await load();
    setLoading(false);
    inputRef.current?.focus();
  };

  const complete = async (i) => {
    setLoading(true);
    await toggleTask(i);
    await new Promise((r) => setTimeout(r, 1500));
    await load();
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") add();
  };

  useEffect(() => {
    connect();
  }, []);

  const pending = tasks.filter((t) => !t.completed).length;
  const done = tasks.filter((t) => t.completed).length;

  const shortWallet = wallet
    ? `${wallet.slice(0, 6)}...${wallet.slice(-6)}`
    : null;

  return (
    <div className="app-wrap">
      <div className="orb" />
      <div className="container">

        {/* Header */}
        <div className="header">
          <div className="logo-row">
            <div className="logo-mark">✦</div>
            <h1>Task <span>Forge</span></h1>
          </div>
          <p className="tagline">Decentralized task management · Soroban</p>
          <div className={`wallet-chip ${wallet ? "connected" : ""}`}>
            <div className="wallet-dot" />
            <span className="wallet-addr">
              {wallet ? shortWallet : "Connecting wallet..."}
            </span>
          </div>
        </div>

        {/* Input */}
        <div className="input-section">
          <span className="input-label">New Task</span>
          <div className="input-row">
            <input
              ref={inputRef}
              className="task-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="What needs to be done?"
              disabled={loading}
            />
            <button
              className="add-btn"
              onClick={add}
              disabled={loading || !input.trim()}
            >
              Create
            </button>
          </div>
        </div>

        {/* Status */}
        {loading && (
          <div className="status-bar">
            <div className="spinner" />
            Syncing to blockchain...
          </div>
        )}

        {/* Task list */}
        {tasks.length > 0 && (
          <div className="section-header">
            <span className="section-title">Tasks</span>
            <span className="task-count">
              {pending} pending · {done} done
            </span>
          </div>
        )}

        {tasks.length === 0 && !loading ? (
          <div className="empty">
            <div className="empty-icon">◎</div>
            <p>No tasks yet.<br />Create your first one above.</p>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((t, i) => (
              <li
                key={i}
                className={`task-item${t.completed ? " done" : ""}`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="task-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="task-text">{t.content}</span>
                {t.completed ? (
                  <span className="done-badge">✓ done</span>
                ) : (
                  <button
                    className="complete-btn"
                    onClick={() => complete(i)}
                    disabled={loading}
                    title="Mark complete"
                  >
                    ✓
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="footer">
          <p>Powered by Soroban smart contracts · {new Date().getFullYear()}</p>
        </div>

      </div>
    </div>
  );
}