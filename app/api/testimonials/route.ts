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

    // Get query parameters
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    // Build query for testimonials
    let query = supabase
      .from('Invitations')
      .select('id, name, email, language, testimonial_rating, testimonial_content, testimonial_category, is_featured_testimonial, featured_position, created_at')
      .eq('invitation_type', 'testimonials')
      .eq('status', 'approved')
      .not('testimonial_content', 'is', null)
      .order('is_featured_testimonial', { ascending: false })
      .order('featured_position', { ascending: true })
      .order('created_at', { ascending: false });

    // Apply category filter if specified
    if (category && category !== 'all') {
      query = query.eq('testimonial_category', category);
    }

    // Apply limit
    query = query.limit(limit);

    const { data: testimonials, error } = await query;

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      testimonials: testimonials || []
    });

  } catch (error) {
    console.error('Failed to get testimonials', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 