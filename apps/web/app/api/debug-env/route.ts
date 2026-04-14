import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.ANTHROPIC_API_KEY;
  return NextResponse.json({
    has_key: !!key,
    key_length: key?.length ?? 0,
    key_prefix: key?.substring(0, 10) ?? 'not set',
    is_placeholder: key === 'sk-ant-your-key-here',
  });
}
