import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
} from 'react-router-dom';

import { UserProvider } from './pages/UserContext';
import { CarritoProvider } from './components/CarritoContext';

import Header from './components/Header';
import Footer from './components/Footer';
import HeroBackground from './components/HeroBackground';
import SectionsGallery from './components/SectionsGallery';
import Login from './pages/Login';
import PerfilCliente from './pages/PerfilCliente';
import VerMas from './components/VerMas';
import ProductDetail from './components/ProductDetail';
import Carrito from './components/Carrito';

import AdminLayout from './layouts/AdminLayout';
import DashboardHome from './admin/DashboardHome';
import HeroBackgroundEdit from './pages/HeroBackgroundEdit';
import AgregarProducto from './pages/AgregarProducto';
import VerProductos from './pages/VerProductos';
import Clientes from './pages/Clientes';
import Inventario from './pages/Inventario';

// ✅ Nuevos nombres de componentes
import CategoriaCliente from './components/CategoriaCliente';
import CategoriaAdmin from './pages/CategoriaAdmin';

import WhatsAppButton from './components/WhatsAppButton';
// import Chatbot from './components/Chatbot';
import GaleriaLentes from './components/GaleriaLentes';

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PublicLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/dashboard-admin');
  const isLoginPage = location.pathname === '/login';
  const isPerfilCliente = location.pathname === '/perfil-cliente';
  const isCarritoPage = location.pathname === '/carrito';

  if (isAdminRoute) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
        {!isLoginPage && !isPerfilCliente && !isCarritoPage && <GaleriaLentes />}
      </main>
      <Footer />
      <WhatsAppButton />
      {/* <Chatbot /> */}
    </div>
  );
}

function HomePage() {
  return (
    <>
      <HeroBackground />
      <SectionsGallery />
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <CarritoProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Rutas públicas */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/perfil-cliente" element={<PerfilCliente />} />
              <Route path="/seccion/:id" element={<VerMas />} />
              <Route path="/categoria/:categoria" element={<CategoriaCliente />} /> {/* ✅ Actualizada */}
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/carrito" element={<Carrito />} />
            </Route>

            {/* Rutas admin */}
            <Route path="/dashboard-admin" element={<AdminLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="hero-background" element={<HeroBackgroundEdit />} />
              <Route path="productos/agregar" element={<AgregarProducto />} />
              <Route path="productos/ver" element={<VerProductos />} />
              <Route path="productos/inventario" element={<Inventario />} />
              <Route path="productos/categorias" element={<CategoriaAdmin />} /> {/* ✅ Agregada de nuevo */}
              <Route path="clientes" element={<Clientes />} />
              <Route
                path="*"
                element={
                  <div className="text-center p-10 text-red-500">
                    Página no encontrada en Admin
                  </div>
                }
              />
            </Route>

            {/* Página 404 general */}
            <Route
              path="*"
              element={
                <div className="text-center p-10 text-red-500">
                  Página no encontrada
                </div>
              }
            />
          </Routes>
        </Router>
      </CarritoProvider>
    </UserProvider>
  );
}

export default App;
