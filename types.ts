// FIX: Import React to provide types like ReactNode.
import React from 'react';

export type MissionStatus = 'Completed' | 'Interrupted' | 'In Progress';

export interface BreedingSiteInfo {
    type: 'Enclosed' | 'Open';
    object: string; // e.g., 'Tires', 'Sewage', 'Pots'
}

export interface Mission {
  id: string;
  name: string;
  date: string;
  duration: string;
  status: MissionStatus;
  location: string;
  gpsTrack?: { lat: number; lon: number }[];
  detectedSites?: BreedingSiteInfo[];
}

export interface OverviewStat {
  id:string;
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
}

export interface LiveTelemetry {
    gps: {
        lat: number;
        lon: number;
    };
    altitude: number;
    speed: number;
    roll: number;
    pitch: number;
    heading: number;
    signalStrength: number;
    battery: {
        voltage: number;
        percentage: number;
    };
    satellites: number;
    flightTime: string;
    distanceFromHome: number;
    flightMode: 'Loiter' | 'Manual' | 'RTL' | 'Take Off';
    armed: boolean;
    verticalSpeed: number;
    breedingSiteDetected: boolean;
    currentBreedingSite?: BreedingSiteInfo;
    detectedSites: BreedingSiteInfo[];
    gpsTrack: { lat: number; lon: number }[];
}

export interface MissionPlan {
  id?: string;
  name: string;
  waypoints: { lat: number; lon: number }[];
  altitude: number;
  speed: number;
}