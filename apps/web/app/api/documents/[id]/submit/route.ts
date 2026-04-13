import { NextRequest, NextResponse } from "next/server";

// TODO (Ivan): Replace with real DB write — insert into document_submissions table
// TODO (Ivan): Add auth middleware to verify user session and provider_id
// TODO (Ivan): Trigger Chronicler filing workflow after successful submission

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  console.log(`[documents/submit] Document ${id} submitted`, {
    sections: Object.keys(body.sections || {}),
    submit_destination: body.submit_destination,
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    document_id: id,
    submitted_at: new Date().toISOString(),
    message: "Document submitted successfully. The Chronicler has filed a copy.",
  });
}
