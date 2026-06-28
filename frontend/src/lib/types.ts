export interface Portal {
  id: string;
  name: string;
  role: string;
  color: string;
  icon: string;
  desc: string;
  views: View[];
}

export interface View {
  id: string;
  icon: string;
  label: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  exiting?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
}

export interface Student {
  id: string;
  name: string;
  adm: string;
  class: string;
  competencies: {
    algebra: string;
    geometry: string;
    stats: string;
    overall: string;
    attendance: number;
  };
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  subjects: string;
  class: string;
  status: "present" | "absent" | "leave";
  tsc: string;
}

export interface Product {
  id: string;
  name: string;
  publisher?: string;
  price: number;
  icon: string;
  category: "textbooks" | "lab" | "uniforms";
}

export interface Order {
  id: string;
  product: string;
  buyer: string;
  amount: number;
  status: "completed" | "pending" | "processing" | "shipped";
}

export interface Resolution {
  id: string;
  title: string;
  votes: string;
  status: "PASSED" | "DEFERRED" | "PENDING";
}

export interface ComplianceItem {
  id: string;
  label: string;
  status: "complete" | "partial" | "pending";
}

export interface MonthlyData {
  month: string;
  expected: number;
  collected: number;
}

export interface CountyData {
  county: string;
  compliance: number;
}
