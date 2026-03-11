import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-gray-900 tracking-tight">NDVI <span className="text-green-600">Dashboard</span></span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/analysis" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Field Analysis
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
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
