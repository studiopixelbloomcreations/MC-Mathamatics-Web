-- =============================================================================
-- MC MATHEMATICS SEED DATA (12 Fake Students across Grades 9, 10, 11)
-- All student accounts configured with default PIN: 123456
-- =============================================================================

-- Ensure pgcrypto extension exists for bcrypt passwords
create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. Create auth.users entries for 12 Demo Students (PIN: 123456)
-- -----------------------------------------------------------------------------
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data
) values
-- GRADE 9
(
  'a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'mcg09tp1001@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')), now(), now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG09TP1001", "full_name": "Nethmi Wickramasinghe"}'
),
(
  'a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'mcg09tp1002@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')), now(), now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG09TP1002", "full_name": "Tharindu Jayasundara"}'
),
(
  'a0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'mcg09t1001@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')), now(), now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG09T1001", "full_name": "Dinuka Bandara"}'
),
(
  'a0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'mcg09t1002@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')), now(), now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG09T1002", "full_name": "Rashmi Alwis"}'
),
-- GRADE 10
(
  'a0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'mcg10tp1001@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')), now(), now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG10TP1001", "full_name": "Kavindu Perera"}'
),
(
  'a0000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'mcg10t1002@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')), now(), now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG10T1002", "full_name": "Senuri Jayasinghe"}'
),
(
  'a0000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'mcg10tp1003@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')), now(), now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG10TP1003", "full_name": "Akila Dissanayake"}'
),
(
  'a0000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'mcg10tp1004@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')), now(), now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG10TP1004", "full_name": "Oshadhi Senaratne"}'
),
-- GRADE 11
(
  'a0000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'mcg11tp1001@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')), now(), now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG11TP1001", "full_name": "Dulitha Bandara"}'
),
(
  'a0000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'mcg11tp1002@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')), now(), now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG11TP1002", "full_name": "Hiruni Ranasinghe"}'
),
(
  'a0000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'mcg11t1001@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')), now(), now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG11T1001", "full_name": "Pathum Fernando"}'
),
(
  'a0000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'mcg11tp1003@students.mcmaths.lk',
  crypt('123456', gen_salt('bf')), now(), now(), now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"student_id": "MCG11TP1003", "full_name": "Sandunika Rajapaksha"}'
)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- 2. Seed 12 Students Profile Records
-- -----------------------------------------------------------------------------
insert into students (
  id, unique_id, full_name, grade, age, whereabouts, class_type,
  student_phone, parent_whatsapp, parent_phone, report_opt_in, report_language,
  parent_last_inbound_at, parent_wa_verified
) values
-- Grade 9
(
  'a0000000-0000-0000-0000-000000000001', 'MCG09TP1001', 'Nethmi Wickramasinghe',
  9, 14, 'Wariyapola', 'TP',
  '+94774445566', '+94776665544', '+94776665544', true, 'en',
  now() - interval '2 days', true
),
(
  'a0000000-0000-0000-0000-000000000002', 'MCG09TP1002', 'Tharindu Jayasundara',
  9, 14, 'Mawathagama', 'TP',
  '+94774445567', '+94776665545', '+94776665545', true, 'en',
  now() - interval '4 hours', true
),
(
  'a0000000-0000-0000-0000-000000000003', 'MCG09T1001', 'Dinuka Bandara',
  9, 14, 'Kurunegala Town', 'T',
  '+94774445568', '+94776665546', '+94776665546', true, 'si',
  null, false
),
(
  'a0000000-0000-0000-0000-000000000004', 'MCG09T1002', 'Rashmi Alwis',
  9, 14, 'Polgahawela', 'T',
  '+94774445569', '+94776665547', '+94776665547', true, 'en',
  now() - interval '1 day', true
),

