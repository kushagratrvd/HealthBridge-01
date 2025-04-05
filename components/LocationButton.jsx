export default function LocationButton({ onLocation }) {
    return (
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              onLocation(pos.coords.latitude, pos.coords.longitude);
            },
            (err) => alert("Unable to get location")
          );
        }}
      >
        📍 Use My Location
      </button>
    );
  }
  