"use client";
import { useState } from "react";
import MapWithHospitals from "./MapWithHospitals";
import { getNearbyHospitals } from "@/lib/placesApi";
import LocationButton from "@/components/LocationButton";

export default function HealthFacilitiesPage() {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  const handleLocation = async (lat, lng) => {
    setLocation({ lat, lng });
    const results = await getNearbyHospitals(lat, lng);
    setHospitals(results);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">🏥 Nearby Health Facilities</h1>
      <LocationButton onLocation={handleLocation} />
      {location && <MapWithHospitals center={location} hospitals={hospitals} />}
    </div>
  );
}