-- Grade 10
(
  'a0000000-0000-0000-0000-000000000005', 'MCG10TP1001', 'Kavindu Perera',
  10, 15, 'Kurunegala Town', 'TP',
  '+94771112233', '+94779998877', '+94779998877', true, 'en',
  now() - interval '2 hours', true
),
(
  'a0000000-0000-0000-0000-000000000006', 'MCG10T1002', 'Senuri Jayasinghe',
  10, 15, 'Mawathagama', 'T',
  '+94772223344', '+94778887766', '+94778887766', true, 'si',
  null, false
),
(
  'a0000000-0000-0000-0000-000000000007', 'MCG10TP1003', 'Akila Dissanayake',
  10, 15, 'Ibbagamuwa', 'TP',
  '+94772223345', '+94778887767', '+94778887767', true, 'en',
  now() - interval '6 hours', true
),
(
  'a0000000-0000-0000-0000-000000000008', 'MCG10TP1004', 'Oshadhi Senaratne',
  10, 15, 'Galgamuwa', 'TP',
  '+94772223346', '+94778887768', '+94778887768', true, 'en',
  now() - interval '18 hours', true
),

-- Grade 11
(
  'a0000000-0000-0000-0000-000000000009', 'MCG11TP1001', 'Dulitha Bandara',
  11, 16, 'Kuliyapitiya', 'TP',
  '+94773334455', '+94777776655', '+94777776655', true, 'en',
  now() - interval '10 hours', true
),
(
  'a0000000-0000-0000-0000-000000000010', 'MCG11TP1002', 'Hiruni Ranasinghe',
  11, 16, 'Kurunegala Town', 'TP',
  '+94773334456', '+94777776656', '+94777776656', true, 'en',
  now() - interval '1 day', true
),
(
  'a0000000-0000-0000-0000-000000000011', 'MCG11T1001', 'Pathum Fernando',
  11, 16, 'Narammala', 'T',
  '+94773334457', '+94777776657', '+94777776657', true, 'si',
  null, false
),
(
  'a0000000-0000-0000-0000-000000000012', 'MCG11TP1003', 'Sandunika Rajapaksha',
  11, 16, 'Pannala', 'TP',
  '+94773334458', '+94777776658', '+94777776658', true, 'en',
  now() - interval '5 hours', true
)
on conflict (id) do update set
  unique_id = excluded.unique_id,
  full_name = excluded.full_name,
  grade = excluded.grade,
  class_type = excluded.class_type,
  parent_whatsapp = excluded.parent_whatsapp;

-- -----------------------------------------------------------------------------
-- 3. Parental Settings for all 12 Students
-- -----------------------------------------------------------------------------
insert into parental_settings (student_id, locked, report_frequency) values
('a0000000-0000-0000-0000-000000000001', false, 'every_paper'),
('a0000000-0000-0000-0000-000000000002', false, 'every_paper'),
('a0000000-0000-0000-0000-000000000003', false, 'weekly'),
('a0000000-0000-0000-0000-000000000004', false, 'weekly'),
('a0000000-0000-0000-0000-000000000005', false, 'every_paper'),
('a0000000-0000-0000-0000-000000000006', false, 'weekly'),
('a0000000-0000-0000-0000-000000000007', false, 'every_paper'),
('a0000000-0000-0000-0000-000000000008', false, 'every_paper'),
('a0000000-0000-0000-0000-000000000009', false, 'every_paper'),
('a0000000-0000-0000-0000-000000000010', false, 'every_paper'),
('a0000000-0000-0000-0000-000000000011', false, 'weekly'),
('a0000000-0000-0000-0000-000000000012', false, 'every_paper')
on conflict (student_id) do nothing;

-- -----------------------------------------------------------------------------
-- 4. Seed ID Counters
-- -----------------------------------------------------------------------------
insert into id_counters (prefix, last_value) values
('MCG09TP', 1002),
('MCG09T', 1002),
('MCG10TP', 1004),
('MCG10T', 1002),
('MCG11TP', 1003),
('MCG11T', 1001)
on conflict (prefix) do update set last_value = excluded.last_value;

