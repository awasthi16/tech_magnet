import React, { useState } from "react";
import api from "../api";
// import TaskResult from "./TaskResult";

const TaskForm = () => {
  const [form, setForm] = useState({
    keyword: "",
    language: "en",
    location: "India",
    priority: 1,
  });
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/api/tasks", form);
      setTask(data);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Tf">
      <h2>Create a Task</h2>
    





      <form onSubmit={handleSubmit} className="form">
  {["keyword", "language", "location", "priority"].map((field) => (
    <div key={field} className="form-group">
      <label htmlFor={field}>
        {field.charAt(0).toUpperCase() + field.slice(1)}
      </label>
      <input
        id={field}
        name={field}
        placeholder={`Enter ${field}`}
        value={form[field]}
        onChange={handleChange}
        required
      />
    </div>
  ))}

  <button type="submit" disabled={loading}  className="bt">
    {loading ? "Creating..." : "Create Task"}
  </button>
</form>

      {error && <p>{error}</p>}
      {/* {task && <TaskResult task={task} />} */}
    </div>
  );
};



export default TaskForm;
