# MC Mathematics — Production Supabase Database Setup

Follow these exact steps in your **Supabase Dashboard** -> **SQL Editor** to initialize the clean production database.

---

### Step 1: Wipe Existing Test Data (Optional if new project)
> [!WARNING]
> This permanently erases all test tables and test users in `auth.users`.
- Open [`00_wipe_everything.sql`](./00_wipe_everything.sql) in your text editor.
- Change `confirm_wipe boolean := false;` to `confirm_wipe boolean := true;`.
- Paste the entire script into Supabase SQL Editor and click **Run**.

---

### Step 2: Create Production Schema
- Open [`01_schema.sql`](./01_schema.sql).
- Paste into the SQL Editor and click **Run**.
- This creates all 17 core production tables, constraints, enums, foreign keys, and indexes.

---

### Step 3: Enable Row-Level Security (RLS)
- Open [`02_rls.sql`](./02_rls.sql).
- Paste into the SQL Editor and click **Run**.
- It enables RLS on every public table, attaches all authorization policies, and executes an automated safety audit.

---

### Step 4: Storage Buckets & Policies
- Open [`03_storage.sql`](./03_storage.sql).
- Paste into the SQL Editor and click **Run**.
- This provisions:
  - `papers` (private bucket for test papers and student marks)
  - `site-assets` (public bucket for class timetable, syllabus, logos)

---

### Step 5: Realtime Replication
- Open [`04_realtime.sql`](./04_realtime.sql).
- Paste into the SQL Editor and click **Run**.
- This registers live update channels for `marks`, `special_notes`, `announcements`, and `attendance`.

---

### Step 6: Settings and Admin Account
- Open [`05_settings_and_admin.sql`](./05_settings_and_admin.sql).
- Edit `sir_email` and `sir_whatsapp` at the top with Sir's real details.
- Paste into the SQL Editor and click **Run**.
- This seeds `id_counters` (starts IDs at 1000 so the first student created is 1001) and sets up Sir's administrative controls.

---

### Step 7: Verify Setup
- Open [`06_verify.sql`](./06_verify.sql).
- Paste into the SQL Editor and click **Run**.
- It will confirm that all tables, functions, and RLS barriers are 100% operational.
