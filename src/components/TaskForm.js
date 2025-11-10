






// -------------------------------------------------------after deployement i get error than i improved 


import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import api from "../api"; // your backend base URL

//  Debounce helper
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const TaskForm = () => {
  // ---------------- STATE ----------------
  const [form, setForm] = useState({
    keyword: "",
    language_name: "",
    language_code: "",
    location_name: "",
    location_code: "",
    priority: 1,
  });

  const [languages, setLanguages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loadingLanguages, setLoadingLanguages] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");

  const username = "info@awasthitech.com";
  const password = "0bacdc60cf3ae311";

  // ---------------- FETCH FUNCTIONS ----------------
  const fetchLanguages = useCallback(async () => {
    setLoadingLanguages(true);
    try {
      const res = await axios.get(
        "https://api.dataforseo.com/v3/serp/google/languages",
        { auth: { username, password } }
      );
      const list =
        res.data.tasks?.[0]?.result?.map((item) => ({
          language_name: item.language_name,
          language_code: item.language_code,
        })) || [];
      setLanguages(list);
    } catch (err) {
      console.error("Error fetching languages:", err);
      setError("Failed to load languages.");
    } finally {
      setLoadingLanguages(false);
    }
  }, [username, password]);

  const fetchLocations = useCallback(async () => {
    setLoadingLocations(true);
    try {
      const res = await axios.get(
        "https://api.dataforseo.com/v3/serp/google/locations",
        { auth: { username, password } }
      );
      const list =
        res.data.tasks?.[0]?.result?.map((item) => ({
          location_name: item.location_name,
          location_code: item.location_code,
        })) || [];
      setLocations(list);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError("Failed to load locations.");
    } finally {
      setLoadingLocations(false);
    }
  }, [username, password]);

  // ---------------- INITIAL FETCH ----------------
  useEffect(() => {
    fetchLanguages();
    fetchLocations();
  }, [fetchLanguages, fetchLocations]);

  // ---------------- SEARCH (debounced) ----------------
  const debouncedSearchLanguage = useMemo(
    () =>
      debounce((query) => {
        if (!query.trim()) return setFilteredLanguages([]);
        const filtered = languages.filter((l) =>
          l.language_name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredLanguages(filtered.slice(0, 10));
      }, 400),
    [languages]
  );

  const debouncedSearchLocation = useMemo(
    () =>
      debounce((query) => {
        if (!query.trim()) return setFilteredLocations([]);
        const filtered = locations.filter((l) =>
          l.location_name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredLocations(filtered.slice(0, 10));
      }, 400),
    [locations]
  );

  // ---------------- INPUT HANDLERS ----------------
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLanguageInput = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, language_name: value, language_code: "" }));
    debouncedSearchLanguage(value);
  };

  const handleLocationInput = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, location_name: value, location_code: "" }));
    debouncedSearchLocation(value);
  };

  const selectLanguage = (lang) => {
    setForm((prev) => ({
      ...prev,
      language_name: lang.language_name,
      language_code: lang.language_code,
    }));
    setFilteredLanguages([]);
  };

  const selectLocation = (loc) => {
    setForm((prev) => ({
      ...prev,
      location_name: loc.location_name,
      location_code: loc.location_code,
    }));
    setFilteredLocations([]);
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTask(null);

    const {
      keyword,
      language_name,
      language_code,
      location_name,
      location_code,
      priority,
    } = form;

    if (!keyword.trim()) return setError("Keyword is required.");
    if (!language_code || !location_code)
      return setError("Select valid language and location.");
    if (isNaN(Number(location_code)))
      return setError("Location code must be numeric.");

    const payload = {
      keyword,
      language_name,
      language_code,
      location_name,
      location_code,
      priority: Number(priority),
    };

    setLoading(true);
    try {
      const { data } = await api.post("/api/tasks", payload);
      setTask(data);
    } catch (err) {
      console.error("❌ Task creation error:", err);
      setError(err.response?.data?.message || "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RENDER ----------------
  return (
    <div className="Tf" style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Create a Task</h2>

      <form onSubmit={handleSubmit} className="form">
        {/* Keyword */}
        <div className="form-group">
          <label>Keyword</label>
          <input
            name="keyword"
            placeholder="Enter keyword"
            value={form.keyword}
            onChange={handleChange}
            required
          />
        </div>

        {/* Language Selector */}
        <div className="form-group" style={{ position: "relative" }}>
          <label>Language</label>
          <input
            type="text"
            placeholder="Search language"
            value={form.language_name}
            onChange={handleLanguageInput}
            required
          />
          {loadingLanguages && <p>Loading languages...</p>}

          {filteredLanguages.length > 0 && (
            <ul
              style={{
                listStyle: "none",
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "5px",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 1000,
                margin: 0,
                padding: 0,
              }}
            >
              {filteredLanguages.map((lang) => (
                <li
                  key={lang.language_code}
                  onClick={() => selectLanguage(lang)}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "#f5f5f5")
                  }
                  onMouseLeave={(e) => (e.target.style.background = "white")}
                >
                  {lang.language_name} ({lang.language_code})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Location Selector */}
        <div className="form-group" style={{ position: "relative" }}>
          <label>Location</label>
          <input
            type="text"
            placeholder="Search location"
            value={form.location_name}
            onChange={handleLocationInput}
            required
          />
          {loadingLocations && <p>Loading locations...</p>}

          {filteredLocations.length > 0 && (
            <ul
              style={{
                listStyle: "none",
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "5px",
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 1000,
                margin: 0,
                padding: 0,
              }}
            >
              {filteredLocations.map((loc) => (
                <li
                  key={loc.location_code}
                  onClick={() => selectLocation(loc)}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "#f5f5f5")
                  }
                  onMouseLeave={(e) => (e.target.style.background = "white")}
                >
                  {loc.location_name} ({loc.location_code})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Priority */}
        <div className="form-group">
          <label>Priority</label>
          <input
            type="number"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            min={1}
            max={5}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="bt">
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {task && <p style={{ color: "green" }}>Task created successfully!</p>}
    </div>
  );
};

export default TaskForm;
