import { cookies } from 'next/headers'

export type Lang = 'en' | 'kn' | 'si' | 'ta'

const dict: Record<Lang, Record<string, string>> = {
  en: {
    projects: 'Projects',
    enquireNow: 'Enquire Now',
    viewAll: 'View all →',
    projectGallery: 'Project Gallery',
    relatedProjects: 'Related Projects',
    admin: 'Admin',
    login: 'Login',
    logout: 'Logout'
  },
  kn: {
    projects: 'ಪ್ರಾಜೆಕ್ಟ್ಸ್',
    enquireNow: 'ವಿಚಾರಿಸಿ',
    viewAll: 'ಎಲ್ಲವನ್ನು ನೋಡಿ →',
    projectGallery: 'ಪ್ರಾಜೆಕ್ಟ್ ಗ್ಯಾಲರಿ',
    relatedProjects: 'ಸಂಬಂಧಿತ ಪ್ರಾಜೆಕ್ಟ್ಸ್',
    admin: 'ಅಡ್ಮಿನ್',
    login: 'ಲಾಗಿನ್',
    logout: 'ಲಾಗ್ಔಟ್'
  },
  si: {
    projects: 'ව්‍යාපෘති',
    enquireNow: 'විමසන්න',
    viewAll: 'සියල්ල බලන්න →',
    projectGallery: 'ව්‍යාපෘති ගැලරිය',
    relatedProjects: 'සම්බන්ධිත ව්‍යාපෘති',
    admin: 'පරිපාලක',
    login: 'පිවිසෙන්න',
    logout: 'පිටවෙන්න'
  },
  ta: {
    projects: 'திட்டங்கள்',
    enquireNow: 'விசாரிக்கவும்',
    viewAll: 'அனைத்தையும் பார்க்க →',
    projectGallery: 'திட்டக் காட்சிக்கூடம்',
    relatedProjects: 'தொடர்புடைய திட்டங்கள்',
    admin: 'நிர்வாகம்',
    login: 'உள்நுழை',
    logout: 'வெளியேறு'
  }
}

export function getLang(): Lang {
  const v = cookies().get('idam_lang')?.value as Lang | undefined
  return v && dict[v] ? v : 'en'
}

export function t(key: string) {
  const lang = getLang()
  return dict[lang][key] || dict.en[key] || key
}
