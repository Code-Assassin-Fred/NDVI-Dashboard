import { NextResponse } from 'next/server';
import { getProcessUrl } from '@/lib/sentinel-hub';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { polygon, dateFrom, dateTo, dataSource, layerType } = body;

        if (!polygon) {
            return NextResponse.json({ error: 'Polygon is required' }, { status: 400 });
        }

        const imageUrl = await getProcessUrl(
            polygon,
            dateFrom,
            dateTo,
            dataSource || 'optical',
            layerType || 'trueColor'
        );

        return NextResponse.json({ url: imageUrl });
    } catch (error: any) {
        console.error('Image API Route Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
