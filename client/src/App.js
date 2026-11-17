import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./styles/global.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransition, { RouteProgress } from "./components/ms/PageTransition";
import Home from "./pages/Home";
import About from "./pages/About";
import Geology from "./pages/Geology";
import Fossils from "./pages/Fossils";
import Contact from "./pages/Contact";
import Vlm from "./pages/Vlm";
import ExpertValidation from "./pages/ExpertValidation";
import ExpertGuide from "./pages/ExpertGuide";
// -jr Loaded on demand: the lab brings three.js (~600 KB), which no other
// page needs.
const Lab = lazy(() => import("./pages/Lab"));
const News = lazy(() => import("./pages/News"));
const Search = lazy(() => import("./pages/Search"));
import { LanguageProvider } from "./contexts/LanguageContext";

function SiteChrome({ children }) {
  const privateWorkspace = useLocation().pathname.startsWith('/expert-validation');
  return <>{!privateWorkspace && <Navbar />}{children}{!privateWorkspace && <Footer />}</>;
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="app-layout">
          <SiteChrome>

          <div className="app-main" id="main-content" tabIndex={-1}>
            <PageTransition>
              <Suspense fallback={<RouteProgress />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/tani" element={<Fossils />} />
                  <Route path="/vlm" element={<Vlm />} />
                  <Route path="/hakkinda" element={<About />} />
                  <Route path="/jeoloji" element={<Geology />} />
                  <Route path="/lab" element={<Lab />} />
                  <Route path="/iletisim" element={<Contact />} />
                  <Route path="/haberler/:slug?" element={<News />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/arama" element={<Search />} />
                  <Route path="/expert-validation/*" element={<ExpertValidation />} />
                  <Route path="/uzman-rehberi" element={<ExpertGuide />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </PageTransition>
          </div>

          </SiteChrome>
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
