import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Geology from "./pages/Geology";
import Fossils from "./pages/Fossils";
import Contact from "./pages/Contact";
import Vlm from "./pages/Vlm";
// -jr Loaded on demand: the lab brings three.js (~600 KB), which no other
// page needs.
const Lab = lazy(() => import("./pages/Lab"));
import { LanguageProvider } from "./contexts/LanguageContext";

import "./styles/global.css";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
      <div className="app-layout">
        <Navbar />

        <div style={{ flex: 1, paddingBottom: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tani" element={<Fossils />} />
            <Route path="/vlm" element={<Vlm />} />
            <Route path="/hakkinda" element={<About />} />
            <Route path="/jeoloji" element={<Geology />} />
            <Route
              path="/lab"
              element={
                <Suspense fallback={null}>
                  <Lab />
                </Suspense>
              }
            />
            <Route path="/iletisim" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;