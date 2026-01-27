import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import CreateStory from "./pages/CreateStory";
import StoryViewer from "./pages/StoryViewer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root URL to Login for now */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

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
