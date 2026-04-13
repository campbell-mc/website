"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { CHRISConversation } from "@/components/chris/CHRISConversation";

export default function CoachPage() {
  const router = useRouter();

  return (
    <div className="h-[calc(100vh-60px)] lg:h-screen flex flex-col">
      {/* Back button bar - sits above conversation */}
      <div className="flex items-center px-4 py-2 border-b border-border bg-card shrink-0">
        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-4 h-4" /> Home
        </button>
      </div>

      <CHRISConversation
        context_type="general"
        context_label="Ask CHRIS anything"
        facility_id="FAC-001"
        facility_name="The Holy Grail Bowral"
        current_user_role="don"
        mode="fullscreen"
      />
    </div>
  );
}
