import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  // Legend,
  // Tooltip,
} from "recharts";
import JobEntryForm from "./JobEntryForm";
import JobList from "./JobList";
import "./Dashboard.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const STATUS_TYPES = ["Applied", "Interview", "Offer", "Rejected"];

function Dashboard({ user, setUser }) {
  const [entries, setEntries] = useState([]);
  const [statusCounts, setStatusCounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load entries when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  // Calculate status counts whenever entries change
  useEffect(() => {
    calculateStatusCounts();
  }, [entries]);

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const url = filterStatus
        ? `https://job-tracker-backend-37r2.onrender.com/api/v1/entries/filter/${user._id}/${filterStatus}`
        : `https://job-tracker-backend-37r2.onrender.com/api/v1/entries/read/${user._id}`;

      const response = await axios.get(url);
      if (response.data.success) {
        setEntries(response.data.payload);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStatusCounts = () => {
    const counts = STATUS_TYPES.map((status) => {
      const count = entries.filter((entry) => entry.status === status).length;
      return { name: status, value: count };
    });
    setStatusCounts(counts);
  };

  const handleAddEntry = async (entryData) => {
    try {
      const response = await axios.post(
        `https://job-tracker-backend-37r2.onrender.com/api/v1/entries/new/${user._id}`,
        entryData
      );
      if (response.data.success) {
        setEntries([...entries, response.data.payload]);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  const handleUpdateEntry = async (entryId, status) => {
    try {
      const response = await axios.patch(
        `https://job-tracker-backend-37r2.onrender.com/api/v1/entries/edit/${entryId}`,
        { status }
      );
      if (response.data.success) {
        setEntries(
          entries.map((entry) =>
            entry._id === entryId ? response.data.payload : entry
          )
        );
      }
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const response = await axios.delete(
        `https://job-tracker-backend-37r2.onrender.com/api/v1/entries/delete/${entryId}`
      );
      if (response.data.success) {
        setEntries(entries.filter((entry) => entry._id !== entryId));
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://job-tracker-backend-37r2.onrender.com/api/v1/users/logout"
      );
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  useEffect(() => {
    fetchEntries();
  }, [filterStatus]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="user-info">
          <h1>Job Tracker</h1>
          <p>Welcome, {user.name}</p>
          <p className="email">{user.email}</p>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="status-counts">
          {STATUS_TYPES.map((status, index) => (
            <div
              key={status}
              className="status-count"
              style={{ borderColor: COLORS[index] }}
            >
              <h3>{status}</h3>
              <p>{statusCounts[index]?.value || 0}</p>
            </div>
          ))}
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusCounts.filter((item) => item.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {statusCounts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </header>

      <div className="controls">
        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          {showForm ? "Cancel" : "+ Add Job Application"}
        </button>

        <div className="filter">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            {STATUS_TYPES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showForm && <JobEntryForm onSubmit={handleAddEntry} />}

      {isLoading ? (
        <div className="loading">Loading applications...</div>
      ) : (
        <JobList
          entries={entries}
          onUpdate={handleUpdateEntry}
          onDelete={handleDeleteEntry}
        />
      )}
    </div>
  );
}

export default Dashboard;
