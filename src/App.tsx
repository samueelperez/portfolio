// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CybersecurityLibrary from "./pages/LearningJournal";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cybersecurity-library" element={<CybersecurityLibrary />} />
      </Routes>
    </Router>
  );
};

export default App;
