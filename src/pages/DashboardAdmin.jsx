import React, { useState, useContext } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { UserContext } from '../pages/UserContext';
import {
  ArrowRightOnRectangleIcon,
  HomeIcon,
  UsersIcon,
  Cog6ToothIcon,
  Bars3Icon,
  PhotoIcon,
  CubeIcon,
  PlusIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

function DashboardAdmin() {
  const navigate = useNavigate();
  const { logoutUser } = useContext(UserContext);
  const [collapsed, setCollapsed] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:7500/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      localStorage.removeItem('token');
      if (logoutUser) logoutUser();
      navigate('/login?role=admin', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      localStorage.removeItem('token');
      if (logoutUser) logoutUser();
      navigate('/login?role=admin', { replace: true });
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: HomeIcon, to: '/dashboard-admin' },
    { isDivider: true },
    { name: 'Clientes', icon: UserGroupIcon, to: '/dashboard-admin/clientes' },
    { name: 'Usuarios', icon: UsersIcon, to: '/dashboard-admin/usuarios' },
    { name: 'Configuración', icon: Cog6ToothIcon, to: '/dashboard-admin/configuracion' },
    { name: 'Editar Hero Background', icon: PhotoIcon, to: '/dashboard-admin/hero-background' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 transition-all duration-300 ease-in-out h-full fixed top-0 left-0 z-20 shadow-md overflow-hidden ${collapsed ? 'w-16' : 'w-64'
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            {!collapsed && <h1 className="text-xl font-bold text-blue-400">Admin Panel</h1>}
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-2 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              if (item.isDivider) {
                return (
                  <div key="productos-menu" className="px-2">
                    <button
                      onClick={() => setIsProductsOpen((prev) => !prev)}
                      className={`flex items-center w-full py-3 rounded-lg gap-4 font-medium transition
                        text-gray-300 hover:bg-gray-800 hover:text-white
                        ${collapsed ? 'justify-center px-0 mx-0' : 'px-2'}`}
                      title={collapsed ? 'Productos' : undefined}
                      type="button"
                    >
                      <CubeIcon className="h-5 w-5" />
                      {!collapsed && <span className="flex-1">Productos</span>}
                      {!collapsed &&
                        (isProductsOpen ? (
                          <ChevronDownIcon className="h-4 w-4" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4" />
                        ))}
                    </button>

                    {!collapsed && isProductsOpen && (
                      <div className="ml-8 space-y-1">
                        <NavLink
                          to="/dashboard-admin/productos/agregar"
                          className={({ isActive }) =>
                            `flex items-center py-2 text-sm rounded-lg gap-3 font-medium transition-all ${isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            } px-2`
                          }
                        >
                          <PlusIcon className="h-4 w-4" />
                          Agregar Productos
                        </NavLink>

                        <NavLink
                          to="/dashboard-admin/productos/ver"
                          className={({ isActive }) =>
                            `flex items-center py-2 text-sm rounded-lg gap-3 font-medium transition-all ${isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            } px-2`
                          }
                        >
                          <EyeIcon className="h-4 w-4" />
                          Ver Productos
                        </NavLink>

                        <NavLink
                          to="/dashboard-admin/productos/inventario"
                          className={({ isActive }) =>
                            `flex items-center py-2 text-sm rounded-lg gap-3 font-medium transition-all ${isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            } px-2`
                          }
                        >
                          <CubeIcon className="h-4 w-4" />
                          Inventario
                        </NavLink>

                        <NavLink
                          to="/dashboard-admin/productos/categorias"
                          className={({ isActive }) =>
                            `flex items-center py-2 text-sm rounded-lg gap-3 font-medium transition-all ${isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            } px-2`
                          }
                        >
                          <CubeIcon className="h-4 w-4" />
                          Categorías
                        </NavLink>
                      </div>
                    )}
                  </div>
                );
              }

              const { name, icon: Icon, to } = item;
              return (
                <NavLink
                  key={name}
                  to={to}
                  onClick={() => setIsProductsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center py-3 rounded-lg gap-4 font-medium transition-all ${isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    } ${collapsed ? 'justify-center px-0 mx-0' : 'px-4 mx-2'}`
                  }
                  title={collapsed ? name : undefined}
                  end={to === '/dashboard-admin'}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Icon className="h-5 w-5" />
                  {!collapsed && <span>{name}</span>}
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="mt-auto mb-4 px-2">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`flex items-center w-full py-3 px-4 rounded-lg gap-4 font-medium transition
                bg-gray-800 text-red-400 hover:bg-red-600 hover:text-white
                ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? 'Cerrar Sesión' : undefined}
              type="button"
              style={{ whiteSpace: 'nowrap' }}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              {!collapsed && <span>Cerrar Sesión</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Layout */}
      <div
        className="flex flex-col flex-1 min-h-screen bg-gray-100"
        style={{ marginLeft: collapsed ? '4rem' : '16rem' }}
      >
        <header
          className="bg-gray-900 text-white px-4 h-14 flex items-center justify-between shadow-md fixed top-0 right-0 z-50 transition-all duration-300"
          style={{
            marginLeft: collapsed ? '4rem' : '16rem',
            width: `calc(100% - ${collapsed ? '4rem' : '16rem'})`,
          }}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-blue-300 hover:bg-gray-800 p-2 rounded transition"
            aria-label="Toggle Sidebar"
            type="button"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold text-blue-400">Panel de Administración</h2>
          <div />
        </header>

        <main
          className="flex-1 pt-16 p-6 overflow-y-auto text-gray-900"
          style={{ height: 'calc(100vh - 56px)' }}
        >
          <Outlet />
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-gray-800">
            <h3 className="text-lg font-semibold mb-4">¿Cerrar sesión?</h3>
            <p className="mb-6">¿Estás seguro que deseas cerrar sesión?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardAdmin;
