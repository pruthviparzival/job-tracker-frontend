import React from "react";
import "./JobList.css";

const STATUS_TYPES = ["Applied", "Interview", "Offer", "Rejected"];

// Status badge component
const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "Applied":
        return "#0088FE";
      case "Interview":
        return "#00C49F";
      case "Offer":
        return "#FFBB28";
      case "Rejected":
        return "#FF8042";
      default:
        return "#ccc";
    }
  };

  return (
    <span
      className="status-badge"
      style={{ backgroundColor: getStatusColor() }}
    >
      {status}
    </span>
  );
};

function JobList({ entries, onUpdate, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (entries.length === 0) {
    return (
      <div className="no-entries">
        <h3>No job applications found.</h3>
        <p>Add your first job application to get started!</p>
      </div>
    );
  }

  return (
    <div className="job-list">
      <h2>Your Job Applications</h2>
      <div className="job-entries">
        {entries.map((entry) => (
          <div key={entry._id} className="job-entry">
            <div className="job-entry-header">
              <h3>{entry.company}</h3>
              <StatusBadge status={entry.status} />
            </div>

            <div className="job-entry-body">
              <p className="job-role">{entry.role}</p>
              <p className="job-date">
                Applied: {formatDate(entry.createdAt || entry.date)}
              </p>

              <div className="job-link">
                <a href={entry.link} target="_blank" rel="noopener noreferrer">
                  View Application
                </a>
              </div>
            </div>

            <div className="job-entry-actions">
              <div className="status-update">
                <select
                  value={entry.status}
                  onChange={(e) => onUpdate(entry._id, e.target.value)}
                >
                  {STATUS_TYPES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => onDelete(entry._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobList;
