/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Estilos custom para el toast con color #161e51
const customToastStyle = {
  background: '#161e51',  // color azul oscuro pedido
  color: 'white',
  boxShadow: '0 4px 12px rgba(22, 30, 81, 0.8)',
  borderRadius: '10px',
  fontWeight: 'bold',
  fontSize: '16px',
  padding: '16px 24px',
};

export default function HeroBackgroundEdit() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    fondoGrande: null,
    fondoPequeno: null,
    anuncio: null,
  });

  const [preview, setPreview] = useState({
    fondoGrande: null,
    fondoPequeno: null,
    anuncio: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('http://localhost:7500/api/hero-background');
        if (!res.ok) throw new Error('Error cargando datos');
        const data = await res.json();

        setForm({
          title: data.title || '',
          description: data.description || '',
          fondoGrande: null,
          fondoPequeno: null,
          anuncio: null,
        });

        setPreview({
          fondoGrande: data.fondoGrande ? `http://localhost:7500/uploads/${data.fondoGrande}` : null,
          fondoPequeno: data.fondoPequeno ? `http://localhost:7500/uploads/${data.fondoPequeno}` : null,
          anuncio: data.anuncio ? `http://localhost:7500/uploads/${data.anuncio}` : null,
        });
      } catch (error) {
        toast.error('Error cargando datos', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Slide,
          style: customToastStyle,
        });
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    return () => {
      Object.values(preview).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [preview]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setForm(prev => ({ ...prev, [name]: file }));

      if (preview[name] && preview[name].startsWith('blob:')) {
        URL.revokeObjectURL(preview[name]);
      }

      setPreview(prev => ({
        ...prev,
        [name]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      if (form.fondoGrande) formData.append('fondoGrande', form.fondoGrande);
      if (form.fondoPequeno) formData.append('fondoPequeno', form.fondoPequeno);
      if (form.anuncio) formData.append('anuncio', form.anuncio);

      const res = await fetch('http://localhost:7500/api/hero-background', {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) throw new Error('Error actualizando');

      toast.success('Hero Background actualizado correctamente', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Slide,
        style: customToastStyle,
      });
    } catch {
      toast.error('Error al actualizar Hero Background', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Slide,
        style: customToastStyle,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-5xl mx-auto p-8 rounded-2xl mt-12 relative shadow-lg"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Botón cerrar */}
      <button
        onClick={() => navigate('/dashboard-admin')}
        aria-label="Cerrar editor"
        className="absolute top-5 right-5 text-gray-600 hover:text-gray-900 transition duration-300"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Título General */}
      <h1 className="text-3xl font-extrabold mb-10 text-center text-gray-900">
        Editar Hero Background
      </h1>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Título y Descripción lado a lado */}
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 flex flex-col">
            <label htmlFor="title" className="block font-semibold mb-2 text-gray-800">
              Título
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 shadow-inner placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              placeholder="Ingrese el título"
              required
              style={{ backgroundColor: 'transparent' }}
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label htmlFor="description" className="block font-semibold mb-2 text-gray-800">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 shadow-inner placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition resize-none"
              placeholder="Ingrese la descripción"
              required
              style={{ backgroundColor: 'transparent' }}
            />
          </div>
        </div>

        {/* Fondo Grande y Fondo Pequeño lado a lado */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 flex flex-col items-center">
            <label className="block font-semibold mb-3 text-gray-800">Fondo Grande</label>
            {preview.fondoGrande && (
              <img
                src={preview.fondoGrande}
                alt="Fondo Grande Preview"
                className="mb-3 rounded-lg shadow-md object-cover border border-gray-200"
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: 'auto',
                  aspectRatio: '4 / 3',
                  backgroundColor: 'transparent',
                }}
              />
            )}
            <input
              type="file"
              name="fondoGrande"
              onChange={handleFileChange}
              accept="image/*"
              className="block w-full max-w-md text-gray-700 file:border-0 file:bg-red-600 file:text-white file:px-4 file:py-2 file:rounded-md file:cursor-pointer hover:file:bg-red-700 transition"
              style={{ backgroundColor: 'transparent' }}
            />
          </div>

          <div className="flex-1 flex flex-col items-center">
            <label className="block font-semibold mb-3 text-gray-800">Fondo Pequeño</label>
            {preview.fondoPequeno && (
              <img
                src={preview.fondoPequeno}
                alt="Fondo Pequeño Preview"
                className="mb-3 rounded-lg shadow-md border border-gray-200"
                style={{
                  width: '100%',
                  maxWidth: '250px',
                  height: '250px',
                  objectFit: 'contain',
                  borderRadius: '0.5rem',
                  backgroundColor: 'transparent',
                }}
              />
            )}
            <input
              type="file"
              name="fondoPequeno"
              onChange={handleFileChange}
              accept="image/*"
              className="block w-full max-w-xs text-gray-700 file:border-0 file:bg-red-600 file:text-white file:px-4 file:py-2 file:rounded-md file:cursor-pointer hover:file:bg-red-700 transition"
              style={{ backgroundColor: 'transparent' }}
            />
          </div>
        </div>

        {/* Anuncio centrado */}
        <div className="flex flex-col items-center">
          <label className="block font-semibold mb-3 text-gray-800">Anuncio</label>
          {preview.anuncio && (
            <img
              src={preview.anuncio}
              alt="Anuncio Preview"
              className="mb-3 max-h-56 rounded-lg shadow-md object-cover border border-gray-200"
              style={{ width: 'auto', maxWidth: '100%', backgroundColor: 'transparent' }}
            />
          )}
          <input
            type="file"
            name="anuncio"
            onChange={handleFileChange}
            accept="image/*"
            className="block w-full max-w-md text-gray-700 file:border-0 file:bg-red-600 file:text-white file:px-4 file:py-2 file:rounded-md file:cursor-pointer hover:file:bg-red-700 transition"
            style={{ backgroundColor: 'transparent' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>

      {/* ToastContainer con posición mucho más abajo */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
        toastStyle={customToastStyle}
        style={{ top: '45vh', left: '50%', transform: 'translateX(-50%)' }}
      />
    </div>
  );
}
