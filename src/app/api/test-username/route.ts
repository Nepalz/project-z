import { NextResponse } from 'next/server';
import { generateRevolutionaryUsername } from '../../../lib/username-generator';

export async function GET() {
  try {
    // Generate 5 sample usernames to show how they look
    const sampleUsernames = [];
    for (let i = 0; i < 5; i++) {
      sampleUsernames.push(generateRevolutionaryUsername());
    }
    
    return NextResponse.json({
      message: 'Sample revolutionary usernames based on Nepalese freedom fighters:',
      usernames: sampleUsernames
    });
  } catch {
    return NextResponse.json({ error: 'Failed to generate usernames' }, { status: 500 });
  }
}
