import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Robot from '../components/Robot';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; general?: string }>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) newErrors.name = 'יש להזין שם מלא';
    else if (name.trim().length < 2) newErrors.name = 'השם חייב להכיל לפחות 2 תווים';
    if (!phone.trim()) newErrors.phone = 'יש להזין מספר טלפון';
    else if (!/^[0-9]{9,10}$/.test(phone.replace(/-/g, ''))) newErrors.phone = 'מספר טלפון לא תקין';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { name, phone });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/categories');
    } catch (error) {
      console.error(error);
      setErrors({ general: 'שגיאה ברישום. ודאי שהשרת פועל ושהפרטים נכונים.' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => {
    const hasError = !!errors[field as keyof typeof errors];
    return {
      width: '100%',
      padding: '14px 16px',
      background: '#0f0f2a',
      border: `2px solid ${hasError ? '#e05555' : focused === field ? '#7c6dfa' : 'rgba(124,109,250,0.25)'}`,
      borderRadius: '10px',
      color: 'white',
      fontSize: '15px',
      outline: 'none',
      boxSizing: 'border-box',
      direction: 'rtl',
      transition: 'border-color 0.2s',
    };
  };

  return (
    <Layout>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Assistant, Arial, sans-serif' }}>
        <div className="signup-split" dir="rtl">

          {/* Right side - Robot */}
          <div className="signup-robot-side">
            <Robot size={200} />
            <h2 style={{ color: 'white', fontSize: '34px', fontWeight: 'bold', marginTop: '28px', marginBottom: '14px', textAlign: 'center' }}>
              ידע בקצב שלך
            </h2>
            <p style={{ color: '#8080a0', fontSize: '14px', textAlign: 'center', maxWidth: '260px', lineHeight: '1.7' }}>
              בחרי נושא, שאלי שאלה, וקבלי הסבר<br />מותאם אישית מהרובוט החכם שלך
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '28px' }}>
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#2a2a5e' }} />
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#FFD700' }} />
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#7c6dfa' }} />
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', background: 'rgba(124,109,250,0.2)', alignSelf: 'stretch' }} />

          {/* Left side - Form */}
          <div className="signup-form-side" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
              כניסה לפלטפורמה
            </h1>
            <p style={{ color: '#8080a0', fontSize: '13px', marginBottom: '40px', textAlign: 'center' }}>
              הכניסי פרטים כדי להתחיל ללמוד
            </p>

            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '380px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#9090b0', fontSize: '13px', marginBottom: '8px', textAlign: 'right' }}>
                  שם מלא
                </label>
                <input
                  type="text"
                  placeholder="הכנס שם"
                  value={name}
                  onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('name')}
                />
                {errors.name && (
                  <p style={{ color: '#e05555', fontSize: '12px', marginTop: '6px', textAlign: 'right' }}>
                    {errors.name}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', color: '#9090b0', fontSize: '13px', marginBottom: '8px', textAlign: 'right' }}>
                  מספר טלפון
                </label>
                <input
                  type="tel"
                  placeholder="הכנס טלפון"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: undefined })); }}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('phone')}
                />
                {errors.phone && (
                  <p style={{ color: '#e05555', fontSize: '12px', marginTop: '6px', textAlign: 'right' }}>
                    {errors.phone}
                  </p>
                )}
              </div>

              {errors.general && (
                <p style={{ color: '#e05555', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
                  {errors.general}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: loading ? '#444' : 'linear-gradient(135deg, #7c5cf5, #9b78ff)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.2s',
                }}
              >
                {loading ? 'טוען...' : 'כניסה'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
