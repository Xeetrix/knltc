-- ==============================================================================
-- KNLTC (Japan Gateway) - Master Supabase Database Schema
-- Run this script in the Supabase SQL Editor (https://app.supabase.com/project/_/sql)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. CRM Leads Table (Omni-channel Leads)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS knltc_crm_leads (
    id TEXT PRIMARY KEY DEFAULT ('lead-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT,
    city TEXT NOT NULL DEFAULT 'Dhaka',
    source TEXT NOT NULL DEFAULT 'FACEBOOK_META', -- FACEBOOK_META, WHATSAPP_DIRECT, WEBSITE_FORM, OFFICE_WALKIN, B2B_REFERRAL
    interest TEXT NOT NULL DEFAULT 'STUDENT_VISA_REGULAR', -- STUDENT_VISA_REGULAR, STUDENT_VISA_PREMIUM, SSW_CONSTRUCTION_SPECIAL, SSW_CAREGIVER, SSW_AGRICULTURE, TITP_TECHNICAL, JAPANESE_N5, JAPANESE_N4
    status TEXT NOT NULL DEFAULT 'NEW', -- NEW, CONTACTED, COUNSELED, OFFICE_VISIT_BOOKED, ADMITTED, ARCHIVED
    education TEXT NOT NULL DEFAULT 'HSC (GPA 3.80)',
    japanese_proficiency TEXT NOT NULL DEFAULT 'NONE', -- NONE, LEARNING_N5, PASSED_N5, PASSED_N4, NAT_JFT
    study_gap_years INTEGER NOT NULL DEFAULT 0,
    assigned_to TEXT NOT NULL DEFAULT 'নাসরিন সুলতানা (টেলি-কাউন্সেলর)',
    branch TEXT NOT NULL DEFAULT 'DHK-HQ', -- DHK-HQ, KHULNA-01
    notes TEXT DEFAULT '',
    follow_up_date DATE DEFAULT CURRENT_DATE,
    last_contacted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick filtering by branch and status
CREATE INDEX IF NOT EXISTS idx_knltc_crm_leads_branch ON knltc_crm_leads(branch);
CREATE INDEX IF NOT EXISTS idx_knltc_crm_leads_status ON knltc_crm_leads(status);

-- ------------------------------------------------------------------------------
-- 3. Visa Applicants Table (10-Step Pipeline Engine)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS knltc_visa_applicants (
    id TEXT PRIMARY KEY DEFAULT ('visa-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
    tracking_no TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    branch TEXT NOT NULL DEFAULT 'DHK-HQ', -- DHK-HQ, KHULNA-01
    package_type TEXT NOT NULL DEFAULT 'REGULAR', -- REGULAR (৳১,২০,০০০), PREMIUM (৳১১,০০,০০০)
    intake_session TEXT NOT NULL DEFAULT 'OCTOBER_2027', -- APRIL_2027, JULY_2027, OCTOBER_2027, JANUARY_2028
    stage INTEGER NOT NULL DEFAULT 1 CHECK (stage >= 1 AND stage <= 10),
    target_school TEXT NOT NULL,
    sponsor_name TEXT NOT NULL,
    sponsor_relation TEXT NOT NULL DEFAULT 'FATHER',
    sponsor_bank TEXT NOT NULL,
    sponsor_balance_bdt NUMERIC(14, 2) NOT NULL DEFAULT 0,
    bank_loan_assistance BOOLEAN NOT NULL DEFAULT FALSE,
    bank_loan_bank TEXT,
    coe_status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    visa_status TEXT NOT NULL DEFAULT 'IN_PROCESS', -- IN_PROCESS, STAMPED, DEPARTED
    counselor_name TEXT NOT NULL DEFAULT 'শেখ বাসেত',
    passport_copy_url TEXT,
    notarized_docs_url TEXT,
    bank_solvency_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_knltc_visa_branch ON knltc_visa_applicants(branch);
CREATE INDEX IF NOT EXISTS idx_knltc_visa_stage ON knltc_visa_applicants(stage);

-- ------------------------------------------------------------------------------
-- 4. LMS Bridge Table (`npw.bd/knltc` sync)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS knltc_lms_bridges (
    id TEXT PRIMARY KEY DEFAULT ('lms-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
    student_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    course_level TEXT NOT NULL DEFAULT 'N5', -- N5, N4, IRODORI
    enrollment_no TEXT UNIQUE NOT NULL,
    portal_username TEXT NOT NULL,
    portal_password_masked TEXT NOT NULL,
    portal_fee_deducted_bdt NUMERIC(10, 2) NOT NULL DEFAULT 2000,
    net_knltc_margin_bdt NUMERIC(10, 2) NOT NULL DEFAULT 10000,
    credentials_sent_via_wa BOOLEAN NOT NULL DEFAULT TRUE,
    credentials_sent_at TIMESTAMPTZ DEFAULT NOW(),
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    active_batch TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. B2B Partners & Agents Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS knltc_b2b_agents (
    id TEXT PRIMARY KEY DEFAULT ('b2b-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
    organization_name TEXT NOT NULL,
    agent_type TEXT NOT NULL DEFAULT 'INSTITUTIONAL', -- INSTITUTIONAL, LOCAL_SUB_AGENT, CAMPUS_AMBASSADOR
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    referred_students_count INTEGER NOT NULL DEFAULT 0,
    successful_visas_count INTEGER NOT NULL DEFAULT 0,
    agreed_commission_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    pending_commission_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    paid_commission_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knltc_partner_schools (
    id TEXT PRIMARY KEY DEFAULT ('sch-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
    name TEXT NOT NULL,
    japanese_name TEXT NOT NULL,
    location TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    commission_per_student_yen NUMERIC(10, 2) NOT NULL DEFAULT 80000,
    commission_per_student_bdt NUMERIC(10, 2) NOT NULL DEFAULT 64000,
    active_students_count INTEGER NOT NULL DEFAULT 0,
    total_commission_received_yen NUMERIC(14, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ACTIVE_PARTNER',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. Financial Transactions Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS knltc_finance_transactions (
    id TEXT PRIMARY KEY DEFAULT ('trx-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
    receipt_no TEXT UNIQUE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    student_name TEXT NOT NULL,
    type TEXT NOT NULL, -- COURSE_FEE, REGULAR_SERVICE_CHARGE, PREMIUM_PACKAGE_ADVANCE, EXPENSE_OFFICE, MARKETING_META
    amount_bdt NUMERIC(12, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'BKASH', -- BKASH, NAGAD, BANK_TRANSFER, CASH_OFFICE, AAMARPAY, SSLCOMMERZ
    reference_or_trx TEXT NOT NULL,
    branch TEXT NOT NULL DEFAULT 'DHK-HQ',
    verified_by TEXT NOT NULL DEFAULT 'শেখ বাসেত (ম্যানেজিং ডিরেক্টর)',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. Staff & Tele-Counselor HR Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS knltc_staff_members (
    id TEXT PRIMARY KEY DEFAULT ('staff-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
    name TEXT NOT NULL,
    role TEXT NOT NULL, -- TELE_COUNSELOR, SENIOR_SENSEI, BRANCH_MANAGER, COUNSELOR
    location TEXT NOT NULL DEFAULT 'DHAKA_OFFICE', -- REMOTE, DHAKA_OFFICE, KHULNA_OFFICE
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    monthly_base_salary_bdt NUMERIC(10, 2) NOT NULL DEFAULT 15000,
    calls_target_monthly INTEGER NOT NULL DEFAULT 150,
    calls_completed INTEGER NOT NULL DEFAULT 0,
    admissions_target INTEGER NOT NULL DEFAULT 5,
    admissions_achieved INTEGER NOT NULL DEFAULT 0,
    performance_bonus_bdt NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. Master Website CMS Table (Full Dynamic JSON storage)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS knltc_website_cms (
    id TEXT PRIMARY KEY DEFAULT 'master-cms-root',
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. Storage Buckets (Execute via Supabase Storage or Dashboard)
-- ------------------------------------------------------------------------------
-- Insert storage buckets if storage extension is enabled
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('knltc-documents', 'knltc-documents', true),
  ('knltc-media', 'knltc-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Bucket Public Read Policies
DROP POLICY IF EXISTS "Public Access to KNLTC Media" ON storage.objects;
CREATE POLICY "Public Access to KNLTC Media"
ON storage.objects FOR SELECT
USING (bucket_id IN ('knltc-media', 'knltc-documents'));

-- Bucket Service Role Write Policy
DROP POLICY IF EXISTS "Allow Service Write" ON storage.objects;
CREATE POLICY "Allow Service Write"
ON storage.objects FOR ALL
USING (bucket_id IN ('knltc-media', 'knltc-documents'))
WITH CHECK (bucket_id IN ('knltc-media', 'knltc-documents'));

-- ------------------------------------------------------------------------------
-- 10. Enable Row Level Security (RLS) with Public Select for Landing Page
-- ------------------------------------------------------------------------------
ALTER TABLE knltc_crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE knltc_visa_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE knltc_lms_bridges ENABLE ROW LEVEL SECURITY;
ALTER TABLE knltc_b2b_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE knltc_partner_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE knltc_finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knltc_staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE knltc_website_cms ENABLE ROW LEVEL SECURITY;

-- Allow anon read on CMS & public lead submission
CREATE POLICY "Allow public read on knltc_website_cms" ON knltc_website_cms FOR SELECT USING (true);
CREATE POLICY "Allow public insert on knltc_crm_leads" ON knltc_crm_leads FOR INSERT WITH CHECK (true);

-- Allow service_role full access to all tables
CREATE POLICY "Allow service role on knltc_crm_leads" ON knltc_crm_leads FOR ALL USING (true);
CREATE POLICY "Allow service role on knltc_visa_applicants" ON knltc_visa_applicants FOR ALL USING (true);
CREATE POLICY "Allow service role on knltc_lms_bridges" ON knltc_lms_bridges FOR ALL USING (true);
CREATE POLICY "Allow service role on knltc_b2b_agents" ON knltc_b2b_agents FOR ALL USING (true);
CREATE POLICY "Allow service role on knltc_partner_schools" ON knltc_partner_schools FOR ALL USING (true);
CREATE POLICY "Allow service role on knltc_finance_transactions" ON knltc_finance_transactions FOR ALL USING (true);
CREATE POLICY "Allow service role on knltc_staff_members" ON knltc_staff_members FOR ALL USING (true);
CREATE POLICY "Allow service role on knltc_website_cms" ON knltc_website_cms FOR ALL USING (true);
