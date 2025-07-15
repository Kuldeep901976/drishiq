import { AdminService } from '@/lib/admin-service';
import { logger } from '@/lib/logger';
import { rateLimiter } from '@/lib/rate-limiter';
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimiter.checkRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check admin access
    const adminCheck = await AdminService.checkAdminAccess(session.user.id);
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get admin statistics
    const stats = await AdminService.getAdminStats();

    logger.info('Admin stats retrieved', { adminId: session.user.id });

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    logger.error('Failed to get admin stats');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 