'use client';

import { useState, useEffect } from 'react';

interface Group {
  name: string;
  id: string;
}

interface Zone {
  name: string;
  groups: Group[];
}

interface RegionData {
  [zoneName: string]: Zone;
}

interface ZonesData {
  [regionName: string]: RegionData;
}

interface FormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  kingschat: string;
  zone: string;
  group: string;
  otherGroup: string;
  church: string;
  physicalAttendance: boolean;
}

export default function Home() {
  const [zonesData, setZonesData] = useState<ZonesData>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    kingschat: '',
    zone: '',
    group: '',
    otherGroup: '',
    church: '',
    physicalAttendance: false
  });

  const titles = ['Pastor', 'Deacon', 'Deaconess', 'Brother', 'Sister', 'Evangelist', 'Dr.'];

  // Flatten all zones from all regions into a single list with their paths, sorted alphabetically
  const getAllZones = () => {
    const allZones: Array<{ name: string; path: string[] }> = [];
    Object.entries(zonesData).forEach(([region, regionData]) => {
      Object.entries(regionData).forEach(([zoneName, zoneData]) => {
        allZones.push({
          name: zoneData.name || zoneName,
          path: [region, zoneName]
        });
      });
    });
    return allZones.sort((a, b) => a.name.localeCompare(b.name));
  };

  const allZones = getAllZones();

  useEffect(() => {
    fetch('/api/zones')
      .then(response => response.json())
      .then(data => {
        setZonesData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading zones data:', err);
        setError('Unable to load zones. Please refresh the page.');
        setLoading(false);
      });
  }, []);

  const selectedZoneData = formData.zone
    ? (() => {
        const zone = allZones.find(z => z.name === formData.zone);
        if (zone) {
          return zonesData[zone.path[0]][zone.path[1]];
        }
        return null;
      })()
    : null;

  const groups = selectedZoneData?.groups || [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };

      // Reset dependent fields
      if (name === 'zone') {
        updated.group = '';
      }

      return updated;
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
        !formData.kingschat || !formData.zone || !formData.church) {
      setError('Please fill in all required fields.');
      return;
    }

    // Validate group selection
    if (formData.group === 'other' && !formData.otherGroup) {
      setError('Please enter your group name.');
      return;
    }
    if (!formData.group) {
      setError('Please select or enter your group.');
      return;
    }

    // Use otherGroup if "other" is selected
    const finalGroup = formData.group === 'other' ? formData.otherGroup : formData.group;
    const attendanceType = formData.physicalAttendance ? 'physical' : 'online';

    setSubmitting(true);
    setError('');

    try {
      const submissionData = {
        title: formData.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        kingschat: formData.kingschat,
        zone: formData.zone,
        group: finalGroup,
        church: formData.church,
        attendanceType: attendanceType
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <div className="sparkles"></div>
        <div className="container">
          <div className="decoration-prism d-1"></div>
          <div className="decoration-prism d-2"></div>

          <header>
            <div className="logo-container">
              <img src="https://rhapsodycrusades.org/assets/images/logo.webp" alt="Rhapsody of Realities" className="logo-img" />
            </div>
            <div className="sub-header">Global Conference</div>
            <h1>AS ONE MAN</h1>
            <div className="edition-text">DIAMOND EDITION</div>
            <div className="date-badge">Thursday, January 29th, 2026</div>
          </header>

          <div className="registration-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
            <div className="success-checkmark">✓</div>
            <h2 className="success-title">Registration Successful!</h2>
            <p className="success-text">
              Thank you, <span style={{ color: 'var(--diamond-mid)', fontWeight: '500' }}>{formData.firstName}</span>!
            </p>
            <p className="success-text">
              Your registration for the <strong style={{ color: 'var(--text-main)' }}>AS ONE MAN Diamond Global Conference</strong> has been confirmed.
            </p>
            <div className="success-confirm">
              <p>
                A confirmation has been sent to <span style={{ color: 'var(--diamond-accent)' }}>{formData.email}</span>
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="submit-btn"
            >
              Register Another
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sparkles"></div>
      <div className="container">
        <div className="decoration-prism d-1"></div>
        <div className="decoration-prism d-2"></div>

        <header>
          <div className="logo-container">
            <img src="https://rhapsodycrusades.org/assets/images/logo.webp" alt="Rhapsody of Realities" className="logo-img" />
          </div>
          <div className="sub-header">Global Conference</div>
          <h1>AS ONE MAN</h1>
          <div className="edition-text">DIAMOND EDITION</div>
          <div className="date-badge">Thursday, January 29th, 2026</div>
        </header>

        {loading ? (
          <div className="registration-card" style={{ textAlign: 'center', padding: '80px 50px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid rgba(109, 213, 237, 0.2)',
              borderTopColor: 'var(--diamond-accent)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>Loading registration form...</p>
          </div>
        ) : (
          <form className="registration-card form-grid" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="input-group full-width">
              <label htmlFor="title">Title *</label>
              <select
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              >
                <option value="">Select your title</option>
                {titles.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="e.g. John"
              />
            </div>

            <div className="input-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="e.g. Doe"
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="john@example.com"
              />
            </div>

            <div className="input-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="input-group full-width">
              <label htmlFor="kingschat">KingsChat Username *</label>
              <input
                type="text"
                id="kingschat"
                name="kingschat"
                value={formData.kingschat}
                onChange={handleInputChange}
                required
                placeholder="@username"
              />
            </div>

            <div className="input-group">
              <label htmlFor="zone">Select Your Zone *</label>
              <select
                id="zone"
                name="zone"
                value={formData.zone}
                onChange={handleInputChange}
                required
              >
                <option value="">Choose your zone</option>
                {allZones.map((zone, index) => (
                  <option key={index} value={zone.name}>{zone.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="group">Select Your Group *</label>
              <select
                id="group"
                name="group"
                value={formData.group}
                onChange={handleInputChange}
                required
                disabled={!formData.zone}
              >
                <option value="">Select a zone first</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
                <option value="other">Other (specify below)</option>
              </select>
            </div>

            {formData.group === 'other' && (
              <div className="input-group full-width">
                <label htmlFor="otherGroup">Enter Your Group Name *</label>
                <input
                  type="text"
                  id="otherGroup"
                  name="otherGroup"
                  value={formData.otherGroup}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your group name"
                />
              </div>
            )}

            <div className="input-group full-width">
              <label htmlFor="church">Church Name *</label>
              <input
                type="text"
                id="church"
                name="church"
                value={formData.church}
                onChange={handleInputChange}
                required
                placeholder="Enter your church name"
              />
            </div>

            <div className="attendance-wrapper">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.physicalAttendance}
                  onChange={(e) => setFormData({ ...formData, physicalAttendance: e.target.checked })}
                  className="attendance-checkbox"
                />
                <span className="checkbox-text">
                  <span className="toggle-title">I will attend physically</span>
                  <span className="toggle-sub">Uncheck if attending online</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Processing...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
