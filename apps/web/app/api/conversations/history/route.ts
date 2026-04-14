import { NextRequest, NextResponse } from "next/server";
import { getConversation, clearConversation } from "@/lib/conversations/store";

// GET — retrieve conversation history for a role
export async function GET(request: NextRequest) {
  const facilityId = request.nextUrl.searchParams.get("facility_id") ?? "FAC-001";
  const userRole = request.nextUrl.searchParams.get("user_role") ?? "don";

  const conv = getConversation(facilityId, userRole);
  if (!conv) {
    return NextResponse.json({ conversation: null, messages: [] });
  }

  return NextResponse.json({
    conversation: {
      id: conv.id,
      facility_id: conv.facility_id,
      user_role: conv.user_role,
      title: conv.title,
      message_count: conv.message_count,
      last_message_at: conv.last_message_at,
      created_at: conv.created_at,
    },
    messages: conv.messages,
  });
}

// DELETE — clear conversation for a role (start fresh)
export async function DELETE(request: NextRequest) {
  const facilityId = request.nextUrl.searchParams.get("facility_id") ?? "FAC-001";
  const userRole = request.nextUrl.searchParams.get("user_role") ?? "don";

  clearConversation(facilityId, userRole);
  return NextResponse.json({ cleared: true });
}
