import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CreateStory from "./pages/CreateStory";
import StoryViewer from "./pages/StoryViewer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root URL to Login for now */}
        <Route path="/" element={<Navigate to="/create-story" replace />} />

        {/* Story Routes */}
        <Route path="/create-story" element={<CreateStory />} />
        <Route path="/story-view" element={<StoryViewer />} />

        {/* Placeholder for Dashboard */}
        <Route
          path="/dashboard"
          element={<div>Dashboard Coming Soon...</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
