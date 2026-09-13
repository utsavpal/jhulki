import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import { corsHeaders, handleCors } from '@/lib/cors';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return handleCors();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, phone, fullName, street, city, state, postalCode, country } = body;

    if (!email || !fullName || !phone) {
      return NextResponse.json({ error: 'Email, Full Name, and Phone are required' }, { status: 400, headers: corsHeaders() });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists or create new guest user account
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user) {
      // Auto-generate password hash using phone or default random string
      const defaultPassword = phone || 'JhulkiGuest@123';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          fullName: fullName.trim(),
          passwordHash,
          role: 'CUSTOMER'
        }
      });
    }

    // Save/create address for user
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        title: 'Shipping Address',
        fullName: fullName.trim(),
        street: street || 'Main Street',
        city: city || 'Mumbai',
        state: state || 'Maharashtra',
        postalCode: postalCode || '400001',
        country: country || 'India',
        phone: phone,
        isDefault: true
      }
    });

    // Generate token so guest becomes signed in user automatically
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl
      },
      token,
      address
    }, { status: 200, headers: corsHeaders() });

  } catch (error: any) {
    console.error('Guest Checkout User Route Error:', error);
    return NextResponse.json({ error: error?.message || 'Guest account creation failed' }, { status: 500, headers: corsHeaders() });
  }
}
