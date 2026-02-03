import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ContactForm from './ContactDetails';

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list'); 
  const [selectedContact, setSelectedContact] = useState(null);
  const { token, logout } = useContext(AuthContext); //

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchContacts = async () => {
    try {
      // Use dynamic API_URL
      const res = await axios.get(`${API_URL}/api/contacts?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    if (token) fetchContacts();
  }, [search, token]);

  const handleSave = () => {
    setView('list');
    fetchContacts();
  };

  if (view === 'form') {
    return (
      <ContactForm 
        token={token} 
        existingContact={selectedContact} 
        onSave={handleSave} 
        onCancel={() => setView('list')} 
      />
    );
  }

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>📁 ContactManager</div>
        <div className="nav-right">
          <input className="search-input" type="text" placeholder="Search contacts..." onChange={(e) => setSearch(e.target.value)} />
          <button className="logout-btn" onClick={logout}>Logout 👤</button>
        </div>
      </nav>

      <div className="dashboard-card">
        <div className="header-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h1>Dashboard</h1>
          <button className="btn-red" onClick={() => { setSelectedContact(null); setView('form'); }}>
            + Add New Contact
          </button>
        </div>

        <table className="contacts-table">
          <thead>
            <tr><th>Name</th><th>Phone</th><th>Email</th><th>Favorite</th></tr>
          </thead>
          <tbody>
            {contacts.map(c => (
              <tr key={c.id} onClick={() => { setSelectedContact(c); setView('form'); }} style={{ cursor: 'pointer' }}>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>{c.is_favorite ? '⭐' : '☆'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