-- -----------------------------------------------------------------------------
-- 5. Seed Papers (Grades 9, 10, 11)
-- -----------------------------------------------------------------------------
insert into papers (id, title, grade, class_type, status, paper_date, due_at, total_marks, sections) values
-- Grade 9
(
  'b0000000-0000-0000-0000-000000000001',
  'Grade 9 Term Evaluation - Equations & Pythagoras',
  9, null, 'finished',
  current_date - interval '14 days', current_date - interval '10 days', 100,
  '[
    {"name": "Section A - Basic Arithmetic & Factors", "max": 40},
    {"name": "Section B - Linear Equations & Triangles", "max": 60}
  ]'::jsonb
),
(
  'b0000000-0000-0000-0000-000000000002',
  'Grade 9 Model Sitting 02 - Geometry & Angles',
  9, 'TP', 'ongoing',
  current_date - interval '2 days', current_date + interval '5 days', 100,
  '[
    {"name": "Section A - Geometric Proofs", "max": 50},
    {"name": "Section B - Polygon Calculations", "max": 50}
  ]'::jsonb
),
-- Grade 10
(
  'b0000000-0000-0000-0000-000000000003',
  'Paper 01 - Algebraic Expressions & Geometry',
  10, null, 'finished',
  current_date - interval '20 days', current_date - interval '16 days', 100,
  '[
    {"name": "Part A - Multiple Choice", "max": 30},
    {"name": "Part B - Structured Algebra", "max": 40},
    {"name": "Part C - Geometry & Theorems", "max": 30}
  ]'::jsonb
),
(
  'b0000000-0000-0000-0000-000000000004',
  'Paper 02 - Quadratic Equations & Graphing',
  10, 'TP', 'finished',
  current_date - interval '7 days', current_date - interval '4 days', 100,
  '[
    {"name": "Section 1 - Factorization & Roots", "max": 40},
    {"name": "Section 2 - Turning Points & Parabolas", "max": 60}
  ]'::jsonb
),
(
  'b0000000-0000-0000-0000-000000000005',
  'Paper 03 - Logarithms & Volume Calculations',
  10, null, 'ongoing',
  current_date - interval '1 day', current_date + interval '6 days', 100,
  '[
    {"name": "Section A - Log Laws & Indices", "max": 50},
    {"name": "Section B - Solid Mensuration", "max": 50}
  ]'::jsonb
),
-- Grade 11
(
  'b0000000-0000-0000-0000-000000000006',
  'O/L Speed Drill Paper 01 - Full Core Syllabus',
  11, null, 'finished',
  current_date - interval '12 days', current_date - interval '8 days', 100,
  '[
    {"name": "Part I - 25 Short Questions", "max": 50},
    {"name": "Part II - Structured Essay & Trigonometry", "max": 50}
  ]'::jsonb
),
(
  'b0000000-0000-0000-0000-000000000007',
  'O/L Target Paper 02 - Circle Theorems & Probability',
  11, 'TP', 'ongoing',
  current_date - interval '2 days', current_date + interval '4 days', 100,
  '[
    {"name": "Section A - Circle Theorems Proofs", "max": 50},
    {"name": "Section B - Tree Diagrams & Probability", "max": 50}
  ]'::jsonb
)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- 6. Seed Marks for All Students
-- -----------------------------------------------------------------------------
insert into marks (student_id, paper_id, marks, section_marks, source) values
-- Grade 9 on Paper 1
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 82.5, '{"Section A - Basic Arithmetic & Factors": 35.0, "Section B - Linear Equations & Triangles": 47.5}'::jsonb, 'manual'),
('a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 93.0, '{"Section A - Basic Arithmetic & Factors": 39.0, "Section B - Linear Equations & Triangles": 54.0}'::jsonb, 'manual'),
('a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 68.0, '{"Section A - Basic Arithmetic & Factors": 28.0, "Section B - Linear Equations & Triangles": 40.0}'::jsonb, 'manual'),
('a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 77.5, '{"Section A - Basic Arithmetic & Factors": 32.0, "Section B - Linear Equations & Triangles": 45.5}'::jsonb, 'manual'),

-- Grade 10 on Paper 01
('a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000003', 88.5, '{"Part A - Multiple Choice": 28, "Part B - Structured Algebra": 36.5, "Part C - Geometry & Theorems": 24}'::jsonb, 'manual'),
('a0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000003', 74.0, '{"Part A - Multiple Choice": 25, "Part B - Structured Algebra": 31, "Part C - Geometry & Theorems": 18}'::jsonb, 'manual'),
('a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000003', 96.0, '{"Part A - Multiple Choice": 30, "Part B - Structured Algebra": 39, "Part C - Geometry & Theorems": 27}'::jsonb, 'manual'),
('a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000003', 64.5, '{"Part A - Multiple Choice": 20, "Part B - Structured Algebra": 28.5, "Part C - Geometry & Theorems": 16}'::jsonb, 'manual'),

-- Grade 10 on Paper 02 (TP students only)
('a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 91.0, '{"Section 1 - Factorization & Roots": 37.0, "Section 2 - Turning Points & Parabolas": 54.0}'::jsonb, 'manual'),
('a0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000004', 98.0, '{"Section 1 - Factorization & Roots": 39.5, "Section 2 - Turning Points & Parabolas": 58.5}'::jsonb, 'manual'),
('a0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000004', 73.0, '{"Section 1 - Factorization & Roots": 29.0, "Section 2 - Turning Points & Parabolas": 44.0}'::jsonb, 'manual'),

-- Grade 11 on Paper 01
('a0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000006', 92.0, '{"Part I - 25 Short Questions": 48.0, "Part II - Structured Essay & Trigonometry": 44.0}'::jsonb, 'manual'),
('a0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000006', 87.5, '{"Part I - 25 Short Questions": 45.0, "Part II - Structured Essay & Trigonometry": 42.5}'::jsonb, 'manual'),
('a0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000006', 64.0, '{"Part I - 25 Short Questions": 34.0, "Part II - Structured Essay & Trigonometry": 30.0}'::jsonb, 'manual'),
('a0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000006', 83.5, '{"Part I - 25 Short Questions": 42.0, "Part II - Structured Essay & Trigonometry": 41.5}'::jsonb, 'manual')
on conflict (student_id, paper_id) do update set
  marks = excluded.marks,
  section_marks = excluded.section_marks;

-- -----------------------------------------------------------------------------
-- 7. Seed Attendance Records
-- -----------------------------------------------------------------------------
insert into attendance (student_id, date, session, status, source) values
('a0000000-0000-0000-0000-000000000001', current_date - interval '14 days', 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000001', current_date - interval '7 days', 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000001', current_date, 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000002', current_date - interval '7 days', 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000002', current_date, 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000005', current_date - interval '14 days', 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000005', current_date - interval '7 days', 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000005', current_date, 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000007', current_date - interval '7 days', 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000007', current_date, 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000009', current_date - interval '7 days', 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000009', current_date, 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000010', current_date, 'main', 'present', 'manual'),
('a0000000-0000-0000-0000-000000000012', current_date, 'main', 'present', 'manual')
on conflict (student_id, date, session) do nothing;

-- -----------------------------------------------------------------------------
-- 8. Seed Announcements
-- -----------------------------------------------------------------------------
insert into announcements (title, body, target_grade, target_student, pinned, source) values
(
  'Special Term Revision Seminar',
  'Dear students and parents, the Grade 10 intensive revision session will be conducted this Saturday from 8:30 AM to 1:30 PM at the Main Hall.',
  10, null, true, 'manual'
),
(
  'O/L Past Paper Speed Drill Series',
  'Grade 11 students must submit Paper 01 before Friday 6:00 PM. Discussion session will be held via the live portal.',
  11, null, false, 'manual'
),
(
  'Welcome to MC Mathematics 2026',
  'Welcome to the new academic term. Login credentials have been activated for all registered students. Check your timetable and paper targets.',
  null, null, false, 'manual'
);

-- -----------------------------------------------------------------------------
-- 9. Seed Special Notes
-- -----------------------------------------------------------------------------
insert into special_notes (student_id, body, is_read, source) values
(
  'a0000000-0000-0000-0000-000000000005',
  'Kavindu, excellent problem breakdown on Quadratic applications! Focus on theorem justifications in Geometry next week to secure the A distinction.',
  false, 'manual'
),
(
  'a0000000-0000-0000-0000-000000000007',
  'Akila, you scored top of the Kurunegala batch on Paper 02 (98%). Keep up this momentum heading into national exams.',
  false, 'manual'
),
(
  'a0000000-0000-0000-0000-000000000009',
  'Dulitha, your speed drill performance has jumped +14% over the last 3 weeks. Great work on Part I short questions.',
  false, 'manual'
);
