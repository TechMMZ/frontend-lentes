    import React from 'react';
    import { useNavigate } from 'react-router-dom';

    // Importar imágenes locales
    import img01 from '../assets/img-01.jpg';
    import img02 from '../assets/img-02.jpg';
    import img03 from '../assets/img-03.jpg';
    import img04 from '../assets/img-04.jpg';
    import img05 from '../assets/img-05.jpg';
    import img06 from '../assets/img-06.jpg';

    const imagenes = [
    { id: 1, imagen: img01, nombre: 'Clasicos', ruta: '/categoria/clasicos' },
    { id: 2, imagen: img02, nombre: 'Deportivos', ruta: '/categoria/deportivos' },
    { id: 3, imagen: img03, nombre: 'Elegantes', ruta: '/categoria/elegantes' },
    { id: 4, imagen: img04, nombre: 'Lo nuevo', ruta: '/categoria/lonuevo' },
    { id: 5, imagen: img05, nombre: 'Mujer', ruta: '/categoria/mujer' },
    { id: 6, imagen: img06, nombre: 'Hombre', ruta: '/categoria/hombre' },
    ];

    function GaleriaLentes() {
    const navigate = useNavigate();

    const manejarNavegacion = (ruta) => {
        navigate(ruta);
    };

    return (
        <section className="py-10 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
            Galería de Lentes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {imagenes.map((item, index) => (
            <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
                onClick={() => manejarNavegacion(item.ruta)}
            >
                {/* Imagen con efecto */}
                <div className="aspect-[3/4] w-full relative">
                <img
                    src={item.imagen}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2500ms] ease-in-out"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-10 pointer-events-none" />
                </div>

                {/* Enlace visible y con estilo */}
                <div
                className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 text-center"
                onClick={(e) => {
                    e.stopPropagation();
                    manejarNavegacion(item.ruta);
                }}
                >
                <a
                    href="#"
                    className="text-blue-700 text-lg font-bold underline hover:text-blue-900 transition"
                >
                    {item.nombre}
                </a>
                </div>

                {/* Botón Explorar */}
                <div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20"
                onClick={(e) => {
                    e.stopPropagation();
                    manejarNavegacion(item.ruta);
                }}
                >
                <button className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition">
                    Explorar
                </button>
                </div>
            </div>
            ))}
        </div>
        </section>
    );
    }

    export default GaleriaLentes;
    //                     </p>