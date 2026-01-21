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

  const titles = ['Pastor', 'Dcns', 'Dcn', 'Brother', 'Sister', 'Evangelist', 'Dr.'];

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

    const attendanceType = formData.physicalAttendance ? 'physical' : 'online';

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

    setSubmitting(true);
    setError('');

    try {
      const finalGroup = formData.group === 'other' ? formData.otherGroup : formData.group;
      const attendanceType = formData.physicalAttendance ? 'physical' : 'online';
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
      <div className="container">
        <header>
          <p className="subtitle">Global Conference</p>
          <h1>AS ONE MAN</h1>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.8rem', fontWeight: '300', marginBottom: '20px' }}>DIAMOND EDITION</h2>
          <p className="dates">Thursday, January 29th, 2026</p>
        </header>
        <div className="registration-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px',
            fontSize: '40px',
            color: 'var(--darker)',
            fontWeight: 'bold'
          }}>✓</div>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.8rem', marginBottom: '15px', textShadow: 'none' }}>Registration Successful!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '450px', margin: '0 auto 10px', lineHeight: '1.7' }}>
            Thank you, <span style={{ color: 'var(--gold)', fontWeight: '500' }}>{formData.firstName}</span>!
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '450px', margin: '0 auto 30px', lineHeight: '1.7' }}>
            Your registration for the <strong style={{ color: 'var(--text-light)' }}>AS ONE MAN Diamond Global Conference</strong> has been confirmed.
          </p>
          <div style={{
            padding: '20px',
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            marginBottom: '30px'
          }}>
            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', margin: '0' }}>
              A confirmation has been sent to <span style={{ color: 'var(--gold)' }}>{formData.email}</span>
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
    );
  }

  return (
    <>
      <div className="container">
        <header>
          <p className="subtitle">Global Conference</p>
          <h1>AS ONE MAN</h1>
          <h2 style={{ color: 'var(--gold)', fontSize: '1.8rem', fontWeight: '300', marginBottom: '20px' }}>DIAMOND EDITION</h2>
          <p className="dates">Thursday, January 29th, 2026</p>
        </header>

        {loading ? (
          <div className="registration-card" style={{ textAlign: 'center', padding: '80px 50px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '3px solid rgba(212, 175, 55, 0.2)',
              borderTopColor: 'var(--gold)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>Loading registration form...</p>
          </div>
        ) : (
          <form className="registration-card" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-section">
              <label htmlFor="title">Title <span>*</span></label>
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

            <div className="form-section">
              <label htmlFor="firstName">First Name <span>*</span></label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="Enter your first name"
              />
            </div>

            <div className="form-section">
              <label htmlFor="lastName">Last Name <span>*</span></label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="Enter your last name"
              />
            </div>

            <div className="form-row">
              <div className="form-section">
                <label htmlFor="email">Email Address <span>*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-section">
                <label htmlFor="phone">Phone Number <span>*</span></label>
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
            </div>

            <div className="form-section">
              <label htmlFor="kingschat">KingsChat Username <span>*</span></label>
              <input
                type="text"
                id="kingschat"
                name="kingschat"
                value={formData.kingschat}
                onChange={handleInputChange}
                required
                placeholder="Enter your KingsChat username"
              />
            </div>

            <div className="form-section">
              <label htmlFor="zone">Select Your Zone <span>*</span></label>
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

            <div className="form-section">
              <label htmlFor="group">Select Your Group <span>*</span></label>
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
              <div className="form-section">
                <label htmlFor="otherGroup">Enter Your Group Name <span>*</span></label>
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

            <div className="form-section">
              <label htmlFor="church">Church Name <span>*</span></label>
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

            <div className="form-section">
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="physicalAttendance"
                  checked={formData.physicalAttendance}
                  onChange={(e) => setFormData({ ...formData, physicalAttendance: e.target.checked })}
                  style={{
                    width: '24px',
                    height: '24px',
                    marginRight: '12px',
                    cursor: 'pointer',
                    accentColor: '#D4AF37'
                  }}
                />
                <span style={{ color: 'var(--gold)', fontSize: '1rem' }}>I will attend physically (uncheck for online attendance)</span>
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
