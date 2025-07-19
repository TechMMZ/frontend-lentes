import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaTh } from "react-icons/fa";

const API_URL = "http://localhost:7500/api/productos";
const IMG_BASE_URL = "http://localhost:7500/img/";
const ITEMS_PER_PAGE = 12;

const VerMas = () => {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionTitle, setSectionTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = window.innerWidth < 768;
  const [columnas, setColumnas] = useState(isMobile ? "2" : "4");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const filtrados = data.filter((p) => p.seccion === id);
        setProductos(filtrados);

        if (filtrados.length > 0) {
          setSectionTitle(filtrados[0].nombre_seccion);
        } else {
          setSectionTitle(
            id
              .replace(/[-_]/g, " ")
              .toLowerCase()
              .replace(/\b\w/g, (c) => c.toUpperCase())
          );
        }

        setCurrentPage(1); // Reinicia al cambiar sección
      })
      .catch(() => {
        setProductos([]);
        setSectionTitle(
          id
            .replace(/[-_]/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase())
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  const totalPages = Math.ceil(productos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const productosPaginados = productos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  let gridColsClass = "grid-cols-1";
  if (columnas === "2") {
    gridColsClass = "grid-cols-2";
  } else if (columnas === "4") {
    gridColsClass = "grid-cols-1 sm:grid-cols-2 md:grid-cols-4";
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-center mt-10 sm:mt-14">{sectionTitle}</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setColumnas("2")}
            className={`p-2 rounded ${columnas === "2" ? "bg-black text-white" : "bg-gray-200 text-gray-800"}`}
            aria-label="Vista de 2 columnas"
          >
            <FaTh />
          </button>
          <button
            onClick={() => setColumnas("4")}
            className={`p-2 rounded ${columnas === "4" ? "bg-black text-white" : "bg-gray-200 text-gray-800"}`}
            aria-label="Vista de 4 columnas"
          >
            <FaTh className="scale-110" />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className="text-center text-red-500">No hay productos en esta sección.</p>
      ) : (
        <>
          <div className={`grid ${gridColsClass} gap-6`}>
            {productosPaginados.map((product) => {
              const precioNormal = Number(product.precio_normal);
              const precioOferta = product.precio_oferta !== null ? Number(product.precio_oferta) : null;
              const estaEnOferta = product.en_oferta === 1 || product.en_oferta === true;
              const agotado = product.en_stock === 0 || product.en_stock === false;

              return (
                <Link
                  to={`/producto/${product.id}`}
                  key={product.id}
                  className="group relative cursor-pointer rounded-lg shadow-lg overflow-hidden bg-white"
                  aria-label={`Ver detalles del producto ${product.nombre}`}
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
                      src={`${IMG_BASE_URL}${product.imagen_1}`}
                      alt={product.nombre}
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                      loading="lazy"
                    />
                    <img
                      src={`${IMG_BASE_URL}${product.imagen_2}`}
                      alt={`${product.nombre} hover`}
                      className="absolute top-0 left-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      loading="lazy"
                    />
                  </div>

                  <p className="text-center mt-2 font-semibold text-lg">{product.nombre}</p>

                  <p className={`text-center ${estaEnOferta ? "text-gray-600 line-through text-sm" : "text-black font-bold text-lg"}`}>
                    S/ {precioNormal.toFixed(2)}
                  </p>

                  {estaEnOferta && precioOferta !== null && !isNaN(precioOferta) && (
                    <p className="text-center text-green-600 font-bold text-lg">S/ {precioOferta.toFixed(2)}</p>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Paginación actualizada */}
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-300"}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VerMas;
