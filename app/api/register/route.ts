import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    // Check for existing registration with same email or phone
    const existing = await Registration.findOne({
      $or: [
        { email: body.email },
        { phone: body.phone }
      ]
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'You have already registered with this email or phone number.' },
        { status: 409 }
      );
    }

    const registration = await Registration.create({
      title: body.title,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      kingschat: body.kingschat,
      zone: body.zone,
      group: body.group,
      church: body.church,
      attendanceType: body.attendanceType,
    });

    return NextResponse.json(
      { success: true, data: registration },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const registrations = await Registration.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, count: registrations.length, data: registrations },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Fetch error:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
