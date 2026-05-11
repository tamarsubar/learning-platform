import type { Lang } from '../context/LanguageContext';

const translations: Record<string, { he: string; ar: string }> = {
  // Categories
  'History':               { he: 'היסטוריה',       ar: 'التاريخ' },
  'Science':               { he: 'מדעים',           ar: 'العلوم' },
  'Technology':            { he: 'טכנולוגיה',       ar: 'التكنولوجيا' },
  'Mathematics':           { he: 'מתמטיקה',         ar: 'الرياضيات' },
  'Literature & Language': { he: 'ספרות ושפה',      ar: 'الأدب واللغة' },
  'Geography':             { he: 'גיאוגרפיה',       ar: 'الجغرافيا' },

  // History subcategories
  'Ancient Greece':          { he: 'יוון העתיקה',              ar: 'اليونان القديمة' },
  'The French Revolution':   { he: 'המהפכה הצרפתית',           ar: 'الثورة الفرنسية' },
  'History of Israel':       { he: 'תולדות ישראל',             ar: 'تاريخ إسرائيل' },
  'World War II':            { he: 'מלחמת העולם השנייה',       ar: 'الحرب العالمية الثانية' },
  'The Roman Empire':        { he: 'האימפריה הרומית',          ar: 'الإمبراطورية الرومانية' },
  'The Industrial Revolution':{ he: 'המהפכה התעשייתית',        ar: 'الثورة الصناعية' },

  // Science subcategories
  'Astronomy & Space':    { he: 'אסטרונומיה וחלל',   ar: 'علم الفلك والفضاء' },
  'Human Biology':        { he: 'ביולוגיה אנושית',   ar: 'علم الأحياء البشري' },
  'Quantum Physics':      { he: 'פיזיקה קוונטית',    ar: 'الفيزياء الكمية' },
  'Organic Chemistry':    { he: 'כימיה אורגנית',     ar: 'الكيمياء العضوية' },
  'Evolution & Genetics': { he: 'אבולוציה וגנטיקה',  ar: 'التطور والجينات' },

  // Technology subcategories
  'Artificial Intelligence': { he: 'בינה מלאכותית',    ar: 'الذكاء الاصطناعي' },
  'App Development':         { he: 'פיתוח אפליקציות',  ar: 'تطوير التطبيقات' },
  'Cybersecurity':           { he: 'אבטחת סייבר',      ar: 'الأمن السيبراني' },
  'Computer Networks':       { he: 'רשתות מחשבים',     ar: 'شبكات الحاسوب' },
  'Databases':               { he: 'מסדי נתונים',      ar: 'قواعد البيانات' },

  // Mathematics subcategories
  'Linear Algebra':          { he: 'אלגברה לינארית',         ar: 'الجبر الخطي' },
  'Differential Calculus':   { he: 'חשבון דיפרנציאלי',       ar: 'حساب التفاضل' },
  'Analytic Geometry':       { he: 'גיאומטריה אנליטית',      ar: 'الهندسة التحليلية' },
  'Set Theory':              { he: 'תורת הקבוצות',           ar: 'نظرية المجموعات' },
  'Statistics & Probability':{ he: 'סטטיסטיקה והסתברות',    ar: 'الإحصاء والاحتمالات' },

  // Literature & Language subcategories
  'Modern Hebrew Literature':  { he: 'ספרות עברית מודרנית',   ar: 'الأدب العبري الحديث' },
  'Classic World Literature':  { he: 'ספרות עולמית קלאסית',   ar: 'الأدب العالمي الكلاسيكي' },
  'Poetry & Poetics':          { he: 'שירה ופואטיקה',          ar: 'الشعر والشاعرية' },
  'Linguistics':               { he: 'בלשנות',                 ar: 'علم اللغويات' },

  // Geography subcategories
  'Geography of Israel':  { he: 'גיאוגרפיה של ישראל', ar: 'جغرافيا إسرائيل' },
  'Continents & Oceans':  { he: 'יבשות וימים',         ar: 'القارات والمحيطات' },
  'Climate & Weather':    { he: 'אקלים ומזג אוויר',    ar: 'المناخ والطقس' },
  'Countries & Capitals': { he: 'מדינות ובירות',        ar: 'الدول والعواصم' },
};

export const translateName = (name: string, lang: Lang): string => {
  if (lang === 'en') return name;
  const entry = translations[name];
  if (!entry) return name;
  return lang === 'ar' ? entry.ar : entry.he;
};
