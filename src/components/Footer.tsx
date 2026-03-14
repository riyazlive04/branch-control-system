import logo from "@/assets/logo.jpg";

const Footer = () => (
  <footer className="pt-8 pb-[calc(3rem+env(safe-area-inset-bottom))] md:py-12 px-5 md:px-8 border-t border-border">
    <div className="container-narrow flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Sirah Digital" className="h-8 w-8 rounded-lg object-cover" />
        <span className="font-display font-bold text-foreground">Sirah Digital</span>
      </div>
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Sirah Digital. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
