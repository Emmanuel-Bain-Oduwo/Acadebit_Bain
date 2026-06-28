import type { Portal, Student, Staff, Product, Order, Resolution, ComplianceItem, MonthlyData, CountyData } from "./types";

export const PORTALS: Portal[] = [
  {
    id: "principal",
    name: "Principal",
    role: "School Head",
    color: "#22c55e",
    icon: "🏫",
    desc: "Full school oversight, safety, fees, staff & government reports",
    views: [
      { id: "dashboard", icon: "📊", label: "Dashboard" },
      { id: "safetycore", icon: "🛡️", label: "SafetyCore™" },
      { id: "feesmart", icon: "💳", label: "FeeSmart™" },
      { id: "staff", icon: "👥", label: "Staff & AutoTable™" },
      { id: "govbridge", icon: "🏛️", label: "GovBridge™ Reports" },
    ],
  },
  {
    id: "teacher",
    name: "Teacher",
    role: "Educator",
    color: "#3b82f6",
    icon: "📚",
    desc: "CBC tracker, class management & AI-powered lesson tools",
    views: [
      { id: "cbctracker", icon: "📋", label: "CBC Tracker & Classes" },
      { id: "aistudio", icon: "🤖", label: "AI Teacher Studio" },
    ],
  },
  {
    id: "student",
    name: "Student",
    role: "Learner",
    color: "#a855f7",
    icon: "🎓",
    desc: "Personalised study plan, AI tutor, flashcards & past papers",
    views: [
      { id: "learning", icon: "📖", label: "Learning Dashboard" },
      { id: "aitutor", icon: "💬", label: "AI Tutor & Flashcards" },
      { id: "pastpapers", icon: "📄", label: "Past Papers Hub" },
    ],
  },
  {
    id: "parent",
    name: "Parent",
    role: "Guardian",
    color: "#14b8a6",
    icon: "👨‍👩‍👧",
    desc: "Track your child's progress, pay fees & buy school supplies",
    views: [
      { id: "mychild", icon: "👦", label: "My Child — Brian" },
      { id: "buytextbooks", icon: "📚", label: "Buy Textbooks" },
      { id: "buyuniforms", icon: "👕", label: "Buy Uniforms" },
    ],
  },
  {
    id: "bom",
    name: "BOM",
    role: "Board of Management",
    color: "#f59e0b",
    icon: "⚖️",
    desc: "Governance, budget oversight, resolutions & board meeting packs",
    views: [{ id: "governance", icon: "📑", label: "Governance Dashboard" }],
  },
  {
    id: "moe",
    name: "MoE",
    role: "Ministry of Education",
    color: "#6366f1",
    icon: "🏛️",
    desc: "National CBC compliance, NEMIS sync & county-level reporting",
    views: [{ id: "national", icon: "🗺️", label: "National Dashboard" }],
  },
  {
    id: "shop",
    name: "Shop",
    role: "Marketplace",
    color: "#f97316",
    icon: "🛒",
    desc: "Buy textbooks, lab equipment & uniforms via M-Pesa",
    views: [
      { id: "textbooks", icon: "📗", label: "Textbooks" },
      { id: "labequip", icon: "🔬", label: "Lab Equipment" },
      { id: "uniforms", icon: "👔", label: "Uniforms" },
    ],
  },
  {
    id: "vendor",
    name: "Vendor",
    role: "Supplier",
    color: "#ec4899",
    icon: "🏪",
    desc: "Manage products, track orders & receive M-Pesa settlements",
    views: [{ id: "vendordash", icon: "📈", label: "Vendor Dashboard" }],
  },
];

