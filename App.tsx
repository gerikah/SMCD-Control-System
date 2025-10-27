import React, { useState, useEffect } from 'react';

import Sidebar from './components/ControlPanel'; 
import DashboardHeader from './components/Header'; 
import LiveMissionView from './components/LiveMissionView';
import DashboardView from './components/DashboardView';
import AnalyticsPanel from './components/AnalyticsPanel';
import FlightLogsPanel from './components/FlightLogsPanel';
import SettingsPanel from './components/SettingsPanel';
import MissionSetupView from './components/MissionSetupView';

import { useDashboardData } from './hooks/useDroneSimulation'; 
import type { Mission, BreedingSiteInfo, MissionPlan, LiveTelemetry } from './types';

const initialMissions: Mission[] = [
  { id: 'm12', name: 'Mission 12', date: 'Oct 9, 2025', duration: '22 mins', status: 'Completed', location: '428 Sampaloc', gpsTrack: [{lat: 34.0522, lon: -118.2437}, {lat: 34.0525, lon: -118.2440}, {lat: 34.0528, lon: -118.2435}], detectedSites: [{type: 'Open', object: 'Old Tires'}] },
  { id: 'm11', name: 'Mission 11', date: 'Oct 9, 2025', duration: '30 mins', status: 'Interrupted', location: '428 Sampaloc' },
  { id: 'm10', name: 'Mission 10', date: 'Oct 8, 2025', duration: '27 mins', status: 'Completed', location: '428 Sampaloc', gpsTrack: [{lat: 34.0532, lon: -118.2427}, {lat: 34.0535, lon: -118.2430}, {lat: 34.0538, lon: -118.2425}], detectedSites: [{type: 'Enclosed', object: 'Flower Pots'}, {type: 'Open', object: 'Stagnant Puddle'}] },
  { id: 'm09', name: 'Mission 9', date: 'Oct 6, 2025', duration: '24 mins', status: 'Completed', location: '428 Sampaloc' },
  { id: 'm08', name: 'Mission 8', date: 'Oct 4, 2025', duration: '31 mins', status: 'Completed', location: '428 Sampaloc' },
  { id: 'm07', name: 'Mission 7', date: 'Oct 4, 2025', duration: '19 mins', status: 'Interrupted', location: '428 Sampaloc' },
  { id: 'm06', name: 'Mission 6', date: 'Oct 3, 2025', duration: '22 mins', status: 'Completed', location: '428 Sampaloc' },
];

type View = 'dashboard' | 'analytics' | 'flightLogs' | 'settings' | 'guide' | 'aboutProject';

