import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { MobileNav } from "./components/MobileNav";
import { DownloadBar } from "./components/DownloadBar";
import { HomePage } from "./pages/Home";
import { MoviesPage } from "./pages/MoviesPage";
import { SeriesPage } from "./pages/SeriesPage";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  const renderContent = () => {
    switch (activeNav) {
      case "movies":
        return <MoviesPage />;
      case "series":
        return <SeriesPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#101114] text-white">
      {/* Sidebar (desktop fixed, mobile drawer) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeNav={activeNav}
        onNavChange={setActiveNav}
      />

      {/* Main content area */}
      <div className="md:ml-[200px] min-h-screen">
        {/* Header */}
        <Header onMenuToggle={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="pt-11 md:pt-10">
          {renderContent()}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav activeNav={activeNav} onNavChange={setActiveNav} />

      {/* Mobile download bar (above nav) */}
      <div className="md:hidden fixed bottom-[56px] left-0 right-0 z-40">
        <DownloadBar />
      </div>
    </div>
  );
}

export default App;
