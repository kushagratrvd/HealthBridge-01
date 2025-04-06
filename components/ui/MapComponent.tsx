'use client';

import { useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';

interface MapComponentProps {
  position: [number, number];
  facilities: Array<{
    name: string;
    lat: number;
    lng: number;
  }>;
}

const MapComponent = ({ position, facilities }: MapComponentProps) => {
  const [selectedFacility, setSelectedFacility] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
  };

  const center = {
    lat: position[0],
    lng: position[1],
  };

  const options = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  };

  if (loadError) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
        <div className="text-center text-red-600">
          <p className="mb-2">Error loading map. Please check:</p>
          <ul className="list-disc list-inside text-left">
            <li>Your Google Maps API key is valid</li>
            <li>Required APIs are enabled in Google Cloud Console</li>
            <li>Your domain is allowed in API key restrictions</li>
          </ul>
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

  if (!isLoaded) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={14}
      options={options}
    >
      {/* User's location marker */}
      <Marker
        position={center}
        icon={{
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new google.maps.Size(40, 40),
        }}
      />

      {/* Healthcare facilities markers */}
      {facilities.map((facility, index) => (
        <Marker
          key={index}
          position={{ lat: facility.lat, lng: facility.lng }}
          onClick={() => setSelectedFacility(facility)}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(40, 40),
          }}
        />
      ))}

      {/* Info window for selected facility */}
      {selectedFacility && (
        <InfoWindow
          position={{ lat: selectedFacility.lat, lng: selectedFacility.lng }}
          onCloseClick={() => setSelectedFacility(null)}
        >
          <div className="p-2">
            <h3 className="font-semibold">{selectedFacility.name}</h3>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapComponent; 