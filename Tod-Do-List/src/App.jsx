import { useState, useEffect } from "react";
import "./styling1.css";
import Background from "./Background";

import {
  createTask,
  toggleTask as toggleTaskOnChain,
  getTasks,
} from "../soroban.js";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 📥 Load tasks
const loadTasks = async () => {
  try {
    setLoading(true);
    const data = await getTasks();

    // 🔥 Transform blockchain data → UI format
    const formatted = data.map((t) => ({
      content: t.content ?? t[0],
      completed: t.completed ?? t[1],
    }));

    setTasks(formatted);
  } catch (err) {
    console.error("Load error:", err);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    loadTasks();
  }, []);

  // ➕ Add task
const handleAdd = async () => {
  if (!input.trim()) return;

  try {
    setLoading(true);

    await createTask(input);
    setInput("");

    // ⏳ wait for blockchain confirmation
    await new Promise((res) => setTimeout(res, 2000));

    await loadTasks();
  } catch (err) {
    console.error("Create error:", err);
  } finally {
    setLoading(false);
  }
};

  // 🔁 Toggle task
  const handleToggle = async (index) => {
  try {
    setLoading(true);

    await toggleTask(index);

    await new Promise((res) => setTimeout(res, 1500));

    await loadTasks();
  } catch (err) {
    console.error("Toggle error:", err);
  } finally {
    setLoading(false);
  }
};

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;

  return (
    <>
      {/* 🌌 BACKGROUND */}
      <Background />

      {/* 🧊 CONTENT */}
      <div className="app">
        <div className="container">
          <h1 className="title">On-Chain ToDo</h1>
          <p className="subtitle">
            Permissionless productivity powered by blockchain
          </p>

          {/* INPUT */}
          <div className="input-group">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What needs to be done?"
              disabled={loading}
            />
            <button onClick={handleAdd} disabled={loading}>
              {loading ? "..." : "Add"}
            </button>
          </div>

          {/* STATS */}
          <div className="stats">
            <span>{done} completed</span>
            <span>{total} total</span>
          </div>

          {/* TASK LIST */}
          <div className="task-list">
            {loading && <p className="empty">Loading...</p>}

            {!loading && tasks.length === 0 && (
              <p className="empty">No tasks yet 🚀</p>
            )}

            {!loading &&
              tasks.map((task, index) => (
                <div
                  key={index}
                  className={`task ${task.completed ? "completed" : ""}`}
                  onClick={() => handleToggle(index)}
                >
                  {task.content}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}