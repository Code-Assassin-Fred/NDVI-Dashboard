'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Columns, ArrowLeftRight, Info } from 'lucide-react';
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
  const [data2023, setData2023] = useState<any[]>([]);
  const [data2022, setData2022] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('selectedField');
    if (saved) {
      try {
        const poly = JSON.parse(saved);
        setSelectedPolygon(poly);
        fetchComparisonData(poly);
      } catch (e) {
        console.error('Failed to parse saved field');
      }
    }
  }, []);

  const fetchComparisonData = async (polygon: any) => {
    setIsLoading(true);
    try {
      const [res2023, res2022] = await Promise.all([
        axios.post('/api/ndvi', { polygon, dateFrom: '2023-01-01', dateTo: '2023-12-31' }),
        axios.post('/api/ndvi', { polygon, dateFrom: '2022-01-01', dateTo: '2022-12-31' })
      ]);
      setData2023(res2023.data || []);
      setData2022(res2022.data || []);
    } catch (error) {
      console.error('Comparison error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPeak = (data: any[]) => (data && data.length > 0) ? Math.max(...data.map(d => d.value)) : 0;
  const getAvg = (data: any[]) => (data && data.length > 0) ? data.reduce((a, b) => a + b.value, 0) / data.length : 0;

  const peak2023 = getPeak(data2023);
  const peak2022 = getPeak(data2022);
  const growth = peak2022 > 0 ? ((peak2023 - peak2022) / peak2022 * 100).toFixed(0) : '0';

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
          <Columns className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Historical Comparison</h1>
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-2 md:py-1 rounded-full text-center whitespace-nowrap self-start md:self-auto">
          Precision Mode: Active
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl flex gap-4 items-start shadow-sm">
        <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
        <div className="space-y-1">
          <p className="text-blue-900 font-bold">Cross-Season Insights</p>
          <p className="text-blue-800 text-sm opacity-90">
            Comparing the growth trajectory of your selected parcel across 2023 and 2022.
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
                <h2 className="text-xl font-bold text-slate-800">Current Season (2023)</h2>
                <span className={`text-sm font-semibold ${Number(growth) >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
                  {Number(growth) >= 0 ? '+' : ''}{growth}% vs 2022
                </span>
              </div>
              <NDVIChart data={data2023} label="2023 NDVI" />
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 text-sm">Peak Performance</span>
                <span className="font-bold text-slate-700">{peak2023.toFixed(2)} NDVI</span>
              </div>
            </div>

            <div className="space-y-4 opacity-80">
              <div className="flex justify-between items-end">
                <h2 className="text-xl font-bold text-slate-800">Previous Season (2022)</h2>
                <span className="text-sm text-slate-400 font-medium tracking-tight italic">Baseline Data</span>
              </div>
              <NDVIChart data={data2022} label="2022 NDVI" />
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 text-sm">Peak Performance</span>
                <span className="font-bold text-slate-700">{peak2022.toFixed(2)} NDVI</span>
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
                value={Math.abs(getAvg(data2023) - getAvg(data2022)) < 0.1 ? "High Trend match" : "Varied Growth"}
                desc="Indicates how closely this year's growth follows historical patterns."
              />
              <InsightCard
                title="Yield Potential"
                value={peak2023 > peak2022 ? "Improving" : "Underperforming"}
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
