/**
 * Lightweight trilingual dictionary for GovCompanion.
 * English is the default (global reach); Sinhala is the primary local language;
 * Tamil is the third. Kept as a flat dictionary so the UI can switch instantly
 * with no extra dependencies.
 */

export type Lang = 'en' | 'si' | 'ta'

export const LANGS: { code: Lang; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'si', label: 'සිංහල', short: 'සිං' },
  { code: 'ta', label: 'தமிழ்', short: 'தமிழ்' },
]

type Dict = Record<Lang, string>

export const QUICK_QUESTIONS_I18N: Record<Lang, string[]> = {
  en: [
    'How do I get a new NIC?',
    'How do I renew my passport?',
    'How do I get a driving license?',
    'How do I get a birth certificate copy?',
    'How do I get a police clearance?',
  ],
  si: [
    'නව ජාතික හැඳුනුම්පතක් ලබා ගන්නේ කෙසේද?',
    'විදේශ ගමන් බලපත්‍රය අලුත් කරන්නේ කෙසේද?',
    'රියදුරු බලපත්‍රයක් ලබා ගන්නේ කෙසේද?',
    'උප්පැන්න සහතිකයක පිටපතක් ලබා ගන්නේ කෙසේද?',
    'පොලිස් නිෂ්කාශන සහතිකයක් ලබා ගන්නේ කෙසේද?',
  ],
  ta: [
    'புதிய தேசிய அடையாள அட்டையை எப்படிப் பெறுவது?',
    'கடவுச்சீட்டை எப்படிப் புதுப்பிப்பது?',
    'ஓட்டுநர் உரிமத்தை எப்படிப் பெறுவது?',
    'பிறப்புச் சான்றிதழின் நகலை எப்படிப் பெறுவது?',
    'பொலிஸ் அனுமதிச் சான்றிதழை எப்படிப் பெறுவது?',
  ],
}

export const WELCOME_I18N: Record<Lang, string> = {
  en: `**ආයුබෝවන් — Welcome to GovCompanion**

I'm your guide to **Sri Lankan government services** — NIC, passport, driving licence, birth & marriage certificates, police clearance, and Grama Niladhari certificates.

Tell me what you need and I'll give you the exact **documents to bring, the office to visit, the fees, and the steps** — so you never waste a day in a queue.`,
  si: `**ආයුබෝවන් — GovCompanion වෙත සාදරයෙන් පිළිගනිමු**

මම ඔබට **ශ්‍රී ලංකා රජයේ සේවාවන්** සඳහා මඟ පෙන්වමි — ජාතික හැඳුනුම්පත, විදේශ ගමන් බලපත්‍රය, රියදුරු බලපත්‍රය, උප්පැන්න හා විවාහ සහතික, පොලිස් නිෂ්කාශන සහ ග්‍රාම නිලධාරී සහතික.

ඔබට අවශ්‍ය දේ කියන්න — **අවශ්‍ය ලියකියවිලි, යා යුතු කාර්යාලය, ගාස්තු සහ පියවර** මම නිවැරදිව කියා දෙන්නම්.`,
  ta: `**வணக்கம் — GovCompanion க்கு வரவேற்கிறோம்**

நான் **இலங்கை அரசாங்க சேவைகளுக்கு** உங்கள் வழிகாட்டி — தேசிய அடையாள அட்டை, கடவுச்சீட்டு, ஓட்டுநர் உரிமம், பிறப்பு மற்றும் திருமணச் சான்றிதழ்கள், பொலிஸ் அனுமதிச் சான்றிதழ், மற்றும் கிராம உத்தியோகத்தர் சான்றிதழ்கள்.

உங்களுக்கு என்ன தேவை என்று சொல்லுங்கள் — **தேவையான ஆவணங்கள், செல்ல வேண்டிய அலுவலகம், கட்டணங்கள், படிநிலைகள்** ஆகியவற்றைச் சரியாகச் சொல்கிறேன்.`,
}

