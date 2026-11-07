"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface RealtimeListenerProps {
  studentId: string;
}

export function RealtimeListener({ studentId }: RealtimeListenerProps) {
  const router = useRouter();
  const { success, info } = useToast();

  useEffect(() => {
    let client: ReturnType<typeof createClient>;
    try {
      client = createClient();
    } catch {
      return;
    }

    // Subscribe to student-specific channel
    const channel = client
      .channel(`student_realtime_${studentId}`)
      // 1. Listen for new Marks
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "marks",
          filter: `student_id=eq.${studentId}`,
        },
        (payload: { new: { marks: number } }) => {
          success(
            `New Paper Mark Recorded: ${payload.new.marks} marks`,
            "Academic Update"
          );
          router.refresh();
        }
      )
      // 2. Listen for Special Notes
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "special_notes",
          filter: `student_id=eq.${studentId}`,
        },
        (payload: { new: { body?: string } }) => {
          info(
            `Sir: "${payload.new.body?.slice(0, 45)}..."`,
            "New Special Note from Sir"
          );
          router.refresh();
        }
      )
      // 3. Listen for Announcements
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "announcements",
        },
        (payload: { new: { title: string } }) => {
          info(payload.new.title, "New Class Announcement");
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [studentId, success, info, router]);

  return null;
}
