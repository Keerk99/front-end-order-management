import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeaderSection from "./components/Layouts/Header";
import Main from "./components/Layouts/Main";
import Footer from "./components/Layouts/Footer";
import MyOrders from "./pages/MyOrders";

function App() {
  return (
    <Router>
      <HeaderSection />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
