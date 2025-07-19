import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom'; // 👈 Agregado

function Categoria() {
    const [productos, setProductos] = useState([]);
    const [secciones, setSecciones] = useState([]);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [itemsPorPagina, setItemsPorPagina] = useState(5);
    const [paginaActual, setPaginaActual] = useState(1);

    const navigate = useNavigate(); // 👈 Inicializamos

    useEffect(() => {
        obtenerSecciones();
    }, []);

    useEffect(() => {
        if (seccionSeleccionada) {
            obtenerProductosPorSeccion(seccionSeleccionada);
        } else {
            setProductos([]);
        }
    }, [seccionSeleccionada]);

    const obtenerSecciones = async () => {
        try {
            const res = await axios.get('http://localhost:7500/api/productos');
            const todas = res.data.map(p => p.seccion);
            const unicas = [...new Set(todas)];
            setSecciones(unicas);
        } catch (err) {
            console.error('Error al obtener secciones:', err);
        }
    };

    const obtenerProductosPorSeccion = async (seccion) => {
        try {
            const res = await axios.get(`http://localhost:7500/api/productos/seccion/${seccion}`);
            setProductos(res.data);
            setPaginaActual(1);
        } catch (err) {
            console.error('Error al obtener productos por sección:', err);
        }
    };

    const handleCerrar = () => {
        navigate('/dashboard-admin'); // 👈 Redirección
    };

    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);
    const productosPaginados = productosFiltrados.slice(
        (paginaActual - 1) * itemsPorPagina,
        paginaActual * itemsPorPagina
    );

    const cambiarPagina = (direccion) => {
        if (direccion === 'anterior' && paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
        } else if (direccion === 'siguiente' && paginaActual < totalPaginas) {
            setPaginaActual(paginaActual + 1);
        }
    };

    return (
        <div className="relative p-6 rounded-md shadow-lg border border-gray-200 bg-transparent">
            {/* Botón cerrar que redirige */}
            <button
                onClick={handleCerrar}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
                <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-center">Productos por Sección</h2>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <select
                    className="p-2 border border-gray-300 rounded shadow-sm"
                    value={seccionSeleccionada}
                    onChange={(e) => setSeccionSeleccionada(e.target.value)}
                >
                    <option value="">Seleccione una sección</option>
                    {secciones.map((sec, idx) => (
                        <option key={idx} value={sec}>
                            {sec}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="🔍 Buscar producto..."
                    className="p-2 border border-gray-300 rounded shadow-sm w-full sm:w-64"
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setPaginaActual(1);
                    }}
                />

                <select
                    className="p-2 border border-gray-300 rounded shadow-sm"
                    value={itemsPorPagina}
                    onChange={(e) => {
                        setItemsPorPagina(Number(e.target.value));
                        setPaginaActual(1);
                    }}
                >
                    {[5, 10, 15].map(num => (
                        <option key={num} value={num}>{num} por página</option>
                    ))}
                </select>
            </div>

            {productosFiltrados.length > 0 ? (
                <div className="overflow-auto">
                    <table className="w-full border-collapse border border-gray-200 text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-2 border">#</th>
                                <th className="p-2 border">Nombre</th>
                                <th className="p-2 border">Imagen</th>
                                <th className="p-2 border">Precio</th>
                                <th className="p-2 border">Oferta</th>
                                <th className="p-2 border">Stock</th>
                                <th className="p-2 border">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosPaginados.map((producto, index) => (
                                <tr key={producto.id} className="hover:bg-gray-50">
                                    <td className="p-2 border">{(paginaActual - 1) * itemsPorPagina + index + 1}</td>
                                    <td className="p-2 border">{producto.nombre}</td>
                                    <td className="p-2 border">
                                        <img
                                            src={`http://localhost:7500/img/${producto.imagen_1}`}
                                            alt={producto.nombre}
                                            className="w-14 h-14 object-contain mx-auto"
                                        />
                                    </td>
                                    <td className="p-2 border">
                                        {producto.en_oferta
                                            ? <span className="line-through text-gray-400">S/.{parseFloat(producto.precio_normal).toFixed(2)}</span>
                                            : <span>S/.{parseFloat(producto.precio_normal).toFixed(2)}</span>}
                                    </td>
                                    <td className="p-2 border text-center">
                                        {producto.en_oferta
                                            ? <span className="text-green-600 font-bold">S/.{parseFloat(producto.precio_oferta).toFixed(2)}</span>
                                            : '—'}
                                    </td>
                                    <td className="p-2 border text-center">
                                        {producto.en_stock ? 'Disponible' : 'Agotado'}
                                    </td>
                                    <td className="p-2 border text-center">{producto.cantidad}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                seccionSeleccionada && <p className="text-gray-500 mt-4 text-center">No hay productos en esta sección.</p>
            )}

            {/* Controles de paginación */}
            {totalPaginas > 1 && (
                <div className="flex justify-center mt-6 gap-4 items-center">
                    <button
                        onClick={() => cambiarPagina('anterior')}
                        disabled={paginaActual === 1}
                        className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        ⬅ Anterior
                    </button>
                    <span>Página {paginaActual} de {totalPaginas}</span>
                    <button
                        onClick={() => cambiarPagina('siguiente')}
                        disabled={paginaActual === totalPaginas}
                        className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Siguiente ➡
                    </button>
                </div>
            )}
        </div>
    );
}

export default Categoria;
