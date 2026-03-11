import Link from 'next/link';
import { Home, LayoutDashboard, LineChart, Info, Map as MapIcon } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <MapIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">NDVI <span className="text-green-600">Dashboard</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link href="/analysis" className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium">
              <LineChart className="w-4 h-4" />
              Field Analysis
            </Link>
            <Link href="/about" className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium">
              <Info className="w-4 h-4" />
              About
            </Link>
          </div>

          <div className="md:hidden">
            {/* Mobile menu button could go here */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
