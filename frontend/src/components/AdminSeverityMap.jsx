import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Flame, MapPinned } from 'lucide-react';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const INDIA_CENTER = [22.9734, 78.6569];

const KNOWN_AREA_COORDS = {
  panchgani: [17.9243, 73.8008],
  pune: [18.5204, 73.8567],
  satara: [17.6805, 74.0183],
  kolhapur: [16.705, 74.2433],
  mumbai: [19.076, 72.8777],
  nashik: [19.9975, 73.7898],
  nagpur: [21.1458, 79.0882],
  wardha: [20.7453, 78.6022],
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getAreaCoords = (area) => {
  const key = (area || '').trim().toLowerCase();
  if (KNOWN_AREA_COORDS[key]) return KNOWN_AREA_COORDS[key];

  // Deterministic jitter around India center so unknown areas still render on a real map.
  const hash = hashString(key || 'unknown');
  const latOffset = ((hash % 5000) / 5000 - 0.5) * 14;
  const lngOffset = ((((hash / 5000) | 0) % 5000) / 5000 - 0.5) * 14;
  return [INDIA_CENTER[0] + latOffset, INDIA_CENTER[1] + lngOffset];
};

const severityColor = (severityIndex) => {
  const normalized = clamp(severityIndex || 0, 0, 1);
  const hue = (1 - normalized) * 120; // green -> red
  return `hsl(${hue}, 86%, 45%)`;
};

function AdminSeverityMap() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mapData, setMapData] = useState([]);
  const [summary, setSummary] = useState({
    totalAreas: 0,
    totalCases: 0,
    totalCritical: 0,
    maxSeverity: 0,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const response = await fetch(`${base}/admin/severity-heatmap`);
        if (!response.ok) {
          throw new Error(`Failed to load heatmap data (${response.status})`);
        }

        const payload = await response.json();
        const rows = (payload.data || []).map((item) => {
          const coords = getAreaCoords(item.area);
          return {
            ...item,
            lat: coords[0],
            lng: coords[1],
          };
        });

        setMapData(rows);
        setSummary(payload.summary || summary);
      } catch (err) {
        setError(err.message || 'Unable to load severity map');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const topCriticalAreas = useMemo(
    () => [...mapData].sort((a, b) => b.criticalCases - a.criticalCases).slice(0, 4),
    [mapData]
  );

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2">
            <MapPinned size={18} className="text-slate-700" />
            Disease Severity Map
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Redder regions represent higher weighted severity and more critical disease load.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-[11px] text-slate-500">Areas</p>
            <p className="text-base font-semibold text-slate-800">{summary.totalAreas}</p>
          </div>
          <div className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-[11px] text-slate-500">Cases</p>
            <p className="text-base font-semibold text-slate-800">{summary.totalCases}</p>
          </div>
          <div className="rounded-xl bg-red-50 px-3 py-2">
            <p className="text-[11px] text-red-600">Critical</p>
            <p className="text-base font-semibold text-red-700">{summary.totalCritical}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-4 h-[380px] rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
      ) : error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <MapContainer
              center={INDIA_CENTER}
              zoom={5}
              scrollWheelZoom
              className="h-[380px] w-full"
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {mapData.map((item) => {
                const normalized = clamp(item.severityIndex || 0, 0, 1);
                const radius = clamp(8 + item.criticalCases * 2 + Math.sqrt(item.totalCases), 7, 30);
                return (
                  <CircleMarker
                    key={item.area}
                    center={[item.lat, item.lng]}
                    radius={radius}
                    pathOptions={{
                      color: severityColor(normalized),
                      fillColor: severityColor(normalized),
                      fillOpacity: 0.22 + normalized * 0.62,
                      weight: 1,
                    }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{item.area}</p>
                        <p>Total Cases: {item.totalCases}</p>
                        <p>Critical Cases: {item.criticalCases}</p>
                        <p>Severity Index: {(normalized * 100).toFixed(1)}%</p>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

          <div className="rounded-xl border border-slate-200 p-3">
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Flame size={16} className="text-red-500" />
              Highest Critical Load
            </h4>
            <div className="mt-3 space-y-2">
              {topCriticalAreas.length === 0 ? (
                <p className="text-xs text-slate-500">No area data available yet.</p>
              ) : (
                topCriticalAreas.map((item) => (
                  <div key={`${item.area}-critical`} className="rounded-lg border border-slate-200 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800">{item.area}</p>
                      <span className="text-xs font-semibold text-red-600">{item.criticalCases} critical</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.totalCases} cases • {(item.severityIndex * 100).toFixed(1)}% severity
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4">
              <p className="text-xs text-slate-500 mb-1">Legend</p>
              <div className="h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-600" />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>Critical</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminSeverityMap;
