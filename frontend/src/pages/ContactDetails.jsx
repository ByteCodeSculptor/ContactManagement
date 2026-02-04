import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = ({ token, onSave, onCancel, existingContact = null }) => {
  const [formData, setFormData] = useState(existingContact || {
    name: '', phone: '', email: '', company: '', tags: '', notes: ''
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL;

const handleSubmit = async (e) => {
  e.preventDefault();

  // Client-side validation
  const phoneRegex = /^[167890]\d{9}$/;
  if (formData.phone && !phoneRegex.test(formData.phone)) {
    alert("Phone number must be exactly 10 digits and start with 1, 6, 7, 8, 9, or 0.");
    return;
  }

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const url = existingContact 
    ? `${API_URL}/api/contacts/${existingContact.id}` 
    : `${API_URL}/api/contacts`;
  
  const method = existingContact ? 'put' : 'post';

  try {
    await axios[method](url, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    onSave();
  } catch (err) { 
    // Capture and show the specific validation error from backend if available
    const errorMsg = err.response?.data?.message || err.response?.data?.error || "Save error";
    alert(errorMsg);
    console.error("Save error", err); 
  }
};
  const handleDelete = async () => {
    if (window.confirm("Delete this contact?")) {
      try {
        await axios.delete(`${API_URL}/api/contacts/${existingContact.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onSave();
      } catch (err) { console.error("Delete error", err); }
    }
  };

  return (
    <div className="details-page">
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <button className="btn-cancel" style={{ marginBottom: '20px', backgroundColor: 'black', color: 'white' }} onClick={onCancel}>
          ← Back to Dashboard
        </button>
        <div className="content-card">
          <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Contact Details</h2>
          <form onSubmit={handleSubmit}>
            {['name', 'phone', 'email', 'company', 'tags'].map(field => (
              <div key={field} className="form-group">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input value={formData[field]} onChange={e => setFormData({ ...formData, [field]: e.target.value })} />
              </div>
            ))}
            <div className="form-group">
              <label>Notes</label>
              <textarea rows="4" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
              <button type="submit" className="btn-red">Save</button>
              <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
              {existingContact && (
                <button type="button" className="btn-red" style={{ backgroundColor: '#b71c1c' }} onClick={handleDelete}>
                  Delete
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
