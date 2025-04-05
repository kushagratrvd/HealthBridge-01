import axios from "axios";

export const getNearbyHospitals = async (lat, lng) => {
    const response = await axios.get("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
        params: {
          location: `${lat},${lng}`,
          radius: 5000,
          type: "hospital",
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      });
    if (response.status !== 200) {
        throw new Error("Failed to fetch nearby hospitals");
    }

  return response.data.results;
};
