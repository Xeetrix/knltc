# Implementation Plan: Multi-Track Visa Kanban Pipeline (Student, SSW, TITP) & Interactive 3-Track Eligibility Engine

## 1. Multi-Track Visa Kanban Pipeline (`STUDENT_VISA` | `SSW_JOB` | `TITP_INTERN`)
Currently, all visa candidates are placed into a single 10-step Student Visa Kanban pipeline, making it difficult to manage Job Visa (`SSW` and `TITP`) candidates whose stages differ from Student Visa stages.

### A. Track Switcher Tabs & Auto-Assignment
- **Track Switcher Header on Visa Kanban**: Add a prominent segmented track switcher at the top of the Visa Kanban board with live applicant counts per track:
  1. **Student Visa Pipeline (10 Stages)**
  2. **SSW Specified Skilled Worker Pipeline (10 Stages)**
  3. **TITP Technical Intern Pipeline (9 Stages)**
- **Auto-Detection + Manual Track Switching**:
  - Add `visaTrack?: "STUDENT" | "SSW" | "TITP"` to `VisaApplicant` (and `CrmLead`).
  - Automatically infer the track from the candidate's `interest` (`SSW_*` → `SSW`, `TITP_TECHNICAL` → `TITP`, `STUDENT_VISA_*` → `STUDENT`) or `targetSchool` name (e.g., if `targetSchool` contains `TITP` or `SSW`, such as *Abdur Rahman* in `TITP Construction Center`, automatically classify as `TITP` or `SSW`).
  - Provide a quick track selector dropdown on each Kanban card and inside the 360° Profile **Applications** tab so admins can switch a candidate's visa track at any time.

### B. Dedicated Stage Definitions per Track
Each track will render its exact workflow columns and stage subtitles on the Kanban board and in the 360° Profile **Applications** tab:

1. **Student Visa Track (10 Stages)**:
   - `1. File Opening` → `2. Language Prep` → `3. Translation` → `4. School Interview` → `5. COE Filing` → `6. COE Approved` → `7. Tuition Wire` → `8. Embassy VFS` → `9. Visa Stamped` → `10. Japan Landing`
2. **SSW Job Visa Track (10 Stages)**:
   - `1. File Open` → `2. Language Learning` → `3. Skill Test Preparation` → `4. Interview Preparation` → `5. Selected & Waiting for Medical` → `6. Waiting for Demand Letter` → `7. Waiting for COE` → `8. Embassy & VFS` → `9. Visa Stamped` → `10. Japan Landing`
3. **TITP Job Visa Track (9 Stages)**:
   - `1. File Open` → `2. Basic Language` → `3. Interview Preparation` → `4. Selected & Waiting for Medical` → `5. Waiting for Demand Letter` → `6. Waiting for COE` → `7. Embassy & VFS` → `8. Visa Stamped` → `9. Japan Landing`

### C. Track-Aware Stage Automation & Milestones
- **COE Milestone & B2B Commission Trigger**:
  - Student Visa: Stage 6 (`COE Approved`)
  - SSW: Stage 7 (`Waiting for COE` / COE Issued)
  - TITP: Stage 6 (`Waiting for COE` / COE Issued)
- **Visa Stamped & Japan Landing Status Updates**:
  - Automatically mark `visaStatus = "STAMPED"` at Stage 9 (Student/SSW) or Stage 8 (TITP), and `visaStatus = "DEPARTED"` at the final stage (`Japan Landing`: Stage 10 for Student/SSW, Stage 9 for TITP).
- **Direct Stage Selector & Next/Previous Controls**:
  - Allow moving candidates forward/backward or jumping directly to any stage in their assigned track directly from the Kanban card or the 360° Profile.

---

## 2. Upgraded Interactive Automated Eligibility Engine
Currently, the **Automated Eligibility Engine** card on the Visa Kanban tab has static, uncontrolled inputs that do not recalculate when edited.

### A. Candidate Selector + Live Parameter Controls
- **CRM Lead / Applicant Quick-Load Dropdown**: Select any existing CRM Lead or Visa Applicant to automatically populate their real academic, age, study gap, language, and financial solvency data into the engine—or use **Custom Manual Input** mode for walk-in counseling.
- **Controlled Interactive Inputs**:
  - **SSC GPA** & **HSC / Diploma GPA** (1.00 – 5.00)
  - **Candidate Age** (18 – 40 years)
  - **Study Gap** (0 – 15 years)
  - **Education Level** (`SSC / Below HSC`, `HSC / Alim`, `Diploma`, `Bachelor / Master's`)
  - **Japanese Proficiency** (`None / Beginner`, `Learning N5`, `JLPT N5 / NAT 5Q`, `JLPT N4 / JFT-Basic`)
  - **Sponsor Bank Solvency** (Amount in BDT + Bank Loan Needed toggle)

### B. Simultaneous 3-Track Eligibility Assessment
The engine will dynamically calculate an overall eligibility score (`0–100%`) and display individual readiness cards for all three pathways side-by-side:
1. **Student Visa Eligibility**:
   - Evaluates HSC/Degree completion, GPA ($\ge 2.50$ minimum, $\ge 3.50$ preferred), Study Gap ($\le 5$ years ideal, or requires job experience justification), N5/150-hour study requirement, and Sponsor Bank Solvency ($\ge \text{৳18 Lakh}$ or partner bank loan).
2. **SSW (Specified Skilled Worker) Eligibility**:
   - Evaluates Age ($18–35$ years), JLPT N4 / JFT-Basic readiness, Sector Skill Test readiness (Caregiver, Construction, Agriculture, Food Service), and zero-sponsor-solvency advantage.
3. **TITP (Technical Intern Training Program) Eligibility**:
   - Evaluates Age ($18–30$ years), minimum SSC/HSC education, Basic Japanese readiness, physical/medical readiness, and tolerant study gap / GPA thresholds.
- **Actionable Next Step**: Includes a 1-click button to apply the recommended track to the selected candidate or promote them directly into that track's Visa Pipeline.

---

## 3. 360° Profile & Google Sheets Sync Integration
- **360° Profile (`LeadProfileModal.tsx` & `StudentProfileView.tsx`)**:
  - Update the **Applications** tab and **Matches** tab to display the candidate's active Visa Track (`Student Visa`, `SSW`, or `TITP`), render the exact 9-step or 10-step progress bar for that track, and allow switching tracks or stages seamlessly.
- **Google Sheets & Apps Script Sync (`lib/google-sheets-db.ts` & `google-apps-script/Code.gs`)**:
  - Persist `visa_track` and `stage_label` in `knltc_visa_applicants` (and `profile_json`) so track assignments and stage movements sync cleanly with Google Sheets.
