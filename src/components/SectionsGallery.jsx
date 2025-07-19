import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:7500/api/productos";
const IMG_BASE_URL = "http://localhost:7500/img/";

const SECCIONES_MOSTRAR = ["lo_nuevo", "mas_vendidos", "final_sale"];

const SectionsGallery = () => {
  const [productsBySection, setProductsBySection] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Error en la respuesta: ${res.status}`);
        return res.json();
      })
      .then((products) => {
        const grouped = products.reduce((acc, product) => {
          if (!acc[product.seccion]) acc[product.seccion] = [];
          acc[product.seccion].push(product);
          return acc;
        }, {});
        const filtered = {};
        SECCIONES_MOSTRAR.forEach((sec) => {
          if (grouped[sec]) filtered[sec] = grouped[sec];
        });
        setProductsBySection(filtered);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando productos...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;
  if (Object.keys(productsBySection).length === 0)
    return <p className="text-center mt-10">No hay productos para mostrar.</p>;

  return (
    <>
      {Object.entries(productsBySection).map(([sectionKey, products]) => (
        <SectionGallery
          key={sectionKey}
          title={products[0]?.nombre_seccion || sectionKey}
          sectionId={sectionKey}
          products={products}
          navigate={navigate}
        />
      ))}
    </>
  );
};

const SectionGallery = ({ title, products, sectionId, navigate }) => {
  const getItemsPerPage = () => (window.innerWidth < 670 ? 1 : window.innerWidth < 1024 ? 2 : 4);

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const isMobile = itemsPerPage === 1;

  useEffect(() => {
    const savedIndices = JSON.parse(sessionStorage.getItem("carouselIndices") || "{}");
    if (savedIndices[sectionId] !== undefined) {
      setCurrentIndex(savedIndices[sectionId]);
      setTimeout(() => scrollToIndex(savedIndices[sectionId]), 0);
    }

    const savedScroll = sessionStorage.getItem(`scrollPos_${sectionId}`);
    if (savedScroll && scrollRef.current) {
      scrollRef.current.scrollLeft = parseInt(savedScroll, 10);
    }
  }, [sectionId]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
      setCurrentIndex(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToIndex = (index) => {
    const container = scrollRef.current;
    if (!container) return;

    const child = container.children[index];
    if (child) {
      container.scrollTo({
        left: child.offsetLeft,
        behavior: "smooth",
      });
    }
  };

  const handlePrev = () => {
    const newIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const maxIndex = products.length - itemsPerPage;
    const newIndex = Math.min(currentIndex + 1, maxIndex);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handleVerMasClick = () => {
    const savedIndices = JSON.parse(sessionStorage.getItem("carouselIndices") || "{}");
    savedIndices[sectionId] = currentIndex;
    sessionStorage.setItem("carouselIndices", JSON.stringify(savedIndices));

    if (scrollRef.current) {
      sessionStorage.setItem(`scrollPos_${sectionId}`, scrollRef.current.scrollLeft);
    }

    navigate(`/seccion/${sectionId}`);
  };

  return (
    <section className="my-12 px-4 md:px-12 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 capitalize">{title}</h2>

      <div className="relative flex items-center justify-center">
        {!isMobile && (
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="hidden md:flex absolute -left-16 z-20 p-3 bg-white rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50"
            style={{ top: "50%", transform: "translateY(-50%)" }}
            aria-label="Anterior"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x scroll-smooth gap-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => {
            const precioNormal = Number(product.precio_normal);
            const precioOferta = product.precio_oferta !== null ? Number(product.precio_oferta) : null;
            const estaEnOferta = product.en_oferta === 1 || product.en_oferta === true;
            const agotado = product.en_stock === 0 || product.en_stock === false;

            return (
              <div
                key={product.id}
                onClick={() => navigate(`/producto/${product.id}`)}
                className="group relative cursor-pointer rounded-lg shadow-lg bg-white overflow-hidden flex-shrink-0 snap-start"
                style={{
                  flex: `0 0 ${isMobile ? "100%" : `calc(${100 / itemsPerPage}% - 1rem)`}`,
                }}
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
                {estaEnOferta && (
                  <p className="text-center text-green-600 font-bold text-lg">
                    S/ {precioOferta?.toFixed(2)}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {!isMobile && (
          <button
            onClick={handleNext}
            disabled={currentIndex >= products.length - itemsPerPage}
            className="hidden md:flex absolute -right-16 z-20 p-3 bg-white rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50"
            style={{ top: "50%", transform: "translateY(-50%)" }}
            aria-label="Siguiente"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleVerMasClick}
          className="relative overflow-hidden border border-black text-black font-semibold px-6 py-2 rounded-md group"
        >
          <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
            Ver más
          </span>
          <span className="absolute inset-0 bg-black scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700 ease-in-out z-0"></span>
        </button>
      </div>
    </section>
  );
};

export default SectionsGallery;
