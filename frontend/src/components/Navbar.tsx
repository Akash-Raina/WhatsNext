import { useState } from "react";
import { Menu, X } from "lucide-react"; // Icons (install lucide-react if needed)

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = (offset: number) => {
    window.scrollTo({ 
      top: document.documentElement.scrollHeight - offset, 
      behavior: "smooth" 
    });
    setMenuOpen(false); // close menu after click
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 py-4 px-5 md:px-12 bg-[#F5F0FF] backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-[#8b5cf6] cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          What's Next
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-md font-bold">
          <span className="text-[#4b5563] cursor-pointer" onClick={() => handleScroll(800)}>How it Works</span>
          <span className="text-[#4b5563] cursor-pointer" onClick={() => handleScroll(1500)}>Features</span>
          <span className="text-[#4b5563] cursor-pointer" onClick={() => handleScroll(0)}>FAQ</span>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-5 pt-4 pb-2 space-y-3 text-md font-bold bg-[#F5F0FF]">
          <span className="block text-[#4b5563] cursor-pointer" onClick={() => handleScroll(800)}>How it Works</span>
          <span className="block text-[#4b5563] cursor-pointer" onClick={() => handleScroll(1500)}>Features</span>
          <span className="block text-[#4b5563] cursor-pointer">FAQ</span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
