import { Info, Leaf, Search, Target, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Understanding NDVI</h1>
        <p className="text-xl text-slate-600">The science behind precision agriculture.</p>
      </header>

      <div className="space-y-12">
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4 text-green-600">
            <Search className="w-6 h-6" />
            <h2 className="text-2xl font-bold">What is NDVI?</h2>
          </div>
          <p className="text-slate-700 leading-relaxed mb-4">
            The Normalized Difference Vegetation Index (NDVI) is a standard indicator of the quantity, quality and
            development of vegetation. It is calculated by measuring the difference between near-infrared
            (which vegetation strongly reflects) and red light (which vegetation absorbs).
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center font-mono text-lg">
            NDVI = (NIR - RED) / (NIR + RED)
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2 text-green-600">
              <Leaf className="w-5 h-5" /> Healthy Vegetation
            </h3>
            <p className="text-slate-600">
              Higher NDVI values (0.6 - 0.9) indicate dense, healthy vegetation with high chlorophyll content.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2 text-red-500">
              <TrendingUp className="w-5 h-5" /> Stressed Crops
            </h3>
            <p className="text-slate-600">
              Lower values (0.2 - 0.4) suggest sparse or stressed vegetation, potentially due to water deficit or disease.
            </p>
          </div>
        </section>

        <section className="bg-green-600 text-white p-8 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" /> Our Purpose
            </h2>
            <p className="text-green-50 leading-relaxed">
              This dashboard was developed as a dissertation project to demonstrate the practical application of
              remote sensing in farm management. By providing farmers with real-time access to satellite indices,
              we enable data-driven decision making that reduces resource waste and improves yield.
            </p>
          </div>
          {/* Decorative element */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-green-500 rounded-full opacity-30"></div>
        </section>
      </div>
    </div>
  );
}
