import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Robot from '../components/Robot';
import LangToggle from '../components/LangToggle';
import { useLanguage } from '../context/LanguageContext';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; general?: string }>({});
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const validate = () => {
    const newErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) newErrors.name = t('Full name is required', 'יש להזין שם מלא', 'الاسم الكامل مطلوب');
    else if (name.trim().length < 2) newErrors.name = t('Name must be at least 2 characters', 'השם חייב להכיל לפחות 2 תווים', 'الاسم يجب أن يحتوي على حرفين على الأقل');
    if (!phone.trim()) newErrors.phone = t('Phone number is required', 'יש להזין מספר טלפון', 'رقم الهاتف مطلوب');
    else if (!/^[0-9]{9,10}$/.test(phone.replace(/-/g, ''))) newErrors.phone = t('Invalid phone number', 'מספר טלפון לא תקין', 'رقم هاتف غير صالح');
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { name, phone });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/categories');
    } catch {
      setErrors({ general: t('Registration error. Make sure the server is running.', 'שגיאה ברישום. ודא שהשרת פועל.', 'خطأ في التسجيل. تأكد من أن الخادم يعمل.') });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%', padding: '14px 16px',
    background: '#0f0f2a',
    border: `2px solid ${errors[field as keyof typeof errors] ? '#e05555' : focused === field ? '#7c6dfa' : 'rgba(124,109,250,0.25)'}`,
    borderRadius: '10px', color: 'white', fontSize: '15px',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
    direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left',
  });

  return (
    <Layout>
      <div style={{ position: 'fixed', top: '14px', right: '16px', zIndex: 10 }}>
        <LangToggle />
      </div>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, Arial, sans-serif' }}>
        <div className="signup-split">

          <div className="signup-robot-side">
            <Robot size={200} />
            <h2 style={{ color: 'white', fontSize: '34px', fontWeight: 'bold', marginTop: '28px', marginBottom: '14px', textAlign: 'center' }}>
              {t('Learn at Your Own Pace', 'ידע בקצב שלך', 'تعلم بسرعتك الخاصة')}
            </h2>
            <p style={{ color: '#8080a0', fontSize: '14px', textAlign: 'center', maxWidth: '260px', lineHeight: '1.7' }}>
              {t(
                'Choose a topic, ask a question, and get a personalized explanation from your AI robot',
                'בחר נושא, שאל שאלה, וקבל הסבר מותאם אישית מהרובוט החכם שלך',
                'اختر موضوعاً، اطرح سؤالاً، واحصل على شرح مخصص من روبوتك الذكي'
              )}
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '28px' }}>
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#2a2a5e' }} />
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#FFD700' }} />
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#7c6dfa' }} />
            </div>
          </div>

          <div style={{ width: '1px', background: 'rgba(124,109,250,0.2)', alignSelf: 'stretch' }} />

          <div className="signup-form-side" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
              {t('Welcome to the Platform', 'ברוך הבא לפלטפורמה', 'مرحباً بك في المنصة')}
            </h1>
            <p style={{ color: '#8080a0', fontSize: '13px', marginBottom: '40px', textAlign: 'center' }}>
              {t('Enter your details to start learning', 'הכנס פרטים כדי להתחיל ללמוד', 'أدخل بياناتك لبدء التعلم')}
            </p>

            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '380px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#9090b0', fontSize: '13px', marginBottom: '8px' }}>
                  {t('Full Name', 'שם מלא', 'الاسم الكامل')}
                </label>
                <input
                  type="text"
                  placeholder={t('Enter your name', 'הכנס שם', 'أدخل اسمك')}
                  value={name}
                  onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('name')}
                />
                {errors.name && <p style={{ color: '#e05555', fontSize: '12px', marginTop: '6px' }}>{errors.name}</p>}
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', color: '#9090b0', fontSize: '13px', marginBottom: '8px' }}>
                  {t('Phone Number', 'מספר טלפון', 'رقم الهاتف')}
                </label>
                <input
                  type="tel"
                  placeholder={t('Enter phone number', 'הכנס טלפון', 'أدخل رقم الهاتف')}
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: undefined })); }}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused(null)}
                  style={inputStyle('phone')}
                />
                {errors.phone && <p style={{ color: '#e05555', fontSize: '12px', marginTop: '6px' }}>{errors.phone}</p>}
              </div>

              {errors.general && <p style={{ color: '#e05555', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>{errors.general}</p>}

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '15px',
                background: loading ? '#444' : 'linear-gradient(135deg, #7c5cf5, #9b78ff)',
                border: 'none', borderRadius: '10px', color: 'white',
                fontSize: '16px', fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s',
              }}>
                {loading ? t('Loading...', 'טוען...', 'جاري التحميل...') : t('Start Learning', 'כניסה', 'ابدأ التعلم')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
