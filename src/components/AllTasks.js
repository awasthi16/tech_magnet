import React, { useEffect, useState } from "react";
import api from "../api"; 

const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all tasks when component loads
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get("/api/tasks");
        setTasks(data);
      } catch (err) {
        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []); 

  if (loading) return <p style={styles.loading}>Loading tasks...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>All Tasks</h2>
      {tasks.length === 0 ? (
        <p style={styles.noTask}>No tasks found.</p>
      ) : (
        <div style={styles.list}>
          {tasks.map((t) => (
            <div key={t.task_id} style={styles.card}>
              <p><strong>Keyword:</strong> {t.keyword}</p>
              <p><strong>Task ID:</strong> {t.task_id}</p>
              <p><strong>Language:</strong> {t.language}</p>
              <p><strong>Location:</strong> {t.location}</p>
              <p><strong>Status:</strong> {t.status}</p>
              <p><strong>Created At:</strong> {new Date(t.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 800,
    margin: "40px auto",
    padding: "20px",
    background: "#f9f9f9",
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  list: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: 8,
    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
  },
  error: {
    textAlign: "center",
    color: "red",
  },
  noTask: {
    textAlign: "center",
    color: "#555",
  },
};

export default AllTasks;
