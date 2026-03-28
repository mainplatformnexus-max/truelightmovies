import { useState, useEffect } from "react";
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
import { ProfilePage } from "./pages/ProfilePage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { TopRatedPage } from "./pages/TopRatedPage";
import { WatchHistoryPage } from "./pages/WatchHistoryPage";
import type { ContentItem } from "./lib/types";
import { useAuth } from "./contexts/AuthContext";
import { useContent } from "./lib/useContent";

const ADMIN_EMAIL = "mainplatform.nexus@gmail.com";
const VJ_EMAIL = "vjemmatruelightstudios@gmail.com";

function App() {
  const { profile, loading } = useAuth();
  const { all } = useContent();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [selectedMovie, setSelectedMovie] = useState<ContentItem | null>(null);
  const [historyPlayId, setHistoryPlayId] = useState<string | null>(null);

  const isAdmin = profile?.email === ADMIN_EMAIL;
  const isVJ = profile?.email === VJ_EMAIL;
  const canAccessVJDashboard = isVJ || isAdmin;

  useEffect(() => {
    if (!loading) {
      if (activeNav === "admin-dashboard" && !isAdmin) setActiveNav("home");
      if (activeNav === "vj-dashboard" && !canAccessVJDashboard) setActiveNav("home");
    }
  }, [activeNav, isAdmin, canAccessVJDashboard, loading]);

  const handlePlay = (movie: ContentItem) => {
    setSelectedMovie(movie);
    setHistoryPlayId(null);
    setActiveNav("play");
  };

  const handleBack = () => setActiveNav("home");

  // Handle playing from Watch History by contentId
  useEffect(() => {
    if (activeNav === "play" && historyPlayId && !selectedMovie) {
      const found = all.find(m => m.id === historyPlayId);
      if (found) {
        setSelectedMovie(found);
        setHistoryPlayId(null);
      }
    }
  }, [activeNav, historyPlayId, all, selectedMovie]);

  const handleHistoryPlay = (contentId: string) => {
    const found = all.find(m => m.id === contentId);
    if (found) {
      setSelectedMovie(found);
      setHistoryPlayId(null);
    } else {
      setHistoryPlayId(contentId);
    }
    setActiveNav("play");
  };

  // Full-screen pages (no layout)
  if (activeNav === "vj-dashboard" && canAccessVJDashboard) {
    return <VJDashboard onBack={() => setActiveNav("home")} />;
  }
  if (activeNav === "admin-dashboard" && isAdmin) {
    return <AdminDashboard onBack={() => setActiveNav("home")} />;
  }
  if (activeNav === "play" && selectedMovie) {
    return <PlayPage movie={selectedMovie} onBack={handleBack} />;
  }

  const sidebarProps = {
    isOpen: sidebarOpen,
    onClose: () => setSidebarOpen(false),
    activeNav,
    onNavChange: setActiveNav,
    isAdmin,
    canAccessVJDashboard,
  };

  const renderContent = () => {
    switch (activeNav) {
      case "movies":      return <MoviesPage onPlay={handlePlay} />;
      case "series":      return <SeriesPage onPlay={handlePlay} />;
      case "categories":  return <CategoriesPage onPlay={handlePlay} />;
      case "top-rated":   return <TopRatedPage onPlay={handlePlay} />;
      case "history":     return <WatchHistoryPage onPlay={handleHistoryPlay} />;
      case "profile":     return <ProfilePage />;
      default:            return <HomePage onPlay={handlePlay} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#101114] text-white">
      <Sidebar {...sidebarProps} />
      <div className="md:ml-[200px] min-h-screen">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <main className="pt-11 md:pt-10">
          {renderContent()}
        </main>
      </div>
      <MobileNav activeNav={activeNav} onNavChange={setActiveNav} isAdmin={isAdmin} isVJ={isVJ} />
      <div className="md:hidden fixed bottom-[56px] left-0 right-0 z-40">
        <DownloadBar />
      </div>
    </div>
  );
}

export default App;
