import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { MobileNav } from "./components/MobileNav";
import { DownloadBar } from "./components/DownloadBar";
import { HomePage } from "./pages/Home";
import { MoviesPage } from "./pages/MoviesPage";
import { SeriesPage } from "./pages/SeriesPage";
import NotFound from "./pages/not-found";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

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
    <WouterRouter base={BASE}>
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

          {/* Page content - with top padding to avoid header overlap on mobile */}
          <main className="pt-10">
            {renderContent()}
          </main>
        </div>

        {/* Mobile bottom navigation */}
        <MobileNav activeNav={activeNav} onNavChange={setActiveNav} />

        {/* Mobile download bar (above nav) */}
        <div className="md:hidden fixed bottom-[56px] left-0 right-0 z-40">
          <DownloadBar />
        </div>

        {/* 404 route fallback */}
        <Switch>
          <Route component={NotFound} />
        </Switch>
      </div>
    </WouterRouter>
  );
}

export default App;
