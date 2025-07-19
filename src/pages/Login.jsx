import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserContext } from './UserContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [celular, setCelular] = useState('');
  const [dni, setDni] = useState('');
  const [error, setError] = useState('');
  const [registrando, setRegistrando] = useState(false);
  const [adminExiste, setAdminExiste] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useContext(UserContext);

  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') || 'cliente';
  const view = queryParams.get('view');

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('http://localhost:7500/api/auth/admin-existe');
        const data = await res.json();
        setAdminExiste(data.existe);
      } catch (err) {
        console.error('Error verificando admin:', err);
      }
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    if (role === 'admin' && adminExiste) {
      setRegistrando(false);
    } else {
      setRegistrando((role === 'cliente' && view === 'registro') || (role === 'admin' && !adminExiste));
    }
    setError('');
    setShowPassword(false);
    window.scrollTo(0, 0);
  }, [role, view, adminExiste]);

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor, ingrese correo y contraseña.');
      return;
    }

    try {
      const res = await fetch('http://localhost:7500/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || 'Usuario o contraseña incorrectos');

      loginUser(data.usuario);
      localStorage.setItem('token', data.token);

      navigate(data.usuario.role === 'admin' ? '/dashboard-admin' : '/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre || !apellidos || !email || !password || !celular || !dni) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const res = await fetch('http://localhost:7500/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellidos, email, password, celular, dni, role }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || 'Error al registrar');

      navigate('/login?role=cliente');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-12 bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          {registrando
            ? `Registro ${role === 'admin' ? 'de Admin' : 'de Cliente'}`
            : `Iniciar Sesión (${role})`}
        </h2>

        <form onSubmit={registrando ? handleRegistro : handleLogin} noValidate>
          {registrando && (
            <>
              <label className="block mb-4">
                <span className="text-gray-700 font-semibold">Nombre</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </label>

              <label className="block mb-4">
                <span className="text-gray-700 font-semibold">Apellidos</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  required
                />
              </label>

              <label className="block mb-4">
                <span className="text-gray-700 font-semibold">Celular</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  required
                />
              </label>

              <label className="block mb-4">
                <span className="text-gray-700 font-semibold">DNI</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  required
                />
              </label>
            </>
          )}

          <label className="block mb-4">
            <span className="text-gray-700 font-semibold">Correo electrónico</span>
            <input
              type="email"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-700 font-semibold">Contraseña</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="mt-1 w-full rounded-md border px-3 py-2 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-600"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </label>

          {error && <p className="mb-4 text-center text-red-600 font-semibold">{error}</p>}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded"
          >
            {registrando ? 'Registrarse' : 'Iniciar Sesión'}
          </button>
        </form>

        {role === 'cliente' && (
          <p className="mt-6 text-center text-sm text-gray-600">
            {registrando ? (
              <>
                ¿Ya tienes cuenta?{' '}
                <Link to="/login?role=cliente" className="text-red-600 hover:underline">
                  Inicia sesión
                </Link>
              </>
            ) : (
              <>
                ¿No tienes cuenta?{' '}
                <Link to="/login?role=cliente&view=registro" className="text-red-600 hover:underline">
                  Regístrate aquí
                </Link>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
