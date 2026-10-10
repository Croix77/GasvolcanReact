import NavbarApp from "./components/NavbarApp";
import Bienvenida from "./components/Bienvenida";
import ProductCard from "./components/ProductCard";

function App() {
  return (
    <>
      <NavbarApp />
      <main className="container py-4">
        <Bienvenida />
        <div className="row g-4 mt-3">
          <div className="col-12 col-md-6 col-lg-4">
            <ProductCard />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;