"use client";
import { useEffect, useState } from "react";

const useLocation = () => {
  const [location, setLocation] = useState<{ lat: number; long: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    // Check permission state before requesting location
    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (result.state === "granted" || result.state === "prompt") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocation({
                lat: position.coords.latitude,
                long: position.coords.longitude,
              });
              setLoading(false);
            },
            (err) => {
              setError(err.message);
              setLoading(false);
            }
          );
        } else if (result.state === "denied") {
          setError("Location access denied. Please enable it in browser settings.");
          setLoading(false);
        }
      })
      .catch((err) => {
        setError("Error checking location permissions: " + err.message);
        setLoading(false);
      });
  }, []);

  return { location, error, loading };
};

export default useLocation;
