/**
 * Central site configuration & content for betonplus.co.il.
 *
 * Single source of truth for the designed (brief-driven) site: business facts, contact
 * links, navigation, services, FAQs, reviews and service areas. Pages and components read
 * from here so copy/contact details stay consistent and editable in one place.
 *
 * Values inferred from competitor research / industry norms are marked `// 🔶 confirm`.
 * Confirmed facts (name, phone, founded 2005) are unmarked. See brief.md.
 */

export const site = {
  name: "בטון פלוס",
  legalName: "בטון פלוס", // 🔶 confirm legal entity
  domain: "betonplus.co.il",
  url: "https://betonplus.co.il",
  locale: "he_IL",
  foundedYear: 2005,
  yearsLabel: "מעל 20 שנה",
  tagline: "דיוק של יהלום · ביצוע פלוס",
  shortPitch:
    "חיתוך וקידוח בטון מדויק ביהלום — פותחים פתחים, מנסרים וקודחים בכל מבנה בלי לפגוע בו, בלוח זמנים ובבטיחות מלאה.",
  // Contact
  phoneDisplay: "055-6601006",
  phoneTel: "+972556601006",
  whatsapp: "972556601006",
  email: "info@betonplus.co.il", // 🔶 confirm lead destination
  // Operations
  hours: "א׳–ה׳ 07:00–18:00 · ו׳ 07:00–13:00", // 🔶 confirm
  areaLabel: "גוש דן והמרכז + פריסה ארצית בתיאום", // 🔶 confirm
} as const;

