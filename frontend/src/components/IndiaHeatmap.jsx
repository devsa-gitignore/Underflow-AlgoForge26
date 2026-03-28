import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Mock localized severity data (villages/wards instead of states)
const mockVillages = [
  { id: 1, name: "Ward 1 (North)", lat: 23.2800, Lng: 77.4000, totalCases: 10, highRiskCases: 2, maternalCases: 5 },
  { id: 2, name: "Ward 2 (East)", lat: 23.2550, Lng: 77.4500, totalCases: 42, highRiskCases: 12, maternalCases: 15 },
  { id: 3, name: "Ward 3 (West)", lat: 23.2650, Lng: 77.3700, totalCases: 18, highRiskCases: 4, maternalCases: 8 },
  { id: 4, name: "Ward 4 (Central)", lat: 23.2599, Lng: 77.4126, totalCases: 5, highRiskCases: 0, maternalCases: 3 },
  { id: 5, name: "Ward 5 (South)", lat: 23.2300, Lng: 77.4200, totalCases: 85, highRiskCases: 35, maternalCases: 20 },
  { id: 6, name: "Rampur Village", lat: 23.3100, Lng: 77.4400, totalCases: 65, highRiskCases: 30, maternalCases: 10 },
  { id: 7, name: "Shivnagar", lat: 23.2200, Lng: 77.3800, totalCases: 25, highRiskCases: 5, maternalCases: 12 },
  { id: 8, name: "Kalyanpur", lat: 23.2900, Lng: 77.4800, totalCases: 50, highRiskCases: 18, maternalCases: 25 },
  { id: 9, name: "Tulsi Wadi", lat: 23.2400, Lng: 77.4900, totalCases: 12, highRiskCases: 1, maternalCases: 6 },
];

const HeatmapStyles = () => {
  return (
    <style>
      {`
        .leaflet-container {
          background: #f1f5f9; /* Slate 100 to match dashboard */
          font-family: 'Inter', sans-serif;
        }
        .village-tooltip {
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          font-family: 'Inter', sans-serif;
          color: #1e293b;
          font-weight: 500;
        }
        .info.legend {
          background: white;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          line-height: 24px;
          color: #334155;
          font-size: 12px;
          font-weight: 600;
        }
        .info.legend i {
          width: 18px;
          height: 18px;
          float: left;
          margin-right: 8px;
          opacity: 0.9;
          border-radius: 50%;
        }
      `}
    </style>
  );
};

// Determines shade of color based on filter and cases
const getColor = (cases, filterType) => {
  if (filterType === 'maternal') {
    return cases > 20 ? '#0f766e' : // Teal 700
           cases > 15 ? '#0d9488' : // Teal 600
           cases > 10 ? '#14b8a6' : // Teal 500
           cases > 5  ? '#2dd4bf' : // Teal 400
           cases > 0  ? '#5eead4' : // Teal 300
                        '#f1f5f9';  // Slate 100
  } else if (filterType === 'highRisk') {
    return cases > 30 ? '#7f1d1d' : // Red 900
           cases > 20 ? '#991b1b' : // Red 800
           cases > 10 ? '#b91c1c' : // Red 700
           cases > 5  ? '#dc2626' : // Red 600
           cases > 0  ? '#ef4444' : // Red 500
                        '#f1f5f9';  
  } else {
    // Default (All cases)
    return cases > 80 ? '#7f1d1d' : // Red 900
           cases > 60 ? '#b91c1c' : // Red 700
           cases > 40 ? '#ef4444' : // Red 500
           cases > 20 ? '#f87171' : // Red 400
           cases > 5  ? '#fca5a5' : // Red 300
           cases > 0  ? '#fecaca' : // Red 200
                        '#f1f5f9';  // Slate 100
  }
};