const STRINGS: Record<string, Dict> = {
  'header.quickAsk': { en: 'Quick ask', si: 'ඉක්මන් ප්‍රශ්න', ta: 'விரைவு கேள்விகள்' },
  'header.compare': { en: 'Compare', si: 'සසඳන්න', ta: 'ஒப்பிடு' },
  'header.liveAI': { en: 'Live AI', si: 'සජීවී AI', ta: 'நேரடி AI' },

  'hero.eyebrow': {
    en: 'Your Government Services Companion',
    si: 'ඔබගේ රජයේ සේවා සහකරු',
    ta: 'உங்கள் அரசாங்க சேவை துணை',
  },
  'hero.titleLead': {
    en: 'Government services made',
    si: 'රජයේ සේවා දැන්',
    ta: 'அரசாங்க சேவைகள் இப்போது',
  },
  'hero.titleAccent': { en: 'simple & clear', si: 'සරලයි, පැහැදිලියි', ta: 'எளிமை, தெளிவு' },
  'hero.tagline': {
    en: 'Documents, offices, fees & steps — for 100+ services',
    si: 'ලියකියවිලි, කාර්යාල, ගාස්තු සහ පියවර — සේවා 100+ක්',
    ta: 'ஆவணங்கள், அலுவலகங்கள், கட்டணங்கள், படிகள் — 100+ சேவைகள்',
  },
  'hero.cta': {
    en: 'Start Your Query',
    si: 'ඔබගේ ප්‍රශ්නය අසන්න',
    ta: 'உங்கள் கேள்வியைத் தொடங்குங்கள்',
  },
  'hero.showBanner': {
    en: 'Show welcome banner',
    si: 'පිළිගැනීමේ පුවරුව පෙන්වන්න',
    ta: 'வரவேற்பு பலகத்தைக் காட்டு',
  },

  'stats.services': { en: 'Services', si: 'සේවා', ta: 'சேவைகள்' },
  'stats.citizens': { en: 'Citizens', si: 'පුරවැසියන්', ta: 'குடிமக்கள்' },
  'stats.saved': { en: 'Saved', si: 'ඉතිරි', ta: 'சேமிப்பு' },

  'chat.popular': { en: 'Popular questions', si: 'ජනප්‍රිය ප්‍රශ්න', ta: 'பிரபலமான கேள்விகள்' },
  'chat.send': { en: 'Send', si: 'යවන්න', ta: 'அனுப்பு' },
  'chat.sending': { en: 'Sending', si: 'යවමින්', ta: 'அனுப்புகிறது' },
  'chat.newChat': { en: 'New chat', si: 'නව සංවාදය', ta: 'புதிய அரட்டை' },
  'chat.thinking': { en: 'Thinking…', si: 'සිතමින්…', ta: 'யோசிக்கிறது…' },
  'chat.placeholder': {
    en: 'Ask about any government service…',
    si: 'ඔබට අවශ්‍ය රජයේ සේවාව අහන්න…',
    ta: 'எந்த அரசாங்க சேவை பற்றியும் கேளுங்கள்…',
  },
  'chat.hintSend': { en: 'send', si: 'යවන්න', ta: 'அனுப்பு' },
  'chat.hintNewline': { en: 'new line', si: 'නව පේළිය', ta: 'புதிய வரி' },

  'sidebar.browse': { en: 'Browse Services', si: 'සේවා බ්‍රවුස් කරන්න', ta: 'சேவைகளை உலாவு' },
  'sidebar.search': {
    en: 'Search services…',
    si: 'සේවා සොයන්න…',
    ta: 'சேவைகளைத் தேடு…',
  },
  'sidebar.callBefore': {
    en: 'Call',
    si: 'අමතන්න',
    ta: 'அழைக்கவும்',
  },

  'trust.notOfficial': {
    en: 'Not official · Verify at office',
    si: 'නිල නොවේ · කාර්යාලයේදී තහවුරු කරගන්න',
    ta: 'அதிகாரப்பூர்வம் அல்ல · அலுவலகத்தில் உறுதிப்படுத்தவும்',
  },
}

export function translate(key: string, lang: Lang): string {
  const entry = STRINGS[key]
  if (!entry) return key
  return entry[lang] ?? entry.en
}
