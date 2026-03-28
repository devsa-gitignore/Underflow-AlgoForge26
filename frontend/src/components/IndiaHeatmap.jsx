import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Mock localized severity data (villages/wards instead of states)
const mockVillages = [
  { id: 1, name: "Ward 1 (North)", lat: 23.2800, Lng: 77.4000, cases: 10 },
  { id: 2, name: "Ward 2 (East)", lat: 23.2550, Lng: 77.4500, cases: 42 },
  { id: 3, name: "Ward 3 (West)", lat: 23.2650, Lng: 77.3700, cases: 18 },
  { id: 4, name: "Ward 4 (Central)", lat: 23.2599, Lng: 77.4126, cases: 5 },
  { id: 5, name: "Ward 5 (South)", lat: 23.2300, Lng: 77.4200, cases: 85 },
  { id: 6, name: "Rampur Village", lat: 23.3100, Lng: 77.4400, cases: 65 },
  { id: 7, name: "Shivnagar", lat: 23.2200, Lng: 77.3800, cases: 25 },
  { id: 8, name: "Kalyanpur", lat: 23.2900, Lng: 77.4800, cases: 50 },
  { id: 9, name: "Tulsi Wadi", lat: 23.2400, Lng: 77.4900, cases: 12 },
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

// Determines shade of red based on critical cases
const getColor = (cases) => {
  return cases > 80 ? '#7f1d1d' : // Red 900
         cases > 60 ? '#b91c1c' : // Red 700
         cases > 40 ? '#ef4444' : // Red 500
         cases > 20 ? '#f87171' : // Red 400
         cases > 5  ? '#fca5a5' : // Red 300
         cases > 0  ? '#fecaca' : // Red 200
                      '#f1f5f9';  // Slate 100 for zero cases
};

function Legend() {
  const map = useMap();
  
  useEffect(() => {
    import('leaflet').then(L => {
      const legend = L.control({ position: 'bottomright' });

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [0, 5, 20, 40, 60, 80];
        const labels = [];
        let from, to;

        labels.push('<strong>Critical Cases</strong><br>');

        for (let i = 0; i < grades.length; i++) {
          from = grades[i];
          to = grades[i + 1];

          labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
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
  }, [map]);

  return null;
}

export default function RegionalHeatmap() {
  // Center map closely around our mock regions
  const mapCenter = [23.2599, 77.4126];

  return (
    <div className="w-full h-[360px] bg-slate-100 rounded-b-xl overflow-hidden relative z-0">
      <HeatmapStyles />
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
           // We scale the circle radius slightly based on cases to accentuate hotspots
           const radius = Math.max(8, Math.min(24, casesToRadius(village.cases)));
           
           return (
             <CircleMarker 
               key={village.id}
               center={[village.lat, village.Lng]}
               radius={radius}
               fillColor={getColor(village.cases)}
               color={village.cases > 60 ? '#7f1d1d' : '#ef4444'} // Darker border for severe cases
               weight={1.5}
               opacity={0.8}
               fillOpacity={0.7}
             >
               <Tooltip className="village-tooltip" sticky direction="top">
                 <div style={{ textAlign: 'center' }}>
                   <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{village.name}</div>
                   <div style={{ fontSize: '12px', color: village.cases > 60 ? '#b91c1c' : '#475569' }}>
                     <strong>{village.cases}</strong> critical cases
                   </div>
                 </div>
               </Tooltip>
             </CircleMarker>
           );
        })}

        <Legend />
      </MapContainer>
    </div>
  );
}

// Simple helper to scale radius
function casesToRadius(cases) {
  return 8 + (cases / 100) * 16;
}
