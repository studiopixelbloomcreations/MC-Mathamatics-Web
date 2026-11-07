# Admin Guide for Sir Malinga C Dissanayake

Welcome to your administrative control center! This platform gives you complete control over your mathematics academy from both your computer and your phone.

---

## 1. Accessing the Admin Portal

- **URL:** `https://admin.mcmaths.lk` (or `/admin` during development)
- **Login:** Enter your administrator email, password, and 6-digit TOTP authenticator code.

---

## 2. Using the Platform

### A. Uploading Papers (`/admin/papers`)
1. Select the Grade (6 to 13).
2. Choose class type (Theory + Paper, or Theory only).
3. Enter total marks (default 100).
4. Add topic section breakdowns (e.g. Algebra 25, Geometry 25).
5. Click **Publish Paper to Grade**.

### B. Entering Marks (`/admin/marks`)
- **Single Entry:** Choose Grade $\rightarrow$ Paper $\rightarrow$ Select Student $\rightarrow$ Enter Marks $\rightarrow$ Save.
- **Class Bulk Entry:** Pick Grade and Paper to reveal the whole class roster. Enter scores in the table and click **Save All Marks**. The student dashboard and diagnostic charts update instantly in realtime.

### C. Taking Attendance (`/admin/attendance`)
1. Pick the Grade and date.
2. Students default to **Present**.
3. Tap **Absent**, **Late**, or **Excused** for any student who did not attend.
4. Click **Save Attendance**.

### D. Announcements & Special Notes
- **Announcements (`/admin/announcements`):** Broadcast general announcements to all students or specific grades. Pin key exam dates to the top of the feed.
- **Special Notes (`/admin/notes`):** Send private diagnostic encouragement or advice directly to an individual student's dashboard feed.

---

## 3. Controlling AI Mode from WhatsApp

1. Turn on AI Mode in your Admin Portal (`/admin/ai-mode`).
2. Open WhatsApp on your phone and send a message to the MC Maths AI number:
   ```text
   MCG10TP1001 Paper 14 marks 85
   ```
3. The AI parses your message and sends a preview back:
   ```text
   Reply 1 to confirm / 2 to cancel
   ```
4. Reply `1`. The mark is saved, analysis is recomputed, and Kamal's parent receives the updated report!
