import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const registration = await Registration.findByIdAndDelete(params.id);

    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Registration deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete registration error:', error);

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete registration' },
      { status: 500 }
    );
  }
}
