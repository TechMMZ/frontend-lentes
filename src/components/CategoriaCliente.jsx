import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaTh } from 'react-icons/fa';

const API_BASE = 'http://localhost:7500/api/productos';
const IMG_BASE_URL = 'http://localhost:7500/img/';
const PRODUCTOS_POR_PAGINA = 12;

function normalizeCategoria(str) {
    const s = str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (["lonuevo", "lo nuevo", "lo_nuevo", "lo-nuevo"].includes(s)) return "lo_nuevo";
    if (["masvendidos", "mas vendidos", "mas_vendidos", "mas-vendidos"].includes(s)) return "mas_vendidos";
    if (["finalsale", "final sale", "final_sale", "final-sale"].includes(s)) return "final_sale";
    if (["vertodo", "ver todo", "ver_todo", "ver-todo"].includes(s)) return "vertodo";

    return s.replace(/[\s-]+/g, "_");
}

function Categoria() {
    const { categoria } = useParams();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [paginaActual, setPaginaActual] = useState(1);
    const isMobile = window.innerWidth < 768;
    const [columnas, setColumnas] = useState(isMobile ? '1' : '4');

    useEffect(() => {
        if (!categoria) return;

        const catNormalized = normalizeCategoria(categoria);
        setLoading(true);
        setError(null);

        const url = catNormalized === "vertodo"
            ? `${API_BASE}`
            : `${API_BASE}/seccion/${catNormalized}`;

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`Error al cargar productos: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setProductos(data);
                setPaginaActual(1); // Reinicia la página cuando cambia la categoría
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [categoria]);

    const totalPaginas = Math.ceil(productos.length / PRODUCTOS_POR_PAGINA);
    const indiceInicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const productosPagina = productos.slice(indiceInicio, indiceInicio + PRODUCTOS_POR_PAGINA);

    const nombreSeccion = categoria.toLowerCase() === "vertodo"
        ? "👓 Lentes 👓"
        : (productos[0]?.nombre_seccion || categoria.replace(/-/g, ' '));

    let gridColsClass = 'grid-cols-1';
    if (columnas === '2') {
        gridColsClass = 'grid-cols-2';
    } else if (columnas === '4') {
        gridColsClass = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4';
    }

    if (loading) return <div className="p-6 text-center">Cargando productos...</div>;
    if (error) return <div className="p-6 text-center text-red-600">Error: {error}</div>;
    if (productos.length === 0) {
        return (
            <div className="p-6 text-center text-gray-600">
                No hay productos en la categoría "{categoria.replace(/-/g, ' ')}"
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Título y botones */}
            <div className="flex flex-col items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold text-center mt-10 sm:mt-14">{nombreSeccion}</h1>

                {/* Botones para cambiar vista */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setColumnas('2')}
                        className={`p-2 rounded ${columnas === '2' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}
                        aria-label="Vista 2 columnas"
                    >
                        <FaTh />
                    </button>
                    <button
                        onClick={() => setColumnas('4')}
                        className={`p-2 rounded ${columnas === '4' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}
                        aria-label="Vista 4 columnas"
                    >
                        <FaTh className="scale-110" />
                    </button>
                </div>
            </div>

            {/* Grid de productos */}
            <div className={`grid ${gridColsClass} gap-6`}>
                {productosPagina.map((prod) => {
                    const precioNormal = Number(prod.precio_normal);
                    const precioOferta = prod.precio_oferta !== null ? Number(prod.precio_oferta) : null;
                    const estaEnOferta = prod.en_oferta === 1 || prod.en_oferta === true;
                    const agotado = prod.en_stock === 0 || prod.en_stock === false;

                    return (
                        <Link
                            to={`/producto/${prod.id}`}
                            key={prod.id}
                            className="group relative cursor-pointer rounded-lg shadow-lg overflow-hidden bg-white"
                            aria-label={`Ver detalles del producto ${prod.nombre}`}
                        >
                            {estaEnOferta && (
                                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded z-30">
                                    OFERTA
                                </span>
                            )}
                            {agotado && (
                                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-30">
                                    AGOTADO
                                </span>
                            )}

                            <div className="aspect-square relative">
                                <img
                                    src={`${IMG_BASE_URL}${prod.imagen_1}`}
                                    alt={prod.nombre}
                                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                                    loading="lazy"
                                />
                                <img
                                    src={`${IMG_BASE_URL}${prod.imagen_2}`}
                                    alt={`${prod.nombre} hover`}
                                    className="absolute top-0 left-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                    loading="lazy"
                                />
                            </div>

                            <p className="text-center mt-2 font-semibold text-lg">{prod.nombre}</p>

                            <p className={`text-center ${estaEnOferta ? 'text-gray-600 line-through text-sm' : 'text-black font-bold text-lg'}`}>
                                S/. {!isNaN(precioNormal) ? precioNormal.toFixed(2) : 'N/A'}
                            </p>

                            {estaEnOferta && precioOferta !== null && !isNaN(precioOferta) && (
                                <p className="text-center text-green-600 font-bold text-lg">
                                    S/. {precioOferta.toFixed(2)}
                                </p>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Paginación */}
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                <button
                    onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                    disabled={paginaActual === 1}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                    Anterior
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setPaginaActual(i + 1)}
                        className={`px-3 py-1 rounded ${paginaActual === i + 1 ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-300'}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                    disabled={paginaActual === totalPaginas}
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

export default Categoria;
