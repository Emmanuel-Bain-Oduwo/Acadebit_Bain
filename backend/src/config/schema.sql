-- Acadebit v2 PostgreSQL Schema
-- Run this on a fresh Railway PostgreSQL to initialise the database

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Core tables ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  county TEXT,
  sub_county TEXT,
  nemis_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('principal','teacher','student','parent','bom','vendor','moe')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  adm_no TEXT NOT NULL,
  class TEXT NOT NULL,
  nemis_no TEXT,
  dob DATE,
  gender TEXT CHECK (gender IN ('M','F')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, adm_no)
);

CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  subjects TEXT,
  class TEXT,
  tsc_no TEXT,
  status TEXT DEFAULT 'present' CHECK (status IN ('present','absent','leave')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present','absent','leave')),
  marked_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

CREATE TABLE IF NOT EXISTS fees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  term TEXT NOT NULL,
  year INT NOT NULL,
  expected_amount NUMERIC(10,2) DEFAULT 0,
  paid_amount NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, term, year)
);

CREATE TABLE IF NOT EXISTS fee_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  amount NUMERIC(10,2) NOT NULL,
  term TEXT NOT NULL,
  year INT NOT NULL,
  mpesa_ref TEXT,
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mpesa_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  checkout_request_id TEXT UNIQUE,
  mpesa_receipt TEXT UNIQUE,
  phone TEXT,
  amount NUMERIC(10,2),
  account_ref TEXT,
  paid_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS cbc_competencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  competency_code TEXT NOT NULL CHECK (competency_code IN ('EE','ME','AE','BE')),
  term TEXT,
  year INT,
  recorded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, subject, term, year)
);

-- ── AI Generations ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id),
  tool_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  output TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT,
  tokens_used INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Competitions & Leaderboard ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('class','school','national')),
  subject TEXT,
  grade TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned','live','ended')),
  prize TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competition_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  score NUMERIC(5,2) DEFAULT 0,
  time_taken_seconds INT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(competition_id, student_id)
);

-- ── Gamification (XP, Badges, Streaks) ───────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_xp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id),
  total_xp INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  last_active_date DATE,
  level INT DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  xp_earned INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  xp_required INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Seed default badges
INSERT INTO badges (name, icon, description, xp_required) VALUES
  ('First Steps', '🌟', 'Earn your first 50 XP', 50),
  ('Rising Scholar', '📚', 'Reach 300 XP', 300),
  ('Dedicated Learner', '🎓', 'Reach 1000 XP', 1000),
  ('Elite Scholar', '🏆', 'Reach 2000 XP', 2000),
  ('7-Day Streak', '🔥', 'Study 7 days in a row', 0),
  ('Test Champion', '✍️', 'Score 100% on any test', 0),
  ('Flash Master', '🃏', 'Complete 10 flashcard sessions', 0),
  ('Paper Champion', '📜', 'Complete 5 past papers', 0)
ON CONFLICT (name) DO NOTHING;

-- ── Content Library ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id),
  created_by UUID REFERENCES users(id),
  title TEXT NOT NULL,
  subject TEXT,
  type TEXT NOT NULL CHECK (type IN ('video','podcast','notes','flashcards','presentation','test','lesson_plan','diagram')),
  content TEXT,
  file_url TEXT,
  duration TEXT,
  is_ai_generated BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  assigned_to_class TEXT NOT NULL,
  school_id UUID REFERENCES schools(id),
  assigned_by UUID REFERENCES users(id),
  message TEXT,
  scheduled_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_id, student_id)
);

-- ── Past Papers ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS past_papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  exam_type TEXT NOT NULL CHECK (exam_type IN ('KCSE','KCPE','CBC','MOCK','CAT','TERM')),
  year INT,
  grade TEXT,
  file_url TEXT,
  uploaded_by UUID REFERENCES users(id),
  download_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS past_paper_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paper_id UUID REFERENCES past_papers(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  score NUMERIC(5,2),
  time_taken_seconds INT,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Shop & E-commerce ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS shop_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id),
  vendor_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('textbook','uniform','lab','stationery','other')),
  price NUMERIC(10,2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shop_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id),
  customer_id UUID REFERENCES users(id),
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled')),
  mpesa_ref TEXT,
  delivery_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shop_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES shop_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES shop_products(id),
  quantity INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL
);

-- ── Safety Events ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS safety_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id),
  type TEXT NOT NULL CHECK (type IN ('fire','medical','security','lockdown','drill','other')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active','resolved')),
  triggered_by UUID REFERENCES users(id),
  headcount_total INT,
  headcount_safe INT,
  notes TEXT,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ── Notifications ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── File Uploads ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id),
  uploaded_by UUID REFERENCES users(id),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  file_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_fees_student ON fees(student_id);
CREATE INDEX IF NOT EXISTS idx_cbc_student ON cbc_competencies(student_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_user ON ai_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_school ON ai_generations(school_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_content_school ON content_items(school_id, is_published);
CREATE INDEX IF NOT EXISTS idx_competition_scores ON competition_scores(competition_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_user_xp_school ON user_xp(school_id, total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_past_papers_filter ON past_papers(subject, exam_type, year);
CREATE INDEX IF NOT EXISTS idx_shop_products_school ON shop_products(school_id, category, is_active);
