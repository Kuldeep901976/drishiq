import { NextRequest, NextResponse } from 'next/server';
import { InvitationService } from '../../../../lib/invitation-service';
import { logger } from '../../../../lib/logger';
import { rateLimiter } from '../../../../lib/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimiter.checkRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const { name, email, language } = body;
    if (!name || !email || !language) {
      return NextResponse.json(
        { error: 'Name, email, and language are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create invitation
    const result = await InvitationService.createInvitation({
      name,
      email,
      phone: body.phone,
      language,
      location: body.location,
      invitationType: body.invitationType || 'regular',
      createdBy: body.createdBy,
      expiryDays: body.expiryDays,
      challenge: body.challenge // Pass the optional challenge field
    });

    if (!result.success) {
      logger.warn('Failed to create invitation', { email, error: result.error });
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    logger.info('Invitation created successfully', { email, token: result.token });

    return NextResponse.json({
      success: true,
      token: result.token
    });

  } catch (error) {
    logger.error('Error in invitation creation endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 