import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const type = searchParams.get('type');

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Google Places API nearby search endpoint
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.append('location', `${lat},${lng}`);
    url.searchParams.append('radius', '10000'); // 10km radius
    url.searchParams.append('type', 'hospital|doctor|health'); // Healthcare-related places
    url.searchParams.append('key', process.env.GOOGLE_MAPS_API_KEY!);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_message || 'Failed to fetch nearby facilities');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching nearby facilities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nearby facilities' },
      { status: 500 }
    );
  }
} 