/** Pre-filled WhatsApp deep link. */
export const whatsappHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
  "היי, הגעתי דרך האתר ואשמח לקבל הצעת מחיר לניסור/קידוח בטון.",
)}`;

/** Click-to-call link. */
export const telHref = `tel:${site.phoneTel}`;

export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: "בית", href: "/" },
  { label: "שירותים", href: "/services/" },
  { label: "מחירון", href: "/pricing/" },
  { label: "אזורי שירות", href: "/service-areas/" },
  { label: "אודות", href: "/about/" },
  { label: "המלצות", href: "/reviews/" },
  { label: "שאלות נפוצות", href: "/faq/" },
  { label: "צור קשר", href: "/contact/" },
];

export type IconName =
  | "saw"
  | "drill"
  | "layers"
  | "wire"
  | "demolition"
  | "shield"
  | "clock"
  | "diamond"
  | "phone"
  | "whatsapp"
  | "check"
  | "star"
  | "mapPin"
  | "mail"
  | "menu"
  | "close"
  | "arrow";

export interface Service {
  slug: string;
  icon: IconName;
  title: string;
  /** Short one-liner for cards. */
  teaser: string;
  /** Full description for the service page hero. */
  description: string;
  audience: string;
  priceFrom?: string;
  bullets: string[];
  process: string[];
  /** Used in <title>/meta. */
  metaTitle: string;
  metaDescription: string;
}

export const services: Service[] = [
  {
    slug: "wall-sawing",
    icon: "saw",
    title: "ניסור קירות בטון ופתיחת פתחים",
    teaser: "פתחים לדלתות, חלונות ומזגנים — ניסור מדויק ביהלום, בלי לפגוע ביציבות הקיר.",
    description:
      "ניסור מדויק של קירות בטון לפתחי דלתות, חלונות, מזגנים ומעברים, בעזרת מסור יהלום מתקדם. חיתוך נקי בקווים ישרים, עם מינימום רעש ואבק ובלי רעידות שמסכנות את המבנה.",
    audience: "קבלני שיפוץ, בעלי דירות ובתים, מהנדסים ומנהלי פרויקטים.",
    priceFrom: "₪150 למ״ר", // 🔶 confirm
    bullets: [
      "פתחי דלתות, חלונות ומזגנים בקיר בטון",
      "חיתוך מדויק בקווים ישרים, בלי סדקים",
      "מינימום רעש ואבק — מתאים גם לבית מאוכלס",
      "פינוי ומסירה נקייה בסיום",
    ],
    process: [
      "בדיקת היקף וסימון הפתח במידות מדויקות",
      "ניסור ביהלום עם בקרת עומק",
      "הוצאת אלמנט הבטון ופינוי",
      "ניקיון ומסירת שטח עבודה נקי",
    ],
    metaTitle: "ניסור קירות בטון ופתיחת פתחים | בטון פלוס",
    metaDescription:
      "ניסור קירות בטון ופתיחת פתחים לדלתות, חלונות ומזגנים — חיתוך מדויק ביהלום, נקי ובטוח. מעל 20 שנה ניסיון. חייגו 055-6601006.",
  },
  {
    slug: "core-drilling",
    icon: "drill",
    title: "קידוח יהלום / קידוח ליבות",
    teaser: "מעברים עגולים מדויקים לצנרת, חשמל, אינסטלציה ומיזוג — בכל קוטר.",
    description:
      "קידוח עגול מדויק בכל קוטר לקירות, רצפות ותקרות בטון — למעברי צנרת, חשמל, אינסטלציה, מיזוג ותקשורת. קידוח יבש או רטוב לפי הצורך, בלי סדקים ובמינימום אבק.",
    audience: "אינסטלטורים, חשמלאים, קבלני מיזוג וקבלני בנייה.",
    priceFrom: "₪190 למ׳", // 🔶 confirm
    bullets: [
      "קידוח ליבה בכל קוטר ולכל עומק",
      "מעברים לצנרת, חשמל, מים, ביוב ומיזוג",
      "קידוח מדויק בלי לפגוע בזיון הבטון",
      "אפשרות קידוח יבש לסביבה רגישה",
    ],
    process: [
      "סימון נקודות הקידוח לפי תכנית",
      "קיבוע מקדח היהלום ובקרת זווית",
      "קידוח מבוקר והוצאת הליבה",
      "ניקיון ומסירה",
    ],
    metaTitle: "קידוח יהלום וקידוח ליבות בבטון | בטון פלוס",
    metaDescription:
      "קידוח יהלום וקידוח ליבות בבטון בכל קוטר — מעברים לצנרת, חשמל ומיזוג, מדויק ונקי. שירות מקצועי מעל 20 שנה. חייגו 055-6601006.",
  },
  {
    slug: "floor-ceiling-sawing",
    icon: "layers",
    title: "ניסור רצפות ותקרות בטון",
    teaser: "פתחי מדרגות, פירים והרחבות — חיתוך בעומק מבוקר בקווים ישרים.",
    description:
      "חיתוך מדויק של רצפות ותקרות בטון לפתחי מדרגות, פירים, פתחי שירות והרחבות. ניסור בעומק מבוקר ובקווים ישרים, עם שליטה מלאה על גבולות החיתוך.",
    audience: "קבלני בנייה, מהנדסים, מנהלי פרויקטים ובעלי נכסים.",
    priceFrom: "לפי מ״ר ועובי — הצעת מחיר", // 🔶 confirm
    bullets: [
      "פתחי מדרגות ופירים ברצפת בטון",
      "חיתוך תקרות לפתחי שירות והרחבות",
      "עומק חיתוך מבוקר ומדויק",
      "עבודה בטוחה עם תמיכה במידת הצורך",
    ],
    process: [
      "בדיקת תכנית, עובי וזיון",
      "סימון וגידור אזור העבודה",
      "ניסור בעומק מבוקר",
      "הוצאת האלמנט, ניקיון ומסירה",
    ],
    metaTitle: "ניסור רצפות ותקרות בטון | בטון פלוס",
    metaDescription:
      "ניסור רצפות ותקרות בטון לפתחי מדרגות, פירים והרחבות — חיתוך מדויק בעומק מבוקר. מעל 20 שנה ניסיון. חייגו 055-6601006.",
  },
  {
    slug: "wire-saw",
    icon: "wire",
    title: "ניסור בכבל יהלום (Wire Saw)",
    teaser: "אלמנטים גדולים ועבים — קורות, עמודים ויסודות שמסור דיסק לא מתאים להם.",
    description:
      "ניסור אלמנטי בטון גדולים ועבים — קורות, עמודים, יסודות וגשרים — בעזרת כבל יהלום. הפתרון המקצועי לחתכים עמוקים שמסור דיסק רגיל אינו מסוגל לבצע.",
    audience: "קבלני תשתיות, חברות בנייה ופרויקטים הנדסיים.",
    priceFrom: "הצעת מחיר לפי פרויקט", // 🔶 confirm
    bullets: [
      "חיתוך קורות, עמודים ויסודות בטון מזוין",
      "מתאים לחתכים עמוקים ולאלמנטים מסיביים",
      "שליטה מלאה בכיוון ובעומק החיתוך",
      "עבודה בטוחה גם במרחבים מאתגרים",
    ],
    process: [
      "בחינת האלמנט ותכנון מסלול החיתוך",
      "השחלת והתקנת כבל היהלום",
      "ניסור מבוקר של האלמנט",
      "פירוק, פינוי ומסירה",
    ],
    metaTitle: "ניסור בכבל יהלום (Wire Saw) | בטון פלוס",
    metaDescription:
      "ניסור בכבל יהלום לאלמנטי בטון גדולים ועבים — קורות, עמודים ויסודות. פתרון מקצועי לחתכים עמוקים. חייגו 055-6601006.",
  },
  {
    slug: "demolition",
    icon: "demolition",
    title: "הריסה מבוקרת ופירוק אלמנטי בטון",
    teaser: "פירוק מדרגות, קירות ואלמנטים — מדויק, נקי ובלי לפגוע במבנה הקיים.",
    description:
      "פירוק והריסה מבוקרת של אלמנטי בטון, מדרגות וקירות — בשילוב ניסור וקידוח ביהלום. עבודה מדויקת ובטוחה, בלי לפגוע בסביבה ובחלקי המבנה שנשארים.",
    audience: "קבלני שיפוץ ובנייה, ועדי בית ובעלי נכסים.",
    priceFrom: "הצעת מחיר לפי היקף", // 🔶 confirm
    bullets: [
      "פירוק מדרגות, קירות ואלמנטי בטון",
      "הריסה מבוקרת בלי פגיעה במבנה הקיים",
      "שילוב ניסור וקידוח להפרדה נקייה",
      "פינוי פסולת ומסירת שטח נקי",
    ],
    process: [
      "הערכת האלמנט וגבולות ההריסה",
      "ניסור/קידוח להפרדה מבוקרת",
      "פירוק האלמנט בבטיחות",
      "פינוי פסולת וניקיון",
    ],
    metaTitle: "הריסה מבוקרת ופירוק אלמנטי בטון | בטון פלוס",
    metaDescription:
      "הריסה מבוקרת ופירוק אלמנטי בטון — מדרגות, קירות ואלמנטים, מדויק ונקי בלי לפגוע במבנה. חייגו 055-6601006.",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export interface TrustStat {
  value: string;
  label: string;
  icon: IconName;
}

export const trustStats: TrustStat[] = [
  { value: "2005", label: "פעילים משנת", icon: "clock" },
  { value: "+1,000", label: "פרויקטים בוצעו", icon: "check" }, // 🔶 confirm number
  { value: "ביטוח צד ג׳", label: "עבודה מבוטחת", icon: "shield" }, // 🔶 confirm coverage
  { value: "בזמן", label: "עמידה בלוחות זמנים", icon: "diamond" },
];

export interface ProcessStep {
  title: string;
  text: string;
}

export const processSteps: ProcessStep[] = [
  { title: "פנייה", text: "מתקשרים או שולחים וואטסאפ עם פרטי העבודה." },
  { title: "תיאום ובדיקה", text: "מתאמים הגעה ובודקים את היקף העבודה בשטח." },
  { title: "הצעת מחיר", text: "מקבלים הצעת מחיר ברורה, ללא הפתעות." },
  { title: "ביצוע מדויק", text: "מנסרים וקודחים ביהלום, בלוח הזמנים שסוכם." },
  { title: "ניקיון ומסירה", text: "מפנים, מנקים ומוסרים שטח עבודה מסודר." },
];

export interface Differentiator {
  title: string;
  text: string;
  icon: IconName;
}

export const differentiators: Differentiator[] = [
  {
    icon: "diamond",
    title: "טכנולוגיית להב יהלום",
    text: "חיתוך מדויק עם פחות רעש, אבק ונזק למבנה — מתאים גם לסביבת מגורים ומשרדים.",
  },
  {
    icon: "clock",
    title: "עמידה בלוחות זמנים",
    text: "מגיעים בזמן ומסיימים בזמן — מתאימים לעבודה צמודה לקבלנים ובאתרי בנייה.",
  },
  {
    icon: "shield",
    title: "בטיחות וביטוח",
    text: "עבודה לפי כללי הבטיחות ועם ביטוח צד ג׳ — לראש שקט מלא.", // 🔶 confirm coverage
  },
  {
    icon: "star",
    title: "מעל 20 שנה ניסיון",
    text: "משנת 2005 — יחס אישי, אמינות, וביצוע מקצועי שהלקוחות חוזרים אליו וממליצים.",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: "כמה עולה ניסור בטון?",
    a: "ניסור בטון אצלנו החל מ-₪150 למ״ר וקידוח החל מ-₪190 למ׳. המחיר הסופי נקבע לפי עובי הבטון, נגישות האתר, היקף העבודה והציוד הנדרש — ותמיד נותנים הצעת מחיר ברורה ללא התחייבות.", // 🔶 confirm pricing
  },
  {
    q: "האם הניסור ביהלום יוצר הרבה רעש ואבק?",
    a: "ניסור ביהלום שקט ונקי משמעותית משיטות אחרות, ולכן מתאים גם לעבודה בבית מאוכלס, במשרד או בבניין פעיל.",
  },
  {
    q: "האם החיתוך פוגע ביציבות המבנה?",
    a: "לא. אנחנו עובדים מדויק ובמידת הצורך לפי הנחיות קונסטרוקטור, כך שהפתח נפתח בלי לסכן את יציבות המבנה.",
  },
  {
    q: "כמה זמן לוקחת עבודת ניסור או קידוח?",
    a: "רוב העבודות מסתיימות תוך מספר שעות, בהתאם לגודל הפתח, עובי הבטון וכמות הקידוחים. בבדיקה בשטח נוכל לתת הערכת זמן מדויקת.",
  },
  {
    q: "האם אתם מגיעים לאזור שלי?",
    a: "אנחנו פועלים בכל גוש דן והמרכז, ומגיעים לפריסה ארצית בתיאום מראש. התקשרו ונשמח לבדוק זמינות לאזור שלכם.", // 🔶 confirm
  },
  {
    q: "יש לכם ביטוח?",
    a: "כן. אנחנו עובדים עם ביטוח צד ג׳ ומקפידים על כללי הבטיחות בכל עבודה.", // 🔶 confirm coverage
  },
];

export interface Review {
  name: string;
  role: string;
  text: string;
  rating: number;
}

// 🔶 placeholder reviews — replace with real Google reviews before launch.
export const reviews: Review[] = [
  {
    name: "אבי כהן",
    role: "קבלן שיפוצים, רמת גן",
    text: "הגיעו בזמן, פתחו שלושה פתחים בקיר בטון — נקי, מדויק ובלי בלגן. בדיוק מה שצריך באתר עבודה.",
    rating: 5,
  },
  {
    name: "מאיה לוי",
    role: "בעלת דירה, תל אביב",
    text: "חששתי מהרעש והאבק, אבל החיתוך ביהלום היה שקט ומסודר. שירות אדיב ומחיר הוגן.",
    rating: 5,
  },
  {
    name: "דניאל אזולאי",
    role: "מנהל פרויקטים, פתח תקווה",
    text: "עבדנו איתם על כמה פרויקטים — מקצועיים, עומדים בזמנים ואפשר לסמוך עליהם. ממליץ בחום.",
    rating: 5,
  },
];

// 🔶 confirm exact coverage list.
export const serviceAreas: string[] = [
  "תל אביב",
  "רמת גן",
  "גבעתיים",
  "בני ברק",
  "פתח תקווה",
  "גבעת שמואל",
  "חולון",
  "בת ים",
  "ראשון לציון",
  "הרצליה",
  "רעננה",
  "כפר סבא",
  "נתניה",
  "ראש העין",
  "מודיעין",
  "ירושלים",
];
