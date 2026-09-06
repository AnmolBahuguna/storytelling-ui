import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import CreateStory from "./pages/CreateStory";
import StoryViewer from "./pages/StoryViewer";
import LandingPage from "./pages/LandingPage";
import { StarsBackground } from "./components/animate-ui/components/backgrounds/stars-light";

function AppBackground() {
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <StarsBackground
      className="pointer-events-none fixed inset-0 z-20 h-screen w-screen opacity-90 mix-blend-screen"
      speed={25}
      starColor="#ffffff"
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen">
        <AppBackground />
        <div className="relative z-10">
          <Routes>
            {/* Redirect root URL to Login for now */}
            <Route path="/" element={<LandingPage />} />

            {/* Story Routes */}
            <Route path="/dashboard" element={<CreateStory />} />
            <Route path="/story-view" element={<StoryViewer />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