function Legend({ filterType }) {
  const map = useMap();
  
  useEffect(() => {
    import('leaflet').then(L => {
      const legend = L.control({ position: 'bottomright' });

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        
        let grades = [0, 5, 20, 40, 60, 80];
        let title = 'Total Cases';
        if (filterType === 'maternal') { grades = [0, 5, 10, 15, 20]; title = 'Maternal Cases'; }
        if (filterType === 'highRisk') { grades = [0, 5, 10, 20, 30]; title = 'High Risk Cases'; }

        const labels = [];
        let from, to;

        labels.push(`<strong>${title}</strong><br>`);

        for (let i = 0; i < grades.length; i++) {
          from = grades[i];
          to = grades[i + 1];

          labels.push(
            '<i style="background:' + getColor(from + 1, filterType) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+')
          );
        }

        div.innerHTML = labels.join('<br>');
        return div;
      };

      legend.addTo(map);

      // Cleanup
      return () => legend.remove();
    });
  }, [map, filterType]);

  return null;
}

export default function RegionalHeatmap() {
  const [filterType, setFilterType] = useState('all');
  
  // Center map closely around our mock regions
  const mapCenter = [23.2599, 77.4126];

  const getDisplayValue = (village) => {
    if (filterType === 'maternal') return village.maternalCases;
    if (filterType === 'highRisk') return village.highRiskCases;
    return village.totalCases;
  };

  return (
    <div className="w-full h-[360px] bg-slate-100 rounded-b-xl overflow-hidden relative z-0">
      <HeatmapStyles />
      
      {/* FLOATING GLASS UI FILTER */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 bg-white/70 backdrop-blur-xl p-2 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/80 transition-all">
        <button 
          onClick={() => setFilterType('all')}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all w-28 text-left flex items-center justify-between ${filterType === 'all' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-600 hover:bg-white/80 active:scale-[0.98]'}`}
        >
          <span>All Cases</span>
          {filterType === 'all' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
        </button>
        <button 
          onClick={() => setFilterType('highRisk')}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all w-28 text-left flex items-center justify-between ${filterType === 'highRisk' ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 hover:bg-white/80 active:scale-[0.98]'}`}
        >
          <span>High Risk</span>
          {filterType === 'highRisk' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
        </button>
        <button 
          onClick={() => setFilterType('maternal')}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all w-28 text-left flex items-center justify-between ${filterType === 'maternal' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-white/80 active:scale-[0.98]'}`}
        >
          <span>Maternal</span>
          {filterType === 'maternal' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
        </button>
      </div>

      <MapContainer 
        center={mapCenter} 
        zoom={11.5} 
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {mockVillages.map((village) => {
           const activeCases = getDisplayValue(village);
           
           // We scale the circle radius slightly based on cases to accentuate hotspots
           // Use a smaller baseline if there are 0 cases
           let scaleFactor = filterType === 'all' ? 100 : filterType === 'maternal' ? 30 : 40;
           const radius = activeCases === 0 ? 0 : Math.max(8, Math.min(24, 8 + (activeCases / scaleFactor) * 16));
           
           // Highlight color depending on active filter
           const strokeColor = filterType === 'maternal' ? '#0f766e' : 
                               filterType === 'highRisk' ? '#7f1d1d' : 
                               activeCases > 60 ? '#7f1d1d' : '#ef4444';

           return (
             <CircleMarker 
               key={`${village.id}-${filterType}`} // Force re-animation on filter change
               center={[village.lat, village.Lng]}
               radius={radius}
               fillColor={getColor(activeCases, filterType)}
               color={strokeColor}
               weight={1.5}
               opacity={0.8}
               fillOpacity={0.7}
             >
               <Tooltip className="village-tooltip" sticky direction="top">
                 <div style={{ textAlign: 'center' }}>
                   <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{village.name}</div>
                   <div style={{ fontSize: '12px', color: filterType === 'maternal' ? '#0f766e' : filterType === 'highRisk' ? '#b91c1c' : activeCases > 60 ? '#b91c1c' : '#475569' }}>
                     <strong>{activeCases}</strong> {filterType === 'maternal' ? 'maternal tracks' : filterType === 'highRisk' ? 'critical risks' : 'total cases'}
                   </div>
                 </div>
               </Tooltip>
             </CircleMarker>
           );
        })}

        <Legend filterType={filterType} />
      </MapContainer>
    </div>
  );
}

// Simple helper to scale radius
function casesToRadius(cases) {
  return 8 + (cases / 100) * 16;
}
