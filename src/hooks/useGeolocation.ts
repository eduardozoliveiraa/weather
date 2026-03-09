import { useState, useEffect } from 'react';

interface GeolocationState {
  lat: number | null;
  lon: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationState>({
    lat: null,
    lon: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: 'Geolocalização não é suportada por este navegador.',
        loading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = 'Não foi possível obter a sua localização.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Permissão de localização negada.';
        }
        setLocation({
          lat: null,
          lon: null,
          error: errorMessage,
          loading: false,
        });
      }
    );
  }, []);

  return location;
};
