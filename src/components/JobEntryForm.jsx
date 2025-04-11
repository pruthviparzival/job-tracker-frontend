import React, { useState } from "react";
import "./JobEntryForm.css";

const STATUS_TYPES = ["Applied", "Interview", "Offer", "Rejected"];

function JobEntryForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    link: "",
    status: "Applied",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="job-form-container">
      <h2>Add New Job Application</h2>
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            placeholder="Enter company name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            placeholder="Enter job title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="link">Application Link</label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            required
            placeholder="Enter application URL"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            {STATUS_TYPES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Add Application
        </button>
      </form>
    </div>
  );
}

export default JobEntryForm;
