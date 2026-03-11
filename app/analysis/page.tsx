'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Columns, ArrowLeftRight, Info, Calendar, Radio } from 'lucide-react';
import NDVIChart from '@/components/NDVIChart';

function InsightCard({ title, value, desc }: { title: string, value: string, desc: string }) {
  return (
    <div className="space-y-2">
      <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</h4>
      <p className="text-xl font-bold text-green-400">{value}</p>
      <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function AnalysisPage() {
  const [selectedPolygon, setSelectedPolygon] = useState<any>(null);

  const [year1, setYear1] = useState('2023');
  const [year2, setYear2] = useState('2022');
  const [dataSource, setDataSource] = useState<'optical' | 'radar'>('optical');

  const [data1, setData1] = useState<any[]>([]);
  const [data2, setData2] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const availableYears = ['2025', '2024', '2023', '2022', '2021', '2020'];

  useEffect(() => {
    const saved = localStorage.getItem('selectedField');
    if (saved) {
      try {
        const poly = JSON.parse(saved);
        setSelectedPolygon(poly);
      } catch (e) {
        console.error('Failed to parse saved field');
      }
    }
  }, []);

  useEffect(() => {
    if (selectedPolygon) {
      fetchComparisonData(selectedPolygon, year1, year2, dataSource);
    }
  }, [selectedPolygon, year1, year2, dataSource]);

  const fetchComparisonData = async (polygon: any, y1: string, y2: string, src: string) => {
    setIsLoading(true);
    try {
      const [res1, res2] = await Promise.all([
        axios.post('/api/ndvi', { polygon, dateFrom: `${y1}-01-01`, dateTo: `${y1}-12-31`, dataSource: src }),
        axios.post('/api/ndvi', { polygon, dateFrom: `${y2}-01-01`, dateTo: `${y2}-12-31`, dataSource: src })
      ]);
      setData1(res1.data || []);
      setData2(res2.data || []);
    } catch (error) {
      console.error('Comparison error:', error);
      alert('Failed to fetch data for comparison.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPeak = (data: any[]) => (data && data.length > 0) ? Math.max(...data.map(d => d.value)) : 0;
  const getAvg = (data: any[]) => (data && data.length > 0) ? data.reduce((a, b) => a + b.value, 0) / data.length : 0;

  const peak1 = getPeak(data1);
  const peak2 = getPeak(data2);
  const growth = peak2 > 0 ? ((peak1 - peak2) / peak2 * 100).toFixed(0) : '0';

  const getMetricLabel = () => dataSource === 'optical' ? 'NDVI' : 'NDVInc';

  if (!selectedPolygon) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner text-slate-300">
          <Columns className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">No Field Selected</h1>
        <p className="text-slate-500 max-w-md mx-auto">Please go to the Dashboard and draw a field on the map first to perform a detailed cross-season analysis.</p>
        <Link href="/dashboard" className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-all">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Historical Comparison</h1>
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-2 md:py-1 rounded-full text-center whitespace-nowrap self-start md:self-auto">
          Precision Mode: Active
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-wrap gap-6 items-center shadow-sm">

        {/* Sensor Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-500 flex items-center gap-1">
            <Radio className="w-4 h-4" /> Sensor:
          </span>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setDataSource('optical')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${dataSource === 'optical' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              Optical (Sentinel-2)
            </button>
            <button
              onClick={() => setDataSource('radar')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${dataSource === 'radar' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              Radar (Sentinel-1)
            </button>
          </div>
        </div>

        {/* Year Selectors */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-sm font-semibold text-slate-500 flex items-center gap-1">
            <Calendar className="w-4 h-4" /> Compare:
          </span>
          <select
            value={year1}
            onChange={(e) => setYear1(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 font-medium appearance-none"
          >
            {availableYears.map(y => <option key={y} value={y}>{y} Base Year</option>)}
          </select>
          <span className="text-slate-400 font-bold px-1">vs</span>
          <select
            value={year2}
            onChange={(e) => setYear2(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 font-medium appearance-none"
          >
            {availableYears.map(y => <option key={y} value={y}>{y} Comparison</option>)}
          </select>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl flex gap-4 items-start shadow-sm">
        <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
        <div className="space-y-1">
          <p className="text-blue-900 font-bold">Cross-Season Insights</p>
          <p className="text-blue-800 text-sm opacity-90">
            Comparing the growth trajectory of your selected parcel across {year1} and {year2}.
            This identifies long-term soil health patterns and potential yield improvements.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
          <div className="h-[400px] bg-slate-100 rounded-2xl" />
          <div className="h-[400px] bg-slate-100 rounded-2xl" />
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Base Year ({year1})</h2>
                <span className={`text-sm font-semibold ${Number(growth) >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
                  {Number(growth) >= 0 ? '+' : ''}{growth}% vs {year2}
                </span>
              </div>
              <NDVIChart data={data1} label={`${year1} ${getMetricLabel()}`} />
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 text-sm">Peak Performance</span>
                <span className="font-bold text-slate-700">{peak1.toFixed(2)} {getMetricLabel()}</span>
              </div>
            </div>

            <div className="space-y-4 opacity-80">
              <div className="flex justify-between items-end">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Comparison ({year2})</h2>
                <span className="text-sm text-slate-400 font-medium tracking-tight italic">Baseline Data</span>
              </div>
              <NDVIChart data={data2} label={`${year2} ${getMetricLabel()}`} />
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 text-sm">Peak Performance</span>
                <span className="font-bold text-slate-700">{peak2.toFixed(2)} {getMetricLabel()}</span>
              </div>
            </div>
          </div>

          <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 -mr-12 -mt-12 bg-green-500 rounded-full blur-3xl opacity-10"></div>
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <ArrowLeftRight className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold">Agronomic Insights</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              <InsightCard
                title="Correlation"
                value={Math.abs(getAvg(data1) - getAvg(data2)) < 0.1 ? "High Trend match" : "Varied Growth"}
                desc="Indicates how closely this year's growth follows historical patterns."
              />
              <InsightCard
                title="Yield Potential"
                value={peak1 > peak2 ? "Improving" : "Underperforming"}
                desc="Based on peak biomass levels relative to the previous benchmark."
              />
              <InsightCard
                title="Soil Recommendation"
                value={Number(growth) < -10 ? "Investigate" : "Maintain"}
                desc="Significant deviations suggest looking into nutrient depletion or stress."
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
