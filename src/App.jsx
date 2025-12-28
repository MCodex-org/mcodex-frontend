import { Outlet, ScrollRestoration } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const App = () => {
  
  return (
    <div className="min-h-screen">
      <aside></aside>
      <NavBar />
      <main className="pt-16">
        <Outlet />
        <Toaster position="bottom-left" />
        <ScrollRestoration getKey={(location) => location.pathname} />
      </main>
      <Footer />
    </div>
  );
};

export default App;