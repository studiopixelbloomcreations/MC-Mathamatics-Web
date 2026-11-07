# AI Mode & Natural Language WhatsApp Engine

## 1. Safety Architecture

```
Sir's WhatsApp Message
       │
       ▼
Meta WhatsApp Cloud API ──► /api/whatsapp/webhook (Meta verified HMAC)
                                 │
                                 ├── Verified sender == admin_whatsapp?
                                 ├── Deduplicate by wa_message_id in inbound_messages
                                 └── Fast HTTP 200 acknowledge (<3s)
                                       │
                                       ▼ (async / cron)
                                 /api/ai/process (internal secret guarded)
                                       │
                                 NVIDIA NIM Provider
                                       │ (outputs structured tool calls)
                                       ▼
                                 Zod Tool Validator (lib/ai/validator.ts)
                                       │ (strictly verifies student IDs exist)
                                       ▼
                         Confirmation Gate (Sir replies 1 to confirm)
                                       │
                                       ▼
                                 Server Executor (lib/ai/executor.ts)
                                       │
                                       ├── Writes to marks / notes / announcements
                                       ├── Snapshots undo_data in ai_actions
                                       └── Triggers deterministic Analysis Engine
```

## 2. Permitted AI Tools

The AI model has **zero access to raw SQL**. It may only invoke the following 7 verified server tools:
1. `record_marks(student_id, paper_ref, marks, section_marks?)`
2. `add_special_note(student_id, text)`
3. `post_announcement(text, target, pinned?)`
4. `mark_attendance(date, session, present_ids[], absent_ids[], late_ids[])`
5. `run_analysis(student_id)`
6. `send_parent_report(student_id)`
7. `ask_clarification(question)`

## 3. Message Examples Sir Can Send

- **Single Mark Entry:**
  ```text
  MCG10TP1001
  Paper 12 marks 78/100
  Note: Great improvement in algebra, needs to practice geometry proofs
  ```
- **Grade Bulletin Announcement:**
  ```text
  Announcement for Grade 11: Extra class this Saturday 8am at the main hall
  ```
- **Batch Mark Entry:**
  ```text
  Marks for Paper 14 (Grade 10 TP):
  MCG10TP1001 - 82
  MCG10TP1002 - 67
  MCG10TP1003 - 91
  ```
- **Attendance Roll Call:**
  ```text
  Attendance 2026-03-10: present MCG10TP1001, MCG10TP1003, absent MCG10TP1002
  ```

## 4. 24-Hour Undo Capability

Every executed AI action creates a snapshot in `ai_actions` with `undo_data`. Within 24 hours, Sir can click **"Undo Action"** in the Admin AI Mode cockpit to revert all mutations cleanly.