const App: React.FC = () => {
  const [isMissionActive, setMissionActive] = useState(false);
  const [missionPlan, setMissionPlan] = useState<MissionPlan | null>(null);
  const [isSetupViewVisible, setSetupViewVisible] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);

  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const { overviewStats, time, date, liveTelemetry, setArmedState } = useDashboardData(isMissionActive);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  const endMission = (duration: string, gpsTrack: { lat: number; lon: number }[], detectedSites: BreedingSiteInfo[]) => {
    const newMission: Mission = {
        id: `m-${Date.now()}`,
        name: missionPlan?.name || `Mission ${missions.length + 1}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        duration: `${Math.round(parseInt(duration.split(':')[0]) * 60 + parseInt(duration.split(':')[1]))} secs`,
        status: 'Completed',
        location: 'Live Location',
        gpsTrack,
        detectedSites,
    };
    setMissions(prevMissions => [newMission, ...prevMissions]);
    setMissionActive(false);
    setMissionPlan(null);
  };
  
  const handleLaunchMission = (plan: MissionPlan) => {
    setMissionPlan(plan);
    setSetupViewVisible(false);
    setMissionActive(true);
  };

  const handleOpenMissionSetup = () => {
    setSetupViewVisible(true);
  };


  const renderView = () => {
    switch (currentView) {
      case 'analytics':
        return <AnalyticsPanel missions={missions} />;
      case 'flightLogs':
        return <FlightLogsPanel missions={missions} />;
      case 'settings':
        return <SettingsPanel isDarkMode={isDarkMode} onToggleDarkMode={() => setDarkMode(!isDarkMode)} />;
      case 'guide':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">No content yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Guide content coming soon</p>
            </div>
          </div>
        );
      case 'aboutProject':
        return (
          <div className="overflow-y-auto h-full animate-fade-in">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <h2 className="text-2xl font-bold text-gcs-text-dark dark:text-white mb-4">Smart Mosquito Control Drone: AI-Powered Larval Detection and Automated Larvicide Deployment</h2>
              
              <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  This project, developed at the Polytechnic University of the Philippines, presents an innovative, semi-autonomous drone system designed to combat the rising incidence of mosquito-borne diseases, such as dengue, in urban areas like Sta. Mesa, Manila. Traditional mosquito control methods are frequently challenged by insecticide resistance, limited access to hidden breeding sites, and high labor demands, leading to delays and inconsistent coverage.
                </p>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Our solution addresses these limitations by integrating Unmanned Aerial Vehicle (UAV) technology with Artificial Intelligence (AI) to provide a scalable, data-driven, and targeted vector control strategy.
                </p>
                
                <hr className="my-6 border-gray-300 dark:border-gray-600" />
                
                <h3 className="text-xl font-bold text-gcs-text-dark dark:text-white mb-4">Key Features and Components</h3>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  The <strong>Smart Mosquito Control Drone</strong> is a semi-autonomous quadcopter built on the <strong>DJI F450 frame</strong>. It is engineered to perform real-time aerial surveillance and localized intervention with minimal human effort.
                </p>
                
                <div className="space-y-6 mb-6">
                  <div>
                    <h4 className="text-base font-bold text-gcs-text-dark dark:text-white mb-2">🧠 Artificial Intelligence (AI) Detection</h4>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                      <li>
                        <strong>YOLOv8 Algorithm:</strong> The drone uses the YOLOv8 object detection model on an onboard <strong>Raspberry Pi 4</strong> to analyze real-time video streams from an <strong>RGB camera</strong>. This enables it to autonomously detect mosquito breeding sites and mosquito larvae with a target accuracy of above <strong>85%</strong>.
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-base font-bold text-gcs-text-dark dark:text-white mb-2">🎯 Precision Targeting and Deployment</h4>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                      <li>
                        <strong>Automated Larvicide Dispenser:</strong> Once a breeding site is confirmed, the system computes the appropriate dosage using spatial data and automatically deploys <strong>Bacillus thuringiensis israelensis (Bti)</strong>, a non-toxic biological larvicide.
                      </li>
                      <li>
                        <strong>LIDAR Sensor:</strong> A LIDAR (Laser Range Scanner) is used to estimate the volume of the breeding site and compute the precise larvicide dose, ensuring targeted and environmentally responsible application. It also aids in obstacle avoidance and terrain-aware navigation.
                      </li>
                      <li>
                        <strong>GPS Module:</strong> Provides location tracking for navigation and <strong>geotagging</strong> of detected breeding sites, creating a spatial data log for strategic monitoring.
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-base font-bold text-gcs-text-dark dark:text-white mb-2">🖥️ Ground Control System (GCS)</h4>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                      <li>
                        The GCS serves as the central command interface, logging real-time data such as <strong>detection accuracy</strong>, <strong>response time</strong> from detection to larvicide deployment, and <strong>area coverage</strong>. This interface allows the human operator to monitor missions, plan flight paths, and initiate manual recovery via a backup <strong>RC transceiver</strong> if the primary communication link is lost.
                      </li>
                    </ul>
                  </div>
                </div>
                
                <hr className="my-6 border-gray-300 dark:border-gray-600" />
                
                <h3 className="text-xl font-bold text-gcs-text-dark dark:text-white mb-4">Operational Goal and Impact</h3>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  The study's goal is to develop a working prototype that demonstrates high operational efficiency, aiming for a larvicide response time of <strong>under five minutes per site</strong>.
                </p>
                
                <p className="text-gray-700 dark:text-gray-300">
                  By effectively automating larval detection and treatment, the Smart Mosquito Control Drone aspires to <strong>reduce disease incidence</strong>, <strong>ease the burden on healthcare systems</strong>, and empower local government units (LGUs) with a proactive, evidence-based tool for public health management. This aligns directly with <strong>United Nations Sustainable Development Goal (SDG) 3: Good Health and Well-Being</strong>.
                </p>
              </div>
            </div>
          </div>
        );
      case 'dashboard':
      default:
        return <DashboardView overviewStats={overviewStats} missions={missions} onMissionSetup={handleOpenMissionSetup} telemetry={liveTelemetry} setArmedState={setArmedState} />;
    }
  };
  
  const viewTitles: Record<View, string> = {
    dashboard: 'Dashboard',
    analytics: 'Analytics',
    flightLogs: 'Flight Logs',
    settings: 'Settings',
    guide: 'Guide',
    aboutProject: 'About Project',
  };

  return (
    <div className="flex h-screen bg-gcs-background text-gcs-text-dark font-sans dark:bg-gcs-dark dark:text-gcs-text-light overflow-hidden">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 flex flex-col p-6 min-h-0">
        <DashboardHeader time={time} date={date} title={viewTitles[currentView]} batteryPercentage={liveTelemetry.battery.percentage} />
        <div className="flex-1 min-h-0 overflow-y-auto">
          {renderView()}
        </div>
      </main>
      
      {isSetupViewVisible && <MissionSetupView onLaunch={handleLaunchMission} onClose={() => setSetupViewVisible(false)} />}
      {isMissionActive && <LiveMissionView telemetry={liveTelemetry} onEndMission={endMission} />}
    </div>
  );
};

export default App;