import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function GET(request: Request) {
  try {
    const password = request.headers.get('x-admin-password');
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const registrations = await Registration.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, count: registrations.length, data: registrations },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Fetch registrations error:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const password = request.headers.get('x-admin-password');
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    await Registration.deleteMany({});

    return NextResponse.json(
      { success: true, message: 'All registrations deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete all registrations error:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete registrations' },
      { status: 500 }
    );
  }
}
