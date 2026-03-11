'use client';

import { useState } from 'react';
import { Columns, ArrowLeftRight, TrendingUp, Info } from 'lucide-react';
import NDVIChart from '@/components/NDVIChart';

export default function AnalysisPage() {
  // Mock comparison data
  const fieldAData = [
    { date: '2023-01', value: 0.45 }, { date: '2023-02', value: 0.52 }, 
    { date: '2023-03', value: 0.68 }, { date: '2023-04', value: 0.75 }
  ];
  
  const fieldBData = [
    { date: '2023-01', value: 0.42 }, { date: '2023-02', value: 0.48 }, 
    { date: '2023-03', value: 0.55 }, { date: '2023-04', value: 0.62 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <Columns className="w-8 h-8 text-green-600" />
        <h1 className="text-3xl font-bold text-slate-900">Multi-Field Analysis</h1>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl flex gap-4 items-start">
        <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
        <p className="text-blue-800">
          This feature allows you to compare performance between different parcels or historical seasons. 
          Use the side-by-side view to identify lagging fields and redistribute resources effectively.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-bold text-slate-800">Field A (Wheat)</h2>
            <span className="text-sm text-green-600 font-semibold">+12% vs last month</span>
          </div>
          <NDVIChart data={fieldAData} label="Field A" />
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 text-sm">Peak Performance</span>
            <span className="font-bold text-slate-700">0.82 NDVI</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-bold text-slate-800">Field B (Maize)</h2>
            <span className="text-sm text-amber-600 font-semibold">+5% vs last month</span>
          </div>
          <NDVIChart data={fieldBData} label="Field B" />
          <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 text-sm">Peak Performance</span>
            <span className="font-bold text-slate-700">0.71 NDVI</span>
          </div>
        </div>
      </div>

      <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <ArrowLeftRight className="w-6 h-6 text-green-500" />
          <h2 className="text-2xl font-bold">Comparison Insight</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <InsightCard 
            title="Correlation"
            value="High (0.92)"
            desc="Both fields are following similar seasonal growth patterns."
          />
          <InsightCard 
            title="Yield Forecast"
            value="Field A > Field B"
            desc="Current biomass levels suggest 15% higher yield potential for Field A."
          />
          <InsightCard 
            title="Resource Need"
            value="Focus on Field B"
            desc="Field B is showing early signs of water stress based on NDVI trajectory."
          />
        </div>
      </section>
    </div>
  );
}

function InsightCard({ title, value, desc }: { title: string, value: string, desc: string }) {
  return (
    <div className="space-y-2">
      <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</h4>
      <p className="text-xl font-bold text-green-400">{value}</p>
      <p className="text-sm text-slate-300 leading-relaxed">{desc}</p>
    </div>
  );
}