export const STUDENTS: Student[] = [
  { id: "1", name: "Brian Omondi", adm: "MJA/2021/045", class: "Grade 8A", competencies: { algebra: "EE", geometry: "ME", stats: "EE", overall: "EE", attendance: 97 } },
  { id: "2", name: "Aisha Kamau", adm: "MJA/2021/032", class: "Grade 8A", competencies: { algebra: "ME", geometry: "ME", stats: "ME", overall: "ME", attendance: 94 } },
  { id: "3", name: "Kevin Njoroge", adm: "MJA/2021/018", class: "Grade 8A", competencies: { algebra: "AE", geometry: "BE", stats: "AE", overall: "AE", attendance: 81 } },
  { id: "4", name: "Fatuma Hassan", adm: "MJA/2021/061", class: "Grade 8A", competencies: { algebra: "ME", geometry: "EE", stats: "ME", overall: "ME", attendance: 99 } },
  { id: "5", name: "Daniel Kimani", adm: "MJA/2021/027", class: "Grade 8A", competencies: { algebra: "BE", geometry: "AE", stats: "BE", overall: "BE", attendance: 73 } },
];

export const STAFF: Staff[] = [
  { id: "1", name: "Mr. James Mwangi", role: "Mathematics Teacher", subjects: "Maths, Physics", class: "Grade 8A", status: "present", tsc: "TSC/2018/004521" },
  { id: "2", name: "Ms. Grace Achieng", role: "English Teacher", subjects: "English, CRE", class: "Grade 7B", status: "present", tsc: "TSC/2019/007832" },
  { id: "3", name: "Mr. Peter Mutua", role: "Science Teacher", subjects: "Biology, Chemistry", class: "Grade 8B", status: "leave", tsc: "TSC/2017/003219" },
  { id: "4", name: "Ms. Ann Wanjiku", role: "Kiswahili Teacher", subjects: "Kiswahili, Social Studies", class: "Grade 7A", status: "present", tsc: "TSC/2020/009145" },
  { id: "5", name: "Mr. Robert Odhiambo", role: "PE Teacher", subjects: "PE, Art", class: "Grade 6A", status: "present", tsc: "TSC/2016/002087" },
  { id: "6", name: "Ms. Caroline Muthoni", role: "Deputy Head", subjects: "Admin", class: "—", status: "absent", tsc: "TSC/2012/000934" },
];

export const TEXTBOOKS: Product[] = [
  { id: "t1", name: "Grade 8 Mathematics Learner's Book", publisher: "KLB", price: 650, icon: "📗", category: "textbooks" },
  { id: "t2", name: "Grade 8 English — Distinction", publisher: "Oxford", price: 580, icon: "📘", category: "textbooks" },
  { id: "t3", name: "Grade 8 Science & Technology", publisher: "Longhorn", price: 720, icon: "🔬", category: "textbooks" },
  { id: "t4", name: "Grade 8 Kiswahili — Fahari", publisher: "JKF", price: 520, icon: "📙", category: "textbooks" },
  { id: "t5", name: "Grade 8 Social Studies", publisher: "Mentor", price: 490, icon: "🌍", category: "textbooks" },
  { id: "t6", name: "CBC Grade 8 Bundle (All 5)", publisher: "Various", price: 2799, icon: "📦", category: "textbooks" },
];

export const LAB_EQUIPMENT: Product[] = [
  { id: "l1", name: "Compound Microscope (100×–400×)", price: 12500, icon: "🔬", category: "lab" },
  { id: "l2", name: "Digital Balance (0.01g precision)", price: 8900, icon: "⚖️", category: "lab" },
  { id: "l3", name: "Bunsen Burner Set", price: 3200, icon: "🔥", category: "lab" },
  { id: "l4", name: "Dissection Kit (12 piece)", price: 1850, icon: "🧪", category: "lab" },
  { id: "l5", name: "pH Meter Digital", price: 4600, icon: "💧", category: "lab" },
  { id: "l6", name: "Chemistry Glassware Set", price: 6750, icon: "🧫", category: "lab" },
];

export const UNIFORMS: Product[] = [
  { id: "u1", name: "Boys Grey Trouser", price: 850, icon: "👖", category: "uniforms" },
  { id: "u2", name: "Girls Grey Skirt", price: 780, icon: "👗", category: "uniforms" },
  { id: "u3", name: "White School Shirt", price: 650, icon: "👔", category: "uniforms" },
  { id: "u4", name: "School Sweater (Green)", price: 1200, icon: "🧥", category: "uniforms" },
  { id: "u5", name: "PE Kit (Shorts + T-shirt)", price: 950, icon: "🩳", category: "uniforms" },
  { id: "u6", name: "Black School Shoes", price: 1850, icon: "👞", category: "uniforms" },
];

