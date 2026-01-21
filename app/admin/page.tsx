'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Registration {
  _id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  kingschat: string;
  zone: string;
  group: string;
  church: string;
  attendanceType: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check if already logged in via session
    const savedPassword = sessionStorage.getItem('adminPassword');
    if (savedPassword) {
      setPassword(savedPassword);
      setIsAuthenticated(true);
      fetchRegistrationsWithPassword(savedPassword);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('adminPassword', password);
        await fetchRegistrations();
      } else {
        setLoginError(result.error || 'Invalid password');
      }
    } catch (err) {
      setLoginError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    await fetchRegistrationsWithPassword(password);
  };

  const fetchRegistrationsWithPassword = async (pwd: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/registrations', {
        headers: {
          'x-admin-password': pwd,
        },
      });

      const result = await response.json();

      if (result.success) {
        setRegistrations(result.data);
      } else {
        console.error('Failed to fetch registrations');
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRegistrations([]);
    setPassword('');
    sessionStorage.removeItem('adminPassword');
  };

  const deleteAllRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/registrations', {
        method: 'DELETE',
        headers: {
          'x-admin-password': password,
        },
      });

      const result = await response.json();

      if (result.success) {
        setRegistrations([]);
        alert('All registrations deleted successfully');
      } else {
        alert('Failed to delete registrations');
      }
    } catch (err) {
      alert('Error deleting registrations');
    }
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;

    try {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': password,
        },
      });

      const result = await response.json();

      if (result.success) {
        setRegistrations(registrations.filter(r => r._id !== id));
      } else {
        alert('Failed to delete registration');
      }
    } catch (err) {
      alert('Error deleting registration');
    }
  };

  const exportToCSV = () => {
    if (registrations.length === 0) return;

    const headers = ['Title', 'First Name', 'Last Name', 'Email', 'Phone', 'KingsChat', 'Zone', 'Group', 'Church', 'Attendance Type', 'Date'];
    const csvContent = [
      headers.join(','),
      ...registrations.map((r) =>
        [
          r.title,
          r.firstName,
          r.lastName,
          r.email,
          r.phone,
          r.kingschat,
          r.zone,
          r.group,
          r.church,
          r.attendanceType,
          new Date(r.createdAt).toLocaleDateString(),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredRegistrations = registrations.filter(
    (r) =>
      r.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.church.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.kingschat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)', position: 'relative', zIndex: '1' }}>
        <div style={{ background: 'rgba(15, 15, 26, 0.9)', padding: '50px', borderRadius: '20px', border: '1px solid rgba(212, 175, 55, 0.3)', maxWidth: '400px', width: '100%', position: 'relative', zIndex: '2' }}>
          <h1 style={{ color: '#D4AF37', textAlign: 'center', marginBottom: '30px', fontSize: '1.5rem' }}>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#D4AF37', marginBottom: '10px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter admin password"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '15px 20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  color: '#f8f9fa',
                  fontSize: '1rem',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)'}
              />
            </div>
            {loginError && (
              <div style={{ color: '#e74c3c', marginBottom: '15px', textAlign: 'center', fontSize: '0.9rem' }}>{loginError}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 50%, #D4AF37 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#0f0f1a',
                fontSize: '1rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)', padding: '40px 20px', position: 'relative', zIndex: '1' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: '2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ color: '#D4AF37', fontSize: '2.5rem', marginBottom: '10px' }}>Admin Dashboard</h1>
            <p style={{ color: '#b0b0b0', fontSize: '1.1rem' }}>Total Registrations: {registrations.length}</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={exportToCSV}
              disabled={registrations.length === 0}
              style={{
                padding: '12px 25px',
                background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: registrations.length === 0 ? 'not-allowed' : 'pointer',
                opacity: registrations.length === 0 ? 0.5 : 1,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Export CSV
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete all registrations? This cannot be undone.')) {
                  deleteAllRegistrations();
                }
              }}
              disabled={registrations.length === 0}
              style={{
                padding: '12px 25px',
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: registrations.length === 0 ? 'not-allowed' : 'pointer',
                opacity: registrations.length === 0 ? 0.5 : 1,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Delete All
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '12px 25px',
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Search by name, email, church, or zone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '15px 20px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '8px',
              color: '#f8f9fa',
              fontSize: '1rem',
            }}
          />
        </div>

        {loading && registrations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#b0b0b0' }}>Loading registrations...</div>
        ) : (
          <div style={{ background: 'rgba(15, 15, 26, 0.85)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '15px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                <thead>
                  <tr style={{ background: 'rgba(212, 175, 55, 0.1)', borderBottom: '2px solid rgba(212, 175, 55, 0.3)' }}>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#D4AF37', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>#</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#D4AF37', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Name</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#D4AF37', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#D4AF37', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>KingsChat</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#D4AF37', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Zone</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#D4AF37', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Group</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#D4AF37', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Church</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#D4AF37', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Type</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#D4AF37', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</th>
                    <th style={{ padding: '15px', textAlign: 'left', color: '#D4AF37', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#b0b0b0' }}>
                        {searchTerm ? 'No matching registrations found' : 'No registrations yet'}
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg, index) => (
                      <tr key={reg._id} style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.1)', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '15px', color: '#f8f9fa' }}>{index + 1}</td>
                        <td style={{ padding: '15px' }}>
                          <div style={{ color: '#f8f9fa', fontWeight: '600' }}>{reg.title} {reg.firstName} {reg.lastName}</div>
                        </td>
                        <td style={{ padding: '15px' }}>
                          <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>{reg.email}</div>
                          <div style={{ color: '#b0b0b0', fontSize: '0.9rem' }}>{reg.phone}</div>
                        </td>
                        <td style={{ padding: '15px', color: '#b0b0b0' }}>{reg.kingschat}</td>
                        <td style={{ padding: '15px', color: '#b0b0b0' }}>{reg.zone}</td>
                        <td style={{ padding: '15px', color: '#b0b0b0' }}>{reg.group}</td>
                        <td style={{ padding: '15px', color: '#b0b0b0' }}>{reg.church}</td>
                        <td style={{ padding: '15px' }}>
                          <span style={{
                            padding: '5px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                            background: reg.attendanceType === 'physical' ? 'rgba(39, 174, 96, 0.2)' : 'rgba(52, 152, 219, 0.2)',
                            color: reg.attendanceType === 'physical' ? '#27ae60' : '#3498db',
                            textTransform: 'capitalize',
                          }}>
                            {reg.attendanceType}
                          </span>
                        </td>
                        <td style={{ padding: '15px', color: '#b0b0b0', fontSize: '0.9rem' }}>
                          {new Date(reg.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '15px' }}>
                          <button
                            onClick={() => deleteRegistration(reg._id)}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(231, 76, 60, 0.2)',
                              border: '1px solid #e74c3c',
                              borderRadius: '6px',
                              color: '#e74c3c',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#e74c3c';
                              e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(231, 76, 60, 0.2)';
                              e.currentTarget.style.color = '#e74c3c';
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
