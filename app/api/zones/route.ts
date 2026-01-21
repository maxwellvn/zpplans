import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://ippc.rorglobalpartnershipdepartment.org/zones.json');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching zones:', error);
    return NextResponse.json(
      { error: 'Failed to fetch zones data' },
      { status: 500 }
    );
  }
}
