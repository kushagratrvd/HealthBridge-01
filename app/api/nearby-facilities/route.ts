import { NextResponse } from 'next/server';

interface PlacesResult {
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  vicinity?: string;
  rating?: number;
  types?: string[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Google Places API nearby search endpoint with server-side API key
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      radius: '5000',
      type: 'hospital',
      keyword: 'hospital|clinic|medical|healthcare|doctor',
      key: process.env.GOOGLE_MAPS_API_KEY
    });

    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    const data = await response.json();

    if (data.status === 'REQUEST_DENIED') {
      console.error('Places API Request Denied:', data.error_message);
      return NextResponse.json(
        { error: 'API request was denied. Please check API key configuration.' },
        { status: 403 }
      );
    }

    if (!response.ok) {
      console.error('Places API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      throw new Error(data.error_message || 'Failed to fetch nearby facilities');
    }

    if (!data.results || !Array.isArray(data.results)) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from Places API');
    }

    // Transform the response to include only necessary data
    const facilities = data.results.map((facility: PlacesResult) => ({
      name: facility.name,
      lat: facility.geometry.location.lat,
      lng: facility.geometry.location.lng,
      vicinity: facility.vicinity,
      rating: facility.rating
    }));

    return NextResponse.json({ results: facilities });
  } catch (error) {
    console.error('Error fetching nearby facilities:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch nearby facilities',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 