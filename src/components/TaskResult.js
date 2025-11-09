





import React, { useState, useEffect } from "react";
import api from "../api";

const TaskResult = () => {
  // ---------------- STATE ----------------
  const [allTasks, setAllTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchTaskId, setSearchTaskId] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ---------------- EFFECT ----------------
  useEffect(() => {
    fetchAllTasks(1); // Load first page of tasks initially
  }, []);

  // ---------------- FETCH ALL TASKS ----------------
  const fetchAllTasks = async (pageNum = 1) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/api/tasks?page=${pageNum}`);
      setAllTasks(data.results || []);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError("Failed to load tasks");
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- KEYWORD SEARCH ----------------
  const handleKeywordSearch = async (pageNum = 1) => {
    if (!searchKeyword.trim()) return fetchAllTasks(1);
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(
        `/api/tasks/search/${searchKeyword}?page=${pageNum}`
      );
      setAllTasks(data.results || []);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "No tasks found for this keyword.");
      setAllTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- TASK ID SEARCH ----------------
  const handleTaskIdSearch = async () => {
    if (!searchTaskId.trim()) {
      setError("Please enter a Task ID");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/api/tasks/${searchTaskId}`);
      setResult(data);
    } catch {
      setError("Task not found or error fetching result");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH SELECTED TASK RESULT ----------------
  const fetchResult = async (taskId) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/api/tasks/${taskId}`);
      setResult(data);
    } catch {
      setError("Error fetching result");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- PAGINATION ----------------
  const handlePrevPage = () => {
    if (page > 1) {
      if (searchKeyword.trim()) {
        handleKeywordSearch(page - 1);
      } else {
        fetchAllTasks(page - 1);
      }
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      if (searchKeyword.trim()) {
        handleKeywordSearch(page + 1);
      } else {
        fetchAllTasks(page + 1);
      }
    }
  };

  // ---------------- JSX ----------------
  return (
    <div className="mainb">
      {/* ---------- LEFT SIDE ---------- */}
      <div className="left">
        <div className="search">
          <input
            type="text"
            placeholder="Search by keyword, language, location..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button onClick={() => handleKeywordSearch(1)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="#0078FF"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </button>
        </div>

        <div className="resultbox1">
          <h3>Available Tasks:</h3>
          {error && <p>{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : allTasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            <>
              <ul className="container1">
                {allTasks.map((t) => (
                  <li
                    className="card1"
                    key={t.task_id}
                    onClick={() => setSelectedTask(t)}
                    style={{
                      border: "1px solid #ddd",
                      margin: "10px 0",
                      padding: "10px",
                      borderRadius: "8px",
                      background:
                        selectedTask?.task_id === t.task_id ? "#e0ffe0" : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <strong>Keyword:</strong> {t.keyword} <br />
                    <strong>Task ID:</strong> {t.task_id} <br />
                    <strong>Language:</strong> {t.language || t.language_name} <br />
                    <strong>Location:</strong> {t.location || t.location_name} <br />
                    <strong>Status:</strong> {t.status} <br />
                    <strong>Created At:</strong>{" "}
                    {new Date(t.createdAt).toLocaleString()} <br />
                    <strong>Updated At:</strong>{" "}
                    {new Date(t.updatedAt).toLocaleString()} <br />
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className="btt"
                >
                  Prev
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className="btt"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---------- RIGHT SIDE ---------- */}
      <div className="right">
        <div className="search">
          <input
            type="text"
            placeholder="Search by Task ID"
            value={searchTaskId}
            onChange={(e) => setSearchTaskId(e.target.value)}
          />
          <button onClick={handleTaskIdSearch}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="#0078FF"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </button>
        </div>

        <div className="resultbox">
          {selectedTask && !searchTaskId && (
            <div>
              <h3>Task ID: {selectedTask.task_id}</h3>
              <p>Status: {selectedTask.status}</p>
              <button
                onClick={() => fetchResult(selectedTask.task_id)}
                disabled={loading}
              >
                {loading ? "Fetching..." : "Get Result"}
              </button>
            </div>
          )}

          {error && <p>{error}</p>}

          {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
        </div>
      </div>
    </div>
  );
};

export default TaskResult;

