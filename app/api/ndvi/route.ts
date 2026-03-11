import { NextResponse } from 'next/server';
import { fetchNDVIStats } from '@/lib/sentinel-hub';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { polygon, dateFrom, dateTo } = body;

    if (!polygon) {
      return NextResponse.json({ error: 'Polygon is required' }, { status: 400 });
    }

    const stats = await fetchNDVIStats(polygon, dateFrom, dateTo);
    
    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // Basic health check or default data
  return NextResponse.json({ status: 'Sentinel Hub API route active' });
}
