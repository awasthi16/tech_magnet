// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import api from "../api";
// // import TaskResult from "./TaskResult";

// const TaskForm = () => {
//   const [languages, setLanguages] = useState([]);
//   const [filteredLanguages, setFilteredLanguages] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [filteredLocations, setFilteredLocations] = useState([]);

//   const [loadingLanguages, setLoadingLanguages] = useState(false);
//   const [loadingLocations, setLoadingLocations] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [task, setTask] = useState(null);
//   const [error, setError] = useState("");

//   const username = "info@awasthitech.com";
//   const password = "0bacdc60cf3ae311";

//   const [form, setForm] = useState({
//     keyword: "",
//     language: "en",
//     location: "India",
//     priority: 1,
//   });

//   //  Fetch languages
//   const fetchLanguages = async () => {
//     setLoadingLanguages(true);
//     try {
//       const response = await axios.get(
//         "https://api.dataforseo.com/v3/serp/google/languages",
//         { auth: { username, password } }
//       );

//       const list =
//         response.data.tasks?.[0]?.result?.map((item) => ({
//           language_name: item.language_name,
//           language_code: item.language_code,
//         })) || [];

//       setLanguages(list);
//     } catch (err) {
//       console.error("Error fetching languages:", err);
//       setError("Failed to load languages.");
//     } finally {
//       setLoadingLanguages(false);
//     }
//   };

//   //  Fetch locations
//   const fetchLocations = async () => {
//     setLoadingLocations(true);
//     try {
//       const response = await axios.get(
//         "https://api.dataforseo.com/v3/serp/google/locations",
//         { auth: { username, password } }
//       );

//       const list =
//         response.data.tasks?.[0]?.result?.map((item) => ({
//           location_name: item.location_name,
//           location_code: item.location_code,
//         })) || [];

//       setLocations(list);
//     } catch (err) {
//       console.error("Error fetching locations:", err);
//       setError("Failed to load locations.");
//     } finally {
//       setLoadingLocations(false);
//     }
//   };

//   //  Fetch both on mount
//   useEffect(() => {
//     fetchLanguages();
//     fetchLocations();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   //  Handle normal inputs
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   //  Language search
//   const handleLanguageSearch = (e) => {
//     const value = e.target.value;
//     setForm({ ...form, language: value });

//     if (!value.trim()) {
//       setFilteredLanguages([]);
//       return;
//     }

//     const result = languages.filter((lang) =>
//       lang.language_name.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredLanguages(result.slice(0, 10));
//   };

//   //  Select language
//   const handleSelectLanguage = (lang) => {
//     setForm({ ...form, language: lang.language_code });
//     setFilteredLanguages([]);
//   };

//   //  Location search
//   const handleLocationSearch = (e) => {
//     const value = e.target.value;
//     setForm({ ...form, location: value });

//     if (!value.trim()) {
//       setFilteredLocations([]);
//       return;
//     }

//     const result = locations.filter((loc) =>
//       loc.location_name.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredLocations(result.slice(0, 10));
//   };

//   //  Select location
//   const handleSelectLocation = (loc) => {
//     setForm({ ...form, location: loc.location_code });
//     setFilteredLocations([]);
//   };

//   //  Submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       const { data } = await api.post("/api/tasks", form);
//       setTask(data);
//     } catch (err) {
//       console.error("Task creation error:", err);
//       setError(err.response?.data?.message || "Error creating task");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="Tf" style={{ maxWidth: "500px", margin: "auto" }}>
//       <h2>Create a Task</h2>

//       <form onSubmit={handleSubmit} className="form">
//         {/* Keyword & Priority Inputs */}
//         {["keyword", "priority"].map((field) => (
//           <div key={field} className="form-group">
//             <label htmlFor={field}>
//               {field.charAt(0).toUpperCase() + field.slice(1)}
//             </label>
//             <input
//               id={field}
//               name={field}
//               placeholder={`Enter ${field}`}
//               value={form[field]}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         ))}

//         {/* Language Selector */}
//         <div className="form-group" style={{ position: "relative" }}>
//           <label htmlFor="language">Language</label>
//           <input
//             id="language"
//             name="language"
//             placeholder="Type to search language"
//             value={form.language}
//             onChange={handleLanguageSearch}
//             required
//           />
//           {loadingLanguages && <p>Loading languages...</p>}

//           {filteredLanguages.length > 0 && (
//             <ul
//               style={{
//                 listStyle: "none",
//                 position: "absolute",
//                 top: "100%",
//                 left: 0,
//                 right: 0,
//                 background: "white",
//                 border: "1px solid #ccc",
//                 borderRadius: "5px",
//                 maxHeight: "200px",
//                 overflowY: "auto",
//                 zIndex: 1000,
//                 margin: 0,
//                 padding: 0,
//               }}
//             >
//               {filteredLanguages.map((lang) => (
//                 <li
//                   key={lang.language_code}
//                   onClick={() => handleSelectLanguage(lang)}
//                   style={{
//                     padding: "8px",
//                     cursor: "pointer",
//                     borderBottom: "1px solid #eee",
//                   }}
//                   onMouseEnter={(e) =>
//                     (e.target.style.background = "#f5f5f5")
//                   }
//                   onMouseLeave={(e) => (e.target.style.background = "white")}
//                 >
//                   {lang.language_name} ({lang.language_code})
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/*  Location Selector */}
//         <div className="form-group" style={{ position: "relative" }}>
//           <label htmlFor="location">Location</label>
//           <input
//             id="location"
//             name="location"
//             placeholder="Type to search location"
//             value={form.location}
//             onChange={handleLocationSearch}
//             required
//           />
//           {loadingLocations && <p>Loading locations...</p>}

//           {filteredLocations.length > 0 && (
//             <ul
//               style={{
//                 listStyle: "none",
//                 position: "absolute",
//                 top: "100%",
//                 left: 0,
//                 right: 0,
//                 background: "white",
//                 border: "1px solid #ccc",
//                 borderRadius: "5px",
//                 maxHeight: "200px",
//                 overflowY: "auto",
//                 zIndex: 1000,
//                 margin: 0,
//                 padding: 0,
//               }}
//             >
//               {filteredLocations.map((loc) => (
//                 <li
//                   key={loc.location_code}
//                   onClick={() => handleSelectLocation(loc)}
//                   style={{
//                     padding: "8px",
//                     cursor: "pointer",
//                     borderBottom: "1px solid #eee",
//                   }}
//                   onMouseEnter={(e) =>
//                     (e.target.style.background = "#f5f5f5")
//                   }
//                   onMouseLeave={(e) => (e.target.style.background = "white")}
//                 >
//                   {loc.location_name} ({loc.location_code})
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <button type="submit" disabled={loading} className="bt">
//           {loading ? "Creating..." : "Create Task"}
//         </button>
//       </form>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {task && <p style={{ color: "green" }}>Task is created</p>}
//     </div>
//   );
// };

// export default TaskForm;
