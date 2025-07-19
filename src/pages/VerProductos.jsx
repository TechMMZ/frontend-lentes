import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrashAlt, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const API_URL_SECCIONES = 'http://localhost:7500/api/secciones';
const API_URL_PRODUCTOS = 'http://localhost:7500/api/productos';
const IMG_BASE_URL = 'http://localhost:7500/img/';

const VerProductos = () => {
    const navigate = useNavigate();

    const [secciones, setSecciones] = useState([]);
    const [productos, setProductos] = useState([]);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
    const [loadingProductos, setLoadingProductos] = useState(false);
    const [error, setError] = useState(null);

    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [mostrarAcciones, setMostrarAcciones] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [confirmarEliminar, setConfirmarEliminar] = useState(false);
    const [exito, setExito] = useState(false);
    const [exitoEliminar, setExitoEliminar] = useState(false);

    const [form, setForm] = useState({
        nombre: '',
        precio_normal: '',
        precio_oferta: '',
        en_oferta: false,
        en_stock: false,
        cantidad: '',
    });

    useEffect(() => {
        const fetchSecciones = async () => {
            try {
                const res = await fetch(API_URL_SECCIONES);
                if (!res.ok) throw new Error('Error al cargar secciones');
                const data = await res.json();
                setSecciones(data);
            } catch (err) {
                setSecciones([]);
                setError('Error al cargar secciones');
            }
        };
        fetchSecciones();
    }, []);

    const handleSeleccionSeccion = async (seccion) => {
        setSeccionSeleccionada(seccion);
        setProductos([]);
        setError(null);
        setLoadingProductos(true);
        try {
            const res = await fetch(`${API_URL_PRODUCTOS}?seccion=${seccion}`);
            if (!res.ok) throw new Error('Error al cargar productos');
            const data = await res.json();
            setProductos(data);
        } catch {
            setError('Error al cargar productos');
        } finally {
            setLoadingProductos(false);
        }
    };

    const abrirModalAcciones = (producto) => {
        setProductoSeleccionado(producto);
        setMostrarAcciones(true);
    };

    const abrirModalEdicion = () => {
        if (!productoSeleccionado) return;
        setForm({
            nombre: productoSeleccionado.nombre || '',
            precio_normal: productoSeleccionado.precio_normal?.toString() || '',
            precio_oferta: productoSeleccionado.precio_oferta?.toString() || '',
            en_oferta: productoSeleccionado.en_oferta === 1 || productoSeleccionado.en_oferta === true,
            en_stock: productoSeleccionado.en_stock === 1 || productoSeleccionado.en_stock === true,
            cantidad: productoSeleccionado.cantidad?.toString() || '0',
        });
        setModoEdicion(true);
        setMostrarAcciones(false);
    };

    const abrirModalEliminar = () => {
        setConfirmarEliminar(true);
        setMostrarAcciones(false);
    };

    const handleGuardarCambios = async () => {
        if (!form.nombre.trim()) {
            alert('El nombre no puede estar vacío');
            return;
        }
        if (isNaN(parseFloat(form.precio_normal))) {
            alert('El precio normal debe ser un número válido');
            return;
        }
        if (form.en_oferta && (form.precio_oferta === '' || isNaN(parseFloat(form.precio_oferta)))) {
            alert('El precio de oferta debe ser un número válido');
            return;
        }

        try {
            const actualizado = {
                ...productoSeleccionado,
                nombre: form.nombre.trim(),
                precio_normal: parseFloat(form.precio_normal),
                precio_oferta: form.en_oferta ? parseFloat(form.precio_oferta) : null,
                en_oferta: form.en_oferta,
                en_stock: form.en_stock,
                cantidad: parseInt(form.cantidad),
            };

            const res = await fetch(`${API_URL_PRODUCTOS}/${productoSeleccionado.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(actualizado),
            });

            if (!res.ok) throw new Error('Error al actualizar producto');

            const productoActualizado = await res.json();
            setProductos(productos.map(p => (p.id === productoActualizado.id ? productoActualizado : p)));

            setModoEdicion(false);
            setProductoSeleccionado(null);
            setExito(true);
            setTimeout(() => setExito(false), 3000);
        } catch {
            alert('Error al actualizar');
        }
    };

    const handleEliminarProducto = async () => {
        if (!productoSeleccionado) return;
        try {
            const res = await fetch(`${API_URL_PRODUCTOS}/${productoSeleccionado.id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Error al eliminar');
            setProductos(productos.filter(p => p.id !== productoSeleccionado.id));
            cerrarModales();
            setExitoEliminar(true);
            setTimeout(() => setExitoEliminar(false), 3000);
        } catch {
            alert('Error al eliminar');
        }
    };

    // Función que cierra todo y redirige a /dashboard-admin
    const cerrarTodo = () => {
        navigate('/dashboard-admin');
    };

    // Función que solo cierra el modal de edición y resetea el formulario
    const cerrarModal = () => {
        setModoEdicion(false);
        setProductoSeleccionado(null);
        setForm({
            nombre: '',
            precio_normal: '',
            precio_oferta: '',
            en_oferta: false,
            en_stock: false,
        });
    };

    // Función que cierra todos los modales relacionados a acciones y elimina y resetea formulario
    const cerrarModales = () => {
        setProductoSeleccionado(null);
        setModoEdicion(false);
        setMostrarAcciones(false);
        setConfirmarEliminar(false);
        setForm({
            nombre: '',
            precio_normal: '',
            precio_oferta: '',
            en_oferta: false,
            en_stock: false,
        });
    };

    // NUEVA función que solo limpia productos y sección seleccionada
    const cerrarProductos = () => {
        setSeccionSeleccionada(null);
        setProductos([]);
        setError(null);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto font-sans relative">

            {/* X grande superior derecha - Cierra todo (redirige) */}
            <button
                onClick={cerrarTodo}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                aria-label="Cerrar"
            >
                ×
            </button>

            <h1 className="text-4xl font-extrabold text-center mb-8">Ver Productos por Sección</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                {secciones.map((item) => {
                    const isSelected = item.seccion === seccionSeleccionada;
                    return (
                        <motion.div
                            key={item.seccion}
                            onClick={() => handleSeleccionSeccion(item.seccion)}
                            className={`flex items-center p-4 rounded-xl border cursor-pointer transition-shadow ${isSelected ? 'bg-green-100 border-green-600 shadow-lg' : 'hover:shadow-md'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div
                                className={`w-5 h-5 mr-3 rounded-full border-2 ${isSelected ? 'bg-green-600 border-green-600' : 'border-gray-400'
                                    }`}
                            />
                            <span
                                className={`text-lg font-semibold ${isSelected ? 'text-green-700' : 'text-gray-700'
                                    }`}
                            >
                                {item.nombre_seccion}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* NUEVA X para cerrar solo los productos */}
            {seccionSeleccionada && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={cerrarProductos}
                        className="text-gray-600 hover:text-gray-900 text-xl font-bold px-3 py-1 border rounded-md"
                        aria-label="Cerrar productos"
                        title="Cerrar productos"
                    >
                        ×
                    </button>
                </div>
            )}

            <AnimatePresence>
                {loadingProductos && (
                    <motion.p
                        className="text-center text-gray-600 text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        Cargando productos...
                    </motion.p>
                )}

                {error && (
                    <motion.p
                        className="text-center text-red-600 text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {error}
                    </motion.p>
                )}

                {!loadingProductos && productos.length > 0 && (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {productos.map((producto) => {
                            const estaEnOferta = producto.en_oferta === 1 || producto.en_oferta === true;
                            const estaEnStock = producto.en_stock === 1 || producto.en_stock === true;
                            return (
                                <div
                                    key={producto.id}
                                    className="group relative rounded-lg shadow-md bg-white cursor-pointer"
                                    onClick={() => abrirModalAcciones(producto)}
                                >
                                    {estaEnOferta && (
                                        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded z-30">
                                            OFERTA
                                        </span>
                                    )}
                                    {!estaEnStock && (
                                        <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-30">
                                            AGOTADO
                                        </span>
                                    )}
                                    <div className="aspect-square relative">
                                        <img
                                            src={`${IMG_BASE_URL}${producto.imagen_1}`}
                                            alt={producto.nombre}
                                            className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300"
                                        />
                                        <img
                                            src={`${IMG_BASE_URL}${producto.imagen_2}`}
                                            alt={`${producto.nombre} hover`}
                                            className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>
                                    <div className="p-4 text-center">
                                        <h2 className="font-bold text-lg">{producto.nombre}</h2>
                                        {estaEnOferta ? (
                                            <>
                                                <p className="line-through text-gray-500 text-sm">S/. {Number(producto.precio_normal).toFixed(2)}</p>
                                                <p className="text-green-600 font-bold text-xl">S/. {Number(producto.precio_oferta).toFixed(2)}</p>
                                            </>
                                        ) : (
                                            <p className="font-bold text-black text-lg">S/. {Number(producto.precio_normal).toFixed(2)}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </motion.div>
                )}

                {!loadingProductos && productos.length === 0 && seccionSeleccionada && !error && (
                    <motion.p
                        className="text-center text-gray-500 text-lg mt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        No hay productos en esta sección.
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Modal Acciones */}
            {mostrarAcciones && productoSeleccionado && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                        <button
                            onClick={cerrarModales}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                            aria-label="Cerrar"
                        >
                            <FaTimes />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-center">{productoSeleccionado.nombre}</h2>

                        <div className="flex justify-around gap-6">
                            <button
                                onClick={abrirModalEdicion}
                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                            >
                                <FaEdit /> Editar
                            </button>
                            <button
                                onClick={abrirModalEliminar}
                                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 flex items-center gap-2"
                            >
                                <FaTrashAlt /> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Edición */}
            {modoEdicion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                        <button
                            onClick={cerrarModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                            aria-label="Cerrar"
                        >
                            <FaTimes />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-center">Editar Producto</h2>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleGuardarCambios();
                            }}
                            className="flex flex-col gap-4"
                        >
                            <label className="flex flex-col">
                                Nombre
                                <input
                                    type="text"
                                    value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                    className="border p-2 rounded"
                                    required
                                />
                            </label>
                            <label className="flex flex-col">
                                Cantidad
                                <input
                                    type="number"
                                    min="0"
                                    value={form.cantidad}
                                    onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                                    className="border p-2 rounded"
                                    required
                                />
                            </label>
                            <label className="flex flex-col">
                                Precio Normal
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.precio_normal}
                                    onChange={(e) => setForm({ ...form, precio_normal: e.target.value })}
                                    className="border p-2 rounded"
                                    required
                                />
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.en_oferta}
                                    onChange={(e) => setForm({ ...form, en_oferta: e.target.checked })}
                                />
                                ¿En oferta?
                            </label>
                            {form.en_oferta && (
                                <label className="flex flex-col">
                                    Precio Oferta
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={form.precio_oferta}
                                        onChange={(e) => setForm({ ...form, precio_oferta: e.target.value })}
                                        className="border p-2 rounded"
                                        required={form.en_oferta}
                                    />
                                </label>
                            )}
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.en_stock}
                                    onChange={(e) => setForm({ ...form, en_stock: e.target.checked })}
                                />
                                ¿En stock?
                            </label>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={cerrarModal}
                                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Confirmar Eliminar */}
            {confirmarEliminar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm relative">
                        <button
                            onClick={cerrarModales}
                            className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                            aria-label="Cerrar"
                        >
                            <FaTimes />
                        </button>
                        <div className="flex flex-col items-center gap-4 text-center">
                            <FaExclamationTriangle className="text-red-600 text-4xl" />
                            <p className="text-lg font-semibold">¿Estás seguro que deseas eliminar este producto?</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={cerrarModales}
                                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleEliminarProducto}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mensajes de éxito */}
            {exito && (
                <div className="fixed bottom-5 right-5 bg-green-600 text-white p-3 rounded shadow-lg flex items-center gap-2 z-50">
                    <FaCheckCircle /> <span>Producto actualizado con éxito</span>
                </div>
            )}

            {exitoEliminar && (
                <div className="fixed bottom-5 right-5 bg-green-600 text-white p-3 rounded shadow-lg flex items-center gap-2 z-50">
                    <FaCheckCircle /> <span>Producto eliminado con éxito</span>
                </div>
            )}
        </div>
    );
};

export default VerProductos;
