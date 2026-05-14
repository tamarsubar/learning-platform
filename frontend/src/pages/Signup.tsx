import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Robot from '../components/Robot';
import LangToggle from '../components/LangToggle';
import { useLanguage } from '../context/LanguageContext';
import styles from './Signup.module.css';

const Signup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; general?: string }>({});
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError('');
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/login?password=${adminPassword}`);
      if (res.data.ok) {
        sessionStorage.setItem('admin_auth', 'true');
        sessionStorage.setItem('admin_auth_pw', adminPassword);
        navigate('/admin');
      }
    } catch {
      setAdminError(t('Wrong password', 'סיסמא שגויה', 'كلمة مرور خاطئة'));
    } finally {
      setAdminLoading(false);
    }
  };

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

  const inputDir: React.CSSProperties = { direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' };

  return (
    <Layout>
      <div className={styles.langTogglePos}>
        <LangToggle />
      </div>
      <div className={styles.page}>
        <div className="signup-split">

          {/* Left: robot side */}
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

          <div className={styles.divider} />

          {/* Right: tabs + content */}
          <div className="signup-form-side" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'user' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('user')}
              >
                {t('User', 'משתמש', 'مستخدم')}
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'admin' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                {t('Admin', 'מנהל', 'مدير')}
              </button>
            </div>

            {/* User tab */}
            {activeTab === 'user' && (
              <>
                <h1 className={styles.title}>
                  {t('Welcome to the Platform', 'ברוך הבא לפלטפורמה', 'مرحباً بك في المنصة')}
                </h1>
                <p className={styles.subtitle}>
                  {t('Enter your details to start learning', 'הכנס פרטים כדי להתחיל ללמוד', 'أدخل بياناتك لبدء التعلم')}
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.fieldWrap}>
                    <label className={styles.label}>
                      {t('Full Name', 'שם מלא', 'الاسم الكامل')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('Enter your name', 'הכנס שם', 'أدخل اسمك')}
                      value={name}
                      onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                      className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                      style={inputDir}
                    />
                    {errors.name && <p className={styles.errorMsg}>{errors.name}</p>}
                  </div>

                  <div className={styles.fieldWrapLast}>
                    <label className={styles.label}>
                      {t('Phone Number', 'מספר טלפון', 'رقم الهاتف')}
                    </label>
                    <input
                      type="tel"
                      placeholder={t('Enter phone number', 'הכנס טלפון', 'أدخل رقم الهاتف')}
                      value={phone}
                      onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: undefined })); }}
                      className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                      style={inputDir}
                    />
                    {errors.phone && <p className={styles.errorMsg}>{errors.phone}</p>}
                  </div>

                  {errors.general && <p className={styles.generalError}>{errors.general}</p>}

                  <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? t('Loading...', 'טוען...', 'جاري التحميل...') : t('Start Learning', 'כניסה', 'ابدأ التعلم')}
                  </button>
                </form>
              </>
            )}

            {/* Admin tab */}
            {activeTab === 'admin' && (
              <>
                <h1 className={styles.title}>
                  {t('Admin Access', 'כניסת מנהל', 'دخول المدير')}
                </h1>
                <p className={styles.subtitle}>
                  {t('Enter the admin password', 'הכנס את סיסמת המנהל', 'أدخل كلمة مرور المدير')}
                </p>

                <form onSubmit={handleAdminLogin} className={styles.form}>
                  <div className={styles.fieldWrapLast}>
                    <label className={styles.label}>
                      {t('Password', 'סיסמא', 'كلمة المرور')}
                    </label>
                    <input
                      type="password"
                      placeholder={t('Enter password', 'הכנס סיסמא', 'أدخل كلمة المرور')}
                      value={adminPassword}
                      onChange={e => { setAdminPassword(e.target.value); setAdminError(''); }}
                      className={`${styles.input} ${adminError ? styles.inputError : ''}`}
                    />
                    {adminError && <p className={styles.errorMsg}>{adminError}</p>}
                  </div>

                  <button type="submit" disabled={adminLoading} className={styles.submitBtn}>
                    {adminLoading ? t('Loading...', 'טוען...', 'جاري التحميل...') : t('Enter Dashboard', 'כניסה לניהול', 'الدخول إلى لوحة التحكم')}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
