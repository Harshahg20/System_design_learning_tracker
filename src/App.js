import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import LearningPage from "./pages/LearningPage";
import Achievements from "./pages/Achivements";
import Module from "./pages/Module";

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/module/:moduleId" element={<Module />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
