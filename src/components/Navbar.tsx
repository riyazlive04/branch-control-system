import { useState, useEffect } from "react";
import logo from "@/assets/logo.jpg";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToForm = () => {
    document.getElementById("consultation")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-xl shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container-narrow flex items-center justify-between h-16 md:h-20 px-5 md:px-8">
        <div className="flex items-center gap-2 md:gap-3">
          <img src={logo} alt="Sirah Digital" className="h-8 w-8 md:h-10 md:w-10 rounded-lg object-cover" />
          <span className="font-display font-bold text-base md:text-lg text-foreground">Sirah Digital</span>
        </div>
        <button onClick={scrollToForm} className="btn-primary text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-5">
          <span className="sm:hidden">Book Call</span>
          <span className="hidden sm:inline">Book Consultation</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
