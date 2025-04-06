'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

// Import MapComponent with no SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Initializing map...</p>
      </div>
    </div>
  ),
});

const HealthFacilitiesMap = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [facilities, setFacilities] = useState<Array<{
    name: string;
    lat: number;
    lng: number;
  }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);

        // Fetch nearby healthcare facilities using Google Places API
        const response = await axios.get('/api/nearby-facilities', {
          params: {
            lat: latitude,
            lng: longitude,
            type: 'healthcare'
          }
        });

        if (response.data && response.data.results) {
          const mappedFacilities = response.data.results.map((facility: any) => ({
            name: facility.name,
            lat: facility.geometry.location.lat,
            lng: facility.geometry.location.lng,
          }));
          setFacilities(mappedFacilities);
        } else {
          throw new Error('No facilities found in the response');
        }
      } catch (err) {
        console.error('Error:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load map data. Please try again later.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, []);

  if (error) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !position) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Find Healthcare Near You</h2>
        <p className="text-gray-600">Discover healthcare facilities in your area</p>
      </div>
      <div className="rounded-lg overflow-hidden shadow-lg">
        <MapComponent position={position} facilities={facilities} />
      </div>
    </div>
  );
};

export default HealthFacilitiesMap; 