/**
 * useLocation Hook
 * Handles location permissions and fetching user's location
 */

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface UserLocation {
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export const useLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const requestLocationPermission = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Location permission denied');
        setHasPermission(false);
        setIsLoading(false);
        return false;
      }

      setHasPermission(true);
      await fetchLocation();
      return true;
    } catch (err) {
      console.error('Permission error:', err);
      setError('Failed to request location permission');
      setIsLoading(false);
      return false;
    }
  };

  const fetchLocation = async () => {
    try {
      setIsLoading(true);
      
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocode to get address
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        setLocation({
          city: address.city || undefined,
          state: address.region || undefined,
          country: address.country || undefined,
          latitude,
          longitude,
        });
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Fetch location error:', err);
      setError('Failed to fetch location');
      setIsLoading(false);
    }
  };

  const clearLocation = () => {
    setLocation(null);
    setError(null);
  };

  return {
    location,
    isLoading,
    error,
    hasPermission,
    requestLocationPermission,
    clearLocation,
  };
};

