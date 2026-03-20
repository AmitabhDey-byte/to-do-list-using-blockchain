import { useState, useEffect } from "react";
import "./styling1.css";

import {
  createTask,
  toggleTask as toggleTaskOnChain,
  getTasks,
} from "../soroban";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 📥 Load tasks from blockchain
  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // ➕ Add Task (ON-CHAIN)
  const handleAdd = async () => {
    if (!input.trim()) return;

    try {
      setLoading(true);
      await createTask(input); // 🔥 blockchain call
      setInput("");
      await loadTasks();
    } catch (err) {
      console.error("Create error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Toggle Task (ON-CHAIN)
  const handleToggle = async (index) => {
    try {
      setLoading(true);
      await toggleTaskOnChain(index); // 🔥 blockchain call
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
  );
}