import Link from 'next/link';
import { ArrowRight, BarChart3, Map as MapIcon, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Monitor Your Fields with <span className="text-green-600 bg-clip-text">NDVI Intelligence</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Gain deep insights into crop health using Sentinel-2 satellite data.
            Analyze vegetation health, track trends, and optimize your harvest strategy with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200 group">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-slate-900 font-bold text-lg border border-slate-200 hover:border-green-600 transition-all shadow-sm">
              Learn More
            </Link>
          </div>
        </div>

        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Key Capabilities</h2>
          <div className="h-1 w-20 bg-green-600 mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<MapIcon className="w-8 h-8 text-green-600" />}
            title="Interactive Mapping"
            description="Draw custom polygons to define your fields and overlay NDVI layers directly from Sentinel Hub."
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8 text-green-600" />}
            title="Time Series Analysis"
            description="Track health trends over months and seasons with high-resolution temporal charts."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-8 h-8 text-green-600" />}
            title="Precision Insights"
            description="Identify problem areas in your fields before they become critical using vegetation index data."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} NDVI Dashboard Project. Built for agricultural precision.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="mb-4 p-3 bg-slate-50 w-fit rounded-xl group-hover:bg-green-50 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
