import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { MobileNav } from "./components/MobileNav";
import { DownloadBar } from "./components/DownloadBar";
import { HomePage } from "./pages/Home";
import { MoviesPage } from "./pages/MoviesPage";
import { SeriesPage } from "./pages/SeriesPage";
import { PlayPage } from "./pages/PlayPage";
import { VJDashboard } from "./pages/VJDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import type { ContentItem } from "./lib/types";
import { useAuth } from "./contexts/AuthContext";

const ADMIN_EMAIL = "mainplatform.nexus@gmail.com";

function App() {
  const { profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState<ContentItem | null>(null);

  const handlePlay = (movie: ContentItem) => {
    setSelectedMovie(movie);
    setActiveNav("play");
  };

  const handleBack = () => {
    setActiveNav("home");
  };

  if (activeNav === "vj-dashboard") {
    return <VJDashboard onBack={() => setActiveNav("home")} />;
  }

  if (activeNav === "admin-dashboard") {
    if (profile?.email !== ADMIN_EMAIL) {
      setActiveNav("home");
      return null;
    }
    return <AdminDashboard onBack={() => setActiveNav("home")} />;
  }

  if (activeNav === "play" && selectedMovie) {
    return <PlayPage movie={selectedMovie} onBack={handleBack} />;
  }

  const renderContent = () => {
    switch (activeNav) {
      case "movies":
        return <MoviesPage onPlay={handlePlay} />;
      case "series":
        return <SeriesPage onPlay={handlePlay} />;
      default:
        return <HomePage onPlay={handlePlay} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#101114] text-white">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeNav={activeNav}
        onNavChange={setActiveNav}
      />
      <div className="md:ml-[200px] min-h-screen">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <main className="pt-11 md:pt-10">
          {renderContent()}
        </main>
      </div>
      <MobileNav activeNav={activeNav} onNavChange={setActiveNav} />
      <div className="md:hidden fixed bottom-[56px] left-0 right-0 z-40">
        <DownloadBar />
      </div>
    </div>
  );
}

export default App;
