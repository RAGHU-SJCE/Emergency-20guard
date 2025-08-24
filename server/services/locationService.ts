export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface Address {
  streetNumber?: string;
  streetName?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  formattedAddress?: string;
}

export interface EmergencyServiceLocation {
  name: string;
  type: 'hospital' | 'fire_station' | 'police_station' | 'urgent_care';
  coordinates: LocationCoordinates;
  address: Address;
  phone?: string;
  distance?: number; // in meters
}

export class LocationService {
  private googleMapsApiKey?: string;

  constructor() {
    this.googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  }

  /**
   * Reverse geocode coordinates to get address
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    try {
      if (!this.googleMapsApiKey) {
        console.warn('Google Maps API key not configured, using fallback geocoding');
        return this.fallbackReverseGeocode(latitude, longitude);
      }

      // In a real implementation, this would call Google Maps Geocoding API:
      /*
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.googleMapsApiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      */

      // Demo implementation with simulated results
      await this.simulateNetworkDelay(500, 1500);
      
      return this.generateMockAddress(latitude, longitude);
      
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return this.fallbackReverseGeocode(latitude, longitude);
    }
  }

  /**
   * Forward geocode address to get coordinates
   */
  async geocodeAddress(address: string): Promise<LocationCoordinates | null> {
    try {
      if (!this.googleMapsApiKey) {
        console.warn('Google Maps API key not configured');
        return null;
      }

      // In a real implementation:
      /*
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.googleMapsApiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng
        };
      }
      */

      // Demo implementation
      await this.simulateNetworkDelay(300, 1000);
      return null; // Fallback to null for demo
      
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  /**
   * Find nearby emergency services
   */
  async findNearbyEmergencyServices(
    coordinates: LocationCoordinates,
    serviceType?: 'hospital' | 'fire_station' | 'police_station' | 'urgent_care',
    radiusMeters = 5000
  ): Promise<EmergencyServiceLocation[]> {
    try {
      if (!this.googleMapsApiKey) {
        console.warn('Google Maps API key not configured, using mock data');
        return this.getMockEmergencyServices(coordinates, serviceType);
      }

      // In a real implementation, this would use Google Places API:
      /*
      const types = serviceType ? [this.mapServiceTypeToGoogleType(serviceType)] : 
                    ['hospital', 'fire_station', 'police'];
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${coordinates.latitude},${coordinates.longitude}&` +
        `radius=${radiusMeters}&` +
        `type=${types.join('|')}&` +
        `key=${this.googleMapsApiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK') {
        return data.results.map(place => this.mapGooglePlaceToEmergencyService(place));
      }
      */

      // Demo implementation
      await this.simulateNetworkDelay(800, 2000);
      return this.getMockEmergencyServices(coordinates, serviceType);
      
    } catch (error) {
      console.error('Emergency services search error:', error);
      return this.getMockEmergencyServices(coordinates, serviceType);
    }
  }

  /**
   * Calculate distance between two coordinates in meters
   */
  calculateDistance(coord1: LocationCoordinates, coord2: LocationCoordinates): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = coord1.latitude * Math.PI / 180;
    const φ2 = coord2.latitude * Math.PI / 180;
    const Δφ = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const Δλ = (coord2.longitude - coord1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  /**
   * Validate coordinates
   */
  validateCoordinates(coordinates: LocationCoordinates): boolean {
    const { latitude, longitude } = coordinates;
    
    return (
      typeof latitude === 'number' &&
      typeof longitude === 'number' &&
      latitude >= -90 && latitude <= 90 &&
      longitude >= -180 && longitude <= 180 &&
      !isNaN(latitude) && !isNaN(longitude)
    );
  }

  /**
   * Format coordinates for display
   */
  formatCoordinates(coordinates: LocationCoordinates, precision = 6): string {
    return `${coordinates.latitude.toFixed(precision)}, ${coordinates.longitude.toFixed(precision)}`;
  }

  /**
   * Get Google Maps URL for coordinates
   */
  getGoogleMapsUrl(coordinates: LocationCoordinates, zoom = 15): string {
    return `https://maps.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}&zoom=${zoom}`;
  }

  /**
   * Get emergency zone based on coordinates
   */
  getEmergencyZone(coordinates: LocationCoordinates): {
    zone: string;
    emergencyNumber: string;
    jurisdiction: string;
  } {
    // In a real implementation, this would query a database or API
    // to determine the appropriate emergency services jurisdiction
    
    // Demo implementation for US coordinates
    if (this.isInUSA(coordinates)) {
      return {
        zone: 'United States',
        emergencyNumber: '911',
        jurisdiction: 'Local Emergency Services'
      };
    }
    
    // Default fallback
    return {
      zone: 'International',
      emergencyNumber: '112',
      jurisdiction: 'International Emergency Services'
    };
  }

  /**
   * Check if coordinates are within USA (rough approximation)
   */
  private isInUSA(coordinates: LocationCoordinates): boolean {
    const { latitude, longitude } = coordinates;
    
    // Rough bounding box for continental USA + Alaska + Hawaii
    return (
      (latitude >= 24.396308 && latitude <= 49.384358 && // Continental US
       longitude >= -125.0 && longitude <= -66.93457) ||
      (latitude >= 18.91619 && latitude <= 28.402123 && // Hawaii
       longitude >= -178.334698 && longitude <= -154.806773) ||
      (latitude >= 51.209464 && latitude <= 71.406235 && // Alaska
       longitude >= -179.148909 && longitude <= -129.979506)
    );
  }

  /**
   * Fallback reverse geocoding using approximate city data
   */
  private fallbackReverseGeocode(latitude: number, longitude: number): string {
    // Very basic city/region detection for demo purposes
    const cities = [
      { name: 'New York, NY', lat: 40.7128, lng: -74.0060, radius: 0.5 },
      { name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437, radius: 0.5 },
      { name: 'Chicago, IL', lat: 41.8781, lng: -87.6298, radius: 0.5 },
      { name: 'Houston, TX', lat: 29.7604, lng: -95.3698, radius: 0.5 },
      { name: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740, radius: 0.5 }
    ];

    for (const city of cities) {
      const distance = this.calculateDistance(
        { latitude, longitude },
        { latitude: city.lat, longitude: city.lng }
      );
      
      if (distance < city.radius * 1000) { // Convert to meters
        return `Near ${city.name}`;
      }
    }

    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }

  /**
   * Generate mock address for demo purposes
   */
  private generateMockAddress(latitude: number, longitude: number): string {
    const streetNumbers = [100, 123, 456, 789, 1000, 1234];
    const streetNames = ['Main St', 'Oak Ave', 'First St', 'Broadway', 'Park Ave', 'Elm St'];
    const cities = ['Springfield', 'Riverside', 'Franklin', 'Georgetown', 'Clinton'];
    const states = ['NY', 'CA', 'TX', 'FL', 'IL', 'PA'];

    const streetNumber = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const state = states[Math.floor(Math.random() * states.length)];
    const zipCode = Math.floor(10000 + Math.random() * 90000);

    return `${streetNumber} ${streetName}, ${city}, ${state} ${zipCode}`;
  }

  /**
   * Get mock emergency services for demo
   */
  private getMockEmergencyServices(
    coordinates: LocationCoordinates,
    serviceType?: string
  ): EmergencyServiceLocation[] {
    const services: EmergencyServiceLocation[] = [
      {
        name: 'General Hospital',
        type: 'hospital',
        coordinates: { 
          latitude: coordinates.latitude + 0.01, 
          longitude: coordinates.longitude + 0.01 
        },
        address: { formattedAddress: '123 Medical Center Dr' },
        phone: '(555) 123-4567'
      },
      {
        name: 'Fire Station 12',
        type: 'fire_station',
        coordinates: { 
          latitude: coordinates.latitude - 0.008, 
          longitude: coordinates.longitude + 0.005 
        },
        address: { formattedAddress: '456 Fire House Rd' },
        phone: '(555) 234-5678'
      },
      {
        name: 'Police Precinct 3',
        type: 'police_station',
        coordinates: { 
          latitude: coordinates.latitude + 0.005, 
          longitude: coordinates.longitude - 0.01 
        },
        address: { formattedAddress: '789 Justice Blvd' },
        phone: '(555) 345-6789'
      }
    ];

    // Filter by service type if specified
    const filtered = serviceType ? 
      services.filter(s => s.type === serviceType) : 
      services;

    // Calculate distances
    return filtered.map(service => ({
      ...service,
      distance: this.calculateDistance(coordinates, service.coordinates)
    })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  /**
   * Simulate network delay for demo purposes
   */
  private async simulateNetworkDelay(minMs: number, maxMs: number): Promise<void> {
    const delay = minMs + Math.random() * (maxMs - minMs);
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

export default LocationService;
