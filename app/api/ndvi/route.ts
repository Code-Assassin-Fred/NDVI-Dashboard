import { NextResponse } from 'next/server';
import { fetchStats } from '@/lib/sentinel-hub';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { polygon, dateFrom, dateTo, dataSource } = body;

    if (!polygon) {
      return NextResponse.json({ error: 'Polygon is required' }, { status: 400 });
    }

    console.log('Fetching NDVI for polygon:', JSON.stringify(polygon).substring(0, 100) + '...');
    const stats = await fetchStats(polygon, dateFrom, dateTo, dataSource || 'optical');
    console.log('Successfully fetched stats, count:', stats.length);

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('NDVI API Route Error Details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    return NextResponse.json({
      error: error.message,
      details: error.response?.data || 'No additional details'
    }, { status: 500 });
  }
}

export async function GET() {
  // Basic health check or default data
  return NextResponse.json({ status: 'Sentinel Hub API route active' });
}
