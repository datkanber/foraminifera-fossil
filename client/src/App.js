import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Predict from "./components/Predict.js"; 

function App() {
  const isPredictPage = window.location.pathname === "/predict";

  return (
    <div className="app-layout">
      <Navbar />
      {isPredictPage ? <Predict /> : <Home />}
      <Footer />
    </div>
  );
}

export default App;