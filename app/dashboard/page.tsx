'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import NDVIChart from '@/components/NDVIChart';
import TimeSlider from '@/components/TimeSlider';
import { Leaf, Activity, AlertTriangle, ChevronRight } from 'lucide-react';
import axios from 'axios';

// Leaflet needs to be dynamically imported because it uses 'window'
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Loading Map...</div>
});

export default function DashboardPage() {
  const [selectedPolygon, setSelectedPolygon] = useState<any>(null);
  const [ndviData, setNdviData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(5);

  const timelineLabels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  useEffect(() => {
    const savedPolygon = localStorage.getItem('selectedField');
    if (savedPolygon) {
      try {
        setSelectedPolygon(JSON.parse(savedPolygon));
      } catch (e) {
        console.error('Failed to parse saved polygon');
      }
    }
  }, []);

  const handlePolygonCreated = (geojson: any) => {
    setSelectedPolygon(geojson);
    localStorage.setItem('selectedField', JSON.stringify(geojson));
  };

  useEffect(() => {
    if (selectedPolygon) {
      fetchData();
    }
  }, [selectedPolygon]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/ndvi', {
        polygon: selectedPolygon,
        dateFrom: '2023-01-01',
        dateTo: '2023-12-31'
      });
      setNdviData(response.data);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Failed to fetch NDVI data.';
      console.error('Failed to fetch NDVI:', errorMsg);
      alert(errorMsg); // Show the specific reason for failure
    } finally {
      setIsLoading(false);
    }
  };

  const currentNDVI = ndviData[currentTimeIndex]?.value || 0;
  const avgNDVI = ndviData.length > 0
    ? ndviData.reduce((acc, curr) => acc + curr.value, 0) / ndviData.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">Field Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Select a field on the map to analyze vegetation health.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-600 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            Live Status: <span className="text-green-600">Active</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Col: Map & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Map
            center={[-34.6037, -58.3816]} // Default to some area, e.g., Argentina pampas
            zoom={14}
            onPolygonCreated={handlePolygonCreated}
          />
          <TimeSlider
            value={currentTimeIndex}
            min={0}
            max={11}
            labels={timelineLabels}
            onChange={setCurrentTimeIndex}
          />
        </div>

        {/* Right Col: Stats & Chart */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Current NDVI</span>
              <span className={`text-2xl font-bold ${currentNDVI > 0.5 ? 'text-green-600' : 'text-amber-500'}`}>
                {currentNDVI.toFixed(2)}
              </span>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Avg Health</span>
              <span className="text-2xl font-bold text-slate-900">
                {avgNDVI > 0 ? (avgNDVI * 100).toFixed(0) + '%' : '--'}
              </span>
            </div>
          </div>

          {!selectedPolygon ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Leaf className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">Use the polygon tool on the map to select a field area.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <NDVIChart data={ndviData} />

              {/* Alert Section */}
              <div className={`p-4 rounded-xl border flex gap-3 ${currentNDVI < 0.4 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'
                }`}>
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${currentNDVI < 0.4 ? 'text-amber-600' : 'text-green-600'
                  }`} />
                <div>
                  <h4 className={`text-sm font-bold ${currentNDVI < 0.4 ? 'text-amber-900' : 'text-green-900'
                    }`}>
                    {currentNDVI < 0.4 ? 'Low Vegetation Health' : 'Optimal Growth'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {currentNDVI < 0.4
                      ? 'The current index indicates stress. Consider investigating irrigation or nutrient levels.'
                      : 'Crops are showing strong photosynthetic activity for this period.'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div className="text-sm">
                  <p className="font-bold">Next Data Update</p>
                  <p className="text-slate-400 text-xs text-opacity-80">Scheduled in 3 days (Sentinel-2)</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
