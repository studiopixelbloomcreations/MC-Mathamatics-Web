-- =============================================================================
-- MC MATHEMATICS SEED DATA (Grades 9-11, 3 Papers, Marks, Attendance, Notes)
-- =============================================================================

-- Ensure auth.users exist for demo students
-- Passwords set to hashed '123456' using pgcrypto crypt
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) values
(
  'a0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'mcg10tp1001@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG10TP1001", "full_name": "Kavindu Perera"}'
),
(
  'a0000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'mcg10t1002@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG10T1002", "full_name": "Senuri Jayasinghe"}'
),
(
  'a0000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'mcg11tp1001@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG11TP1001", "full_name": "Dulitha Bandara"}'
),
(
  'a0000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'mcg09tp1001@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG09TP1001", "full_name": "Nethmi Wickramasinghe"}'
)
on conflict (id) do nothing;

-- 1. Seed Students
insert into students (
  id, unique_id, full_name, grade, age, whereabouts, class_type,
  student_phone, parent_whatsapp, parent_phone, report_opt_in, report_language,
  parent_last_inbound_at, parent_wa_verified
) values
(
  'a0000000-0000-0000-0000-000000000001',
  'MCG10TP1001',
  'Kavindu Perera',
  10,
  15,
  'Kurunegala Town',
  'TP',
  '+94771112233',
  '+94779998877',
  '+94779998877',
  true,
  'en',
  now() - interval '2 hours',
  true
),
(
  'a0000000-0000-0000-0000-000000000002',
  'MCG10T1002',
  'Senuri Jayasinghe',
  10,
  15,
  'Mawathagama',
  'T',
  '+94772223344',
  '+94778887766',
  '+94778887766',
  true,
  'si',
  null,
  false
),
(
  'a0000000-0000-0000-0000-000000000003',
  'MCG11TP1001',
  'Dulitha Bandara',
  11,
  16,
  'Kuliyapitiya',
  'TP',
  '+94773334455',
  '+94777776655',
  '+94777776655',
  true,
  'en',
  now() - interval '10 hours',
  true
),
(
  'a0000000-0000-0000-0000-000000000004',
  'MCG09TP1001',
  'Nethmi Wickramasinghe',
  9,
  14,
  'Wariyapola',
  'TP',
  '+94774445566',
  '+94776665544',
  '+94776665544',
  true,
  'en',
  null,
  false
)
on conflict (id) do nothing;

-- 2. Seed Parental Settings
insert into parental_settings (student_id, locked, report_frequency) values
('a0000000-0000-0000-0000-000000000001', false, 'every_paper'),
('a0000000-0000-0000-0000-000000000002', false, 'weekly'),
('a0000000-0000-0000-0000-000000000003', false, 'every_paper'),
('a0000000-0000-0000-0000-000000000004', false, 'every_paper')
on conflict (student_id) do nothing;

-- 3. Seed ID Counters
insert into id_counters (prefix, last_value) values
('MCG10TP', 1001),
('MCG10T', 1002),
('MCG11TP', 1001),
('MCG09TP', 1001)
on conflict (prefix) do update set last_value = excluded.last_value;

-- 4. Seed 3 Papers (2 Finished, 1 Ongoing)
insert into papers (id, title, grade, class_type, status, paper_date, due_at, total_marks, sections) values
(
  'b0000000-0000-0000-0000-000000000001',
  'Paper 01 - Algebraic Expressions & Geometry',
  10,
  null, -- applies to both T and TP
  'finished',
  current_date - interval '14 days',
  current_date - interval '10 days',
  100,
  '[
    {"name": "Part A - Multiple Choice", "max": 30},
    {"name": "Part B - Structured Algebra", "max": 40},
    {"name": "Part C - Geometry & Theorems", "max": 30}
  ]'::jsonb
),
(
  'b0000000-0000-0000-0000-000000000002',
  'Paper 02 - Quadratic Equations & Graphing',
  10,
  'TP', -- only TP class
  'ongoing',
  current_date - interval '2 days',
  current_date + interval '4 days',
  100,
  '[
    {"name": "Section 1 - Factorization & Roots", "max": 40},
    {"name": "Section 2 - Turning Points & Parabolas", "max": 60}
  ]'::jsonb
),
(
  'b0000000-0000-0000-0000-000000000003',
  'O/L Speed Drill Paper 01 - Complete Syllabus',
  11,
  null,
  'finished',
  current_date - interval '7 days',
  current_date - interval '5 days',
  100,
  '[
    {"name": "Part I - 25 Short Questions", "max": 50},
    {"name": "Part II - Structured Essay", "max": 50}
  ]'::jsonb
)
on conflict (id) do nothing;

-- 5. Seed Marks
insert into marks (student_id, paper_id, marks, section_marks, source) values
(
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  88.5,
  '{"Part A - Multiple Choice": 28, "Part B - Structured Algebra": 36.5, "Part C - Geometry & Theorems": 24}'::jsonb,
  'manual'
),
(
  'a0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000001',
  74.0,
  '{"Part A - Multiple Choice": 25, "Part B - Structured Algebra": 31, "Part C - Geometry & Theorems": 18}'::jsonb,
  'manual'
),
(
  'a0000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000003',
  92.0,
  '{"Part I - 25 Short Questions": 48, "Part II - Structured Essay": 44}'::jsonb,
  'manual'
)
on conflict (student_id, paper_id) do nothing;

-- 6. Seed Attendance
insert into attendance (student_id, date, session, status, source) values
('a0000000-0000-0000-0000-000000000001', current_date - interval '14 days', 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000001', current_date - interval '7 days', 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000001', current_date, 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000002', current_date - interval '14 days', 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000002', current_date - interval '7 days', 'main', 'late', 'manual'),
('a0000000-0000-0000-0000-000000000002', current_date, 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000003', current_date - interval '7 days', 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000003', current_date, 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000004', current_date, 'main', 'present', 'manual')
on conflict (student_id, date, session) do nothing;

-- 7. Seed Announcements
insert into announcements (title, body, target_grade, target_student, pinned, source) values
(
  'Special Term Revision Seminar',
  'Dear students and parents, the Grade 10 intensive revision session will be conducted this Saturday from 8:30 AM to 1:30 PM at the Main Hall.',
  10,
  null,
  true,
  'manual'
),
(
  'O/L Past Paper Speed Drill Series',
  'Grade 11 students must submit Paper 01 before Friday 6:00 PM. Discussion session will be held via the live portal.',
  11,
  null,
  false,
  'manual'
),
(
  'Welcome to MC Mathematics 2026',
  'Welcome to the new academic term. Login credentials have been activated for all registered students. Check your timetable and paper targets.',
  null, -- all grades
  null,
  false,
  'manual'
);

-- 8. Seed Special Notes
insert into special_notes (student_id, body, is_read, source) values
(
  'a0000000-0000-0000-0000-000000000001',
  'Kavindu, excellent problem breakdown on Quadratic applications! Focus on theorem justifications in Geometry next week to secure the A grade.',
  false,
  'manual'
);
