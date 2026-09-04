import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateStory from "./pages/CreateStory";
import StoryViewer from "./pages/StoryViewer";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root URL to Login for now */}
        <Route path="/" element={<LandingPage />} />

        {/* Story Routes */}
        <Route path="/dashboard" element={<CreateStory />} />
        <Route path="/story-view" element={<StoryViewer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
