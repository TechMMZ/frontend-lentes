    import React, { useEffect, useRef, useState } from 'react';
    import { FaSearch, FaTimes } from 'react-icons/fa';
    import { useNavigate } from 'react-router-dom';

    const imagenes = [
    { id: 1, nombre: 'Clásicos', ruta: '/categoria/clasicos' },
    { id: 2, nombre: 'Deportivos', ruta: '/categoria/deportivos' },
    { id: 3, nombre: 'Elegantes', ruta: '/categoria/elegantes' },
    { id: 4, nombre: 'Lo nuevo', ruta: '/categoria/lonuevo' },
    { id: 5, nombre: 'Mujer', ruta: '/categoria/mujer' },
    { id: 6, nombre: 'Hombre', ruta: '/categoria/hombre' },
    { id: 7, nombre: 'Unisex', ruta: '/categoria/unisex' },
    ];

    function SearchBox({
    search,
    setSearch,
    className = '',
    autoFocus = true,
    onClose = () => {},
    }) {
    const boxRef = useRef(null);
    const navigate = useNavigate();
    const [resultados, setResultados] = useState([]);
    const clickedInside = useRef(false);

    // Cierre personalizado: limpia búsqueda y cierra
    const handleClose = () => {
        setSearch('');
        onClose();
    };

    // Cerrar al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
        if (!clickedInside.current && boxRef.current && !boxRef.current.contains(event.target)) {
            handleClose();
        }
        clickedInside.current = false;
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Actualiza resultados al cambiar el texto
    useEffect(() => {
        const texto = (search || '').trim().toLowerCase();

        if (!texto) {
        setResultados([]);
        return;
        }

        const activarBusquedaGlobal = texto.startsWith('len') || texto.startsWith('lentes');

        if (activarBusquedaGlobal) {
        setResultados(imagenes); // Mostrar todas
        } else {
        const coincidencias = imagenes.filter((item) =>
            item.nombre.toLowerCase().includes(texto)
        );
        setResultados(coincidencias);
        }
    }, [search]);

    // Selección de resultado
    const handleSeleccion = (ruta) => {
        navigate(ruta);
        setSearch(''); // Limpia buscador
        onClose();     // Cierra buscador
    };

    return (
        <div
        ref={boxRef}
        className={`w-72 sm:w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-black ${className}`}
        >
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">Buscar</h2>
            <button
            onClick={(e) => {
                e.stopPropagation();
                handleClose();
            }}
            aria-label="Cerrar buscador"
            className="text-gray-500 hover:text-red-500 transition-colors"
            >
            <FaTimes />
            </button>
        </div>

        {/* Input */}
        <div className="flex items-center border rounded-full px-3 py-2 bg-gray-100 shadow-inner">
            <FaSearch className="text-gray-500 mr-2" />
            <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar productos..."
            className="bg-transparent outline-none w-full text-sm"
            autoFocus={autoFocus}
            aria-label="Campo de búsqueda"
            onClick={() => (clickedInside.current = true)}
            />
        </div>

        {/* Resultados */}
        {resultados.length > 0 && (
            <ul className="mt-3 max-h-60 overflow-y-auto border-t border-gray-200 pt-2">
            {resultados.map((item) => (
                <li
                key={item.id}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded text-sm"
                onMouseDown={() => {
                    clickedInside.current = true;
                    handleSeleccion(item.ruta);
                }}
                >
                {item.nombre}
                </li>
            ))}
            </ul>
        )}

        {/* Sin resultados */}
        {search.trim() !== '' && resultados.length === 0 && (
            <p className="mt-3 text-sm text-gray-500 text-center">
            No se encontraron coincidencias.
            </p>
        )}
        </div>
    );
    }

    export default SearchBox;