export const VENDOR_ORDERS: Order[] = [
  { id: "ORD-0127", product: "CBC Grade 8 Bundle", buyer: "Mary Wanjiku", amount: 2799, status: "completed" },
  { id: "ORD-0126", product: "Compound Microscope", buyer: "Mwangaza Academy", amount: 12500, status: "pending" },
  { id: "ORD-0125", product: "School Sweater (Green)", buyer: "James Kamau", amount: 1200, status: "shipped" },
  { id: "ORD-0124", product: "Grade 8 Maths Book", buyer: "Fatuma Abdi", amount: 650, status: "completed" },
  { id: "ORD-0123", product: "Chemistry Glassware Set", buyer: "Starehe Boys", amount: 6750, status: "processing" },
];

export const RESOLUTIONS: Resolution[] = [
  { id: "1", title: "Approve 2026 Annual Budget — KES 4.2M", votes: "7/7", status: "PASSED" },
  { id: "2", title: "Authorise New Library Construction Tender", votes: "6/7", status: "PASSED" },
  { id: "3", title: "Review Term 3 Fee Structure", votes: "3/7", status: "DEFERRED" },
  { id: "4", title: "Adopt LYSI Digital Safety Policy", votes: "7/7", status: "PASSED" },
];

export const COMPLIANCE_ITEMS: ComplianceItem[] = [
  { id: "1", label: "NEMIS Learner Data Upload", status: "complete" },
  { id: "2", label: "CBC Assessment Records Submitted", status: "complete" },
  { id: "3", label: "Teacher TSC Numbers Verified", status: "complete" },
  { id: "4", label: "Infrastructure Report Filed", status: "partial" },
  { id: "5", label: "Health & Safety Audit", status: "partial" },
  { id: "6", label: "KCSE Pre-registration", status: "pending" },
];

export const FEE_DATA: MonthlyData[] = [
  { month: "Jan", expected: 200000, collected: 185000 },
  { month: "Feb", expected: 200000, collected: 178000 },
  { month: "Mar", expected: 200000, collected: 162000 },
  { month: "Apr", expected: 200000, collected: 190000 },
  { month: "May", expected: 200000, collected: 171000 },
  { month: "Jun", expected: 200000, collected: 195000 },
];

export const COUNTY_DATA: CountyData[] = [
  { county: "Nairobi", compliance: 84 },
  { county: "Mombasa", compliance: 71 },
  { county: "Kisumu", compliance: 63 },
  { county: "Nakuru", compliance: 78 },
  { county: "Eldoret", compliance: 55 },
  { county: "Garissa", compliance: 42 },
];

export const TEST_SCORES = [
  { week: "Wk 1", brian: 58, classAvg: 61 },
  { week: "Wk 2", brian: 63, classAvg: 62 },
  { week: "Wk 3", brian: 69, classAvg: 64 },
  { week: "Wk 4", brian: 65, classAvg: 65 },
  { week: "Wk 5", brian: 72, classAvg: 66 },
  { week: "Wk 6", brian: 68, classAvg: 65 },
  { week: "Wk 7", brian: 74, classAvg: 67 },
];

export const VENDOR_REVENUE = [
  { month: "Jan", revenue: 52000 },
  { month: "Feb", revenue: 61000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 73000 },
  { month: "May", revenue: 68000 },
  { month: "Jun", revenue: 84000 },
];

export const FLASHCARDS = [
  { q: "What is the quadratic formula?", a: "x = (−b ± √(b²−4ac)) / 2a" },
  { q: "Define photosynthesis.", a: "The process by which green plants convert sunlight, water, and CO₂ into glucose and oxygen using chlorophyll." },
  { q: "What are the three states of matter?", a: "Solid, Liquid, and Gas. Matter changes state through heating or cooling at specific temperatures." },
];
