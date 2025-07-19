import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../pages/UserContext";
import { useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart, FaCog, FaSignOutAlt } from "react-icons/fa";

function PerfilCliente() {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("datos");

  useEffect(() => {
    if (!user) {
      navigate("/login?role=cliente");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("http://localhost:7500/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    }

    logoutUser(); // Limpia el contexto
    localStorage.removeItem("token"); // Limpia el token
    navigate("/login?role=cliente"); // Redirige al login
  };

  if (!user) return null;

  const renderSection = () => {
    switch (activeSection) {
      case "datos":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Datos personales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base text-gray-700">
              <div>
                <p className="font-semibold">Nombre:</p>
                <p>{user.nombre || "No registrado"}</p>
              </div>
              <div>
                <p className="font-semibold">Apellidos:</p>
                <p>{user.apellidos || "No registrado"}</p>
              </div>
              <div>
                <p className="font-semibold">DNI / Documento:</p>
                <p>{user.dni || "No disponible"}</p>
              </div>
              <div>
                <p className="font-semibold">Celular:</p>
                <p>{user.celular || "No registrado"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="font-semibold">Correo electrónico:</p>
                <p>{user.email}</p>
              </div>
            </div>
          </div>
        );
      case "compras":
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Historial de Compras</h2>
            <p className="text-base text-gray-600">Aquí iría la lista de tus compras (a implementar).</p>
          </div>
        );
      case "configuracion":
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configuración de la Cuenta</h2>
            <p className="text-base text-gray-600">Opciones de configuración próximamente.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-gray-200 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-gray-100 p-8">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-gray-800">
              ¡Hola, <span className="text-blue-600">{user.nombre}</span>!
            </h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <nav className="space-y-3">
            <button
              onClick={() => setActiveSection("datos")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeSection === "datos"
                ? "bg-blue-600 text-white font-semibold shadow-md"
                : "bg-white hover:bg-blue-100 text-gray-700"
                }`}
            >
              <FaUser /> Mi perfil
            </button>
            <button
              onClick={() => setActiveSection("compras")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeSection === "compras"
                ? "bg-blue-600 text-white font-semibold shadow-md"
                : "bg-white hover:bg-blue-100 text-gray-700"
                }`}
            >
              <FaShoppingCart /> Mis compras
            </button>
            <button
              onClick={() => setActiveSection("configuracion")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeSection === "configuracion"
                ? "bg-blue-600 text-white font-semibold shadow-md"
                : "bg-white hover:bg-blue-100 text-gray-700"
                }`}
            >
              <FaCog /> Configuración
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mt-6 bg-red-100 text-red-600 hover:bg-red-200 transition"
            >
              <FaSignOutAlt /> Cerrar sesión
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10 bg-white overflow-y-auto">{renderSection()}</main>
      </div>
    </div>
  );
}

export default PerfilCliente;
