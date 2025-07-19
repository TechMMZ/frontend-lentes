    import React, { useState, useEffect, useRef, useContext } from 'react';
    import { FaUser, FaShoppingCart, FaSearch, FaBars, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
    import { useNavigate, Link } from 'react-router-dom';
    import { UserContext } from '../pages/UserContext'; // Ajusta la ruta si es necesario
    import logo from '../assets/LOGO SUNCITY black_.png';
    import logoWhite from '../assets/LOGO SUNCITY blanco.png'; // Importa el logo blanco
    import SearchBox from './SearchBox';
    import { useCarrito } from './CarritoContext'; // Ajusta la ruta según corresponda



    const menuItems = [
    {
        title: 'Tienda',
        link: '#',
        submenu: [
        { title: 'Clásicos', link: '/categoria/clasicos' },
        { title: 'Deportivos', link: '/categoria/deportivos' },
        { title: 'Elegantes', link: '/categoria/elegantes' },
        { title: 'Ver Todo', link: '/categoria/vertodo' },
        ],
    },
    {
        title: 'Lo Nuevo',
        link: '/categoria/lonuevo',
    },
    {
        title: 'Lentes de Sol',
        link: '#',
        submenu: [
        { title: 'Hombre', link: '/categoria/hombre' },
        { title: 'Mujer', link: '/categoria/mujer' },
        { title: 'Unisex', link: '/categoria/unisex' },
        ],
    },
    {
        title: 'Monturas',
        link: '/categoria/monturas',
    },
    ];

    function Header() {
    const [search, setSearch] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showSearchMobile, setShowSearchMobile] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [sidebarActive, setSidebarActive] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState({});
    const searchRef = useRef(null);
    const userMenuRef = useRef(null);
    const submenuTimeouts = useRef({});
    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [showSearchDesktop, setShowSearchDesktop] = useState(false);
    const { carrito } = useCarrito();
    const totalCantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);


    // Cerrar menús si clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setShowSearchMobile(false);
        }
        if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
            setShowUserMenu(false);
        }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Control animación sidebar
    useEffect(() => {
        if (sidebarVisible && !sidebarActive) {
        // Pequeño delay para animación
        const timer = setTimeout(() => setSidebarActive(true), 10);
        return () => clearTimeout(timer);
        }
        if (!sidebarVisible && sidebarActive) {
        setSidebarActive(false);
        }
    }, [sidebarVisible, sidebarActive]);

    // Desmontar sidebar tras animación (cuando termina de ocultarse)
    useEffect(() => {
        function handleTransitionEnd(e) {
        if (e.target === sidebarRef.current && !sidebarActive) {
            setSidebarVisible(false);
        }
        }
        const node = sidebarRef.current;
        if (node) {
        node.addEventListener('transitionend', handleTransitionEnd);
        return () => node.removeEventListener('transitionend', handleTransitionEnd);
        }
    }, [sidebarActive]);

    const toggleSidebar = () => {
        if (sidebarVisible) {
        setSidebarActive(false);
        } else {
        setSidebarVisible(true);
        }
    };

    const toggleSubmenuMobile = (index) => {
        setOpenSubmenus((prev) => ({
        ...prev,
        [index]: !prev[index],
        }));
    };

    const handleMouseEnter = (index) => {
        clearTimeout(submenuTimeouts.current[index]);
        setOpenSubmenus((prev) => ({ ...prev, [index]: true }));
    };

    const handleMouseLeave = (index) => {
        submenuTimeouts.current[index] = setTimeout(() => {
        setOpenSubmenus((prev) => ({ ...prev, [index]: false }));
        }, 200);
    };

    return (
        <header className="fixed top-0 left-0 w-full shadow-md z-50 bg-white">
        <div className="bg-black text-white text-center text-sm py-1">
            🔥 ENCUENTRA AQUÍ LOS LENTES QUE TANTO BUSCABAS A UN PRECIO CÓMODO 🔥
        </div>

        <div className="bg-white px-4 py-3 flex items-center justify-between relative">
            {/* Menú hamburguesa móvil */}
            <div className="md:hidden">
            <button
                aria-label="Abrir menú"
                onClick={toggleSidebar}
                className="text-gray-600 text-xl focus:outline-none"
            >
                <FaBars />
            </button>
            </div>

            {/* Logo */}
            <div
            className="flex justify-center w-full md:w-auto cursor-pointer"
            onClick={() => navigate('/')}
            aria-label="Ir al inicio"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter') navigate('/');
            }}
            >
            <img src={logo} alt="SUNCITY" className="h-8 object-contain mx-auto" />
            </div>

            <div className="flex items-center gap-4 md:hidden relative" ref={searchRef}>
            <button
                onClick={() => setShowSearchMobile(!showSearchMobile)}
                aria-label="Buscar"
                type="button"
                className="text-gray-600 text-xl"
            >
                <FaSearch />
            </button>

            {showSearchMobile && (
                <div className="absolute top-10 right-0 w-72 bg-white shadow-lg rounded-md z-50">
                <SearchBox
                    search={search}
                    setSearch={setSearch}
                    onClose={() => setShowSearchMobile(false)}
                />
                </div>
            )}

            <div className="relative cursor-pointer" onClick={() => navigate('/carrito')}>
                <FaShoppingCart className="text-xl text-gray-700" />
                {totalCantidad > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                    {totalCantidad}
                </span>
                )}
            </div>
            </div>


            {/* Navegación escritorio */}
            <div className="hidden md:flex items-center justify-between w-full max-w-6xl mx-auto px-4">
            <nav className="flex gap-10 mx-auto text-sm font-semibold text-gray-800" role="menubar">
                {menuItems.map((item, index) => (
                <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => item.submenu && handleMouseEnter(index)}
                    onMouseLeave={() => item.submenu && handleMouseLeave(index)}
                >
                    {item.link === '#' ? (
                    <button
                        type="button"
                        className="transition duration-300 hover:text-red-600"
                        aria-haspopup={!!item.submenu}
                        aria-expanded={openSubmenus[index] ? 'true' : 'false'}
                        role="menuitem"
                    >
                        {item.title}
                    </button>
                    ) : (
                    <Link to={item.link} className="transition duration-300 hover:text-red-600" role="menuitem">
                        {item.title}
                    </Link>
                    )}

                    {item.submenu && openSubmenus[index] && (
                    <div
                        className="absolute top-full left-0 bg-white shadow-md rounded-md mt-2 py-2 w-40"
                        onMouseEnter={() => clearTimeout(submenuTimeouts.current[index])}
                        onMouseLeave={() => handleMouseLeave(index)}
                        role="menu"
                    >
                        {item.submenu.map((subItem, subIndex) =>
                        subItem.link === '#' ? (
                            <button
                            key={subIndex}
                            type="button"
                            className="block px-4 py-2 hover:bg-red-100 hover:text-red-600 transition-colors duration-200 w-full text-left"
                            onClick={() => {}}
                            role="menuitem"
                            >
                            {subItem.title}
                            </button>
                        ) : (
                            <Link
                            key={subIndex}
                            to={subItem.link}
                            className="block px-4 py-2 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                            role="menuitem"
                            >
                            {subItem.title}
                            </Link>
                        )
                        )}
                    </div>
                    )}
                </div>
                ))}
            </nav>

                <div className="relative mr-4" ref={searchRef}>
                <button
                    onClick={() => setShowSearchDesktop(!showSearchDesktop)}
                    aria-label="Buscar"
                    type="button"
                    className="text-gray-600 text-xl"
                >
                    <FaSearch />
                </button>

                {showSearchDesktop && (
                    <div className="absolute top-10 right-0 w-72 bg-white shadow-lg rounded-md z-50">
                    <SearchBox
                        search={search}
                        setSearch={setSearch}
                        onClose={() => setShowSearchDesktop(false)}
                    />
                    </div>
                )}
                </div>

            {/* Carrito */}
            <div className="relative cursor-pointer mr-4" role="button" tabIndex={0} aria-label="Ir al carrito"
                onClick={() => navigate('/carrito')}
                onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/carrito');
                }
                }}>
            <FaShoppingCart className="text-xl text-gray-700" />
            {totalCantidad > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {totalCantidad}
                </span>
            )}
            </div>


            {/* Menú usuario */}
            <div className="relative" ref={userMenuRef}>
                <FaUser
                className="text-xl text-gray-600 cursor-pointer"
                onClick={() => setShowUserMenu((prev) => !prev)}
                aria-label="Menú usuario"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') setShowUserMenu((prev) => !prev);
                }}
                />

                {showUserMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white border shadow-md rounded-md text-sm z-30" role="menu">
                    {user ? (
                    <>
                        <button
                        onClick={() => {
                            navigate('/perfil-cliente');
                            setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                        role="menuitem"
                        >
                        {user.nombre}
                        </button>
                    </>
                    ) : (
                    <>
                        <button
                        onClick={() => {
                            setShowUserMenu(false);
                            navigate('/login?role=admin');
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                        role="menuitem"
                        >
                        Admin
                        </button>
                        <button
                        onClick={() => {
                            setShowUserMenu(false);
                            navigate('/login?role=cliente');
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                        role="menuitem"
                        >
                        Cliente
                        </button>
                    </>
                    )}
                </div>
                )}
            </div>
            </div>
        </div>

        {/* Sidebar móvil con animación suave */}
        {(sidebarVisible || sidebarActive) && (
            <div
            className={`fixed inset-0 bg-black bg-opacity-80 z-40 transition-opacity duration-300 ease-in-out ${
                sidebarActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => {
                setSidebarActive(false);
            }}
            aria-hidden="true"
            />
        )}

        {(sidebarVisible || sidebarActive) && (
            <aside
            ref={sidebarRef}
            className={`fixed top-0 left-0 h-full w-64 bg-black text-white shadow-md z-50 p-4 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
                sidebarActive ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
            aria-label="Menú lateral"
            >
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
            <img
                src={logoWhite}
                alt="SUNCITY"
                className="h-8 cursor-pointer"
                onClick={() => {
                navigate('/');
                setSidebarActive(false);
                setSidebarVisible(false);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    navigate('/');
                    setSidebarActive(false);
                    setSidebarVisible(false);
                }
                }}
            />
            <button
                className="text-xl cursor-pointer focus:outline-none"
                onClick={() => {
                setSidebarActive(false);
                setSidebarVisible(false);
                }}
                aria-label="Cerrar menú"
            >
                <FaTimes />
            </button>
            </div>
            <nav>
                {menuItems.map((item, index) => (
                <div key={index} className="mb-3 border-b border-gray-700 pb-3 last:border-0 last:pb-0">
                <div
                className="flex justify-between items-center cursor-pointer px-2 py-1 font-semibold hover:text-red-400"
                onClick={() => {
                    if (item.submenu) {
                    toggleSubmenuMobile(index);
                    } else {
                    setSidebarActive(false);
                    setSidebarVisible(false);
                    if (item.link && item.link !== '#') {
                        navigate(item.link);
                    }
                    }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                    if (item.submenu) {
                        toggleSubmenuMobile(index);
                    } else {
                        setSidebarActive(false);
                        setSidebarVisible(false);
                        if (item.link && item.link !== '#') {
                        navigate(item.link);
                        }
                    }
                    }
                }}
                >
                <span>{item.title}</span>
                {item.submenu && <span className="ml-2">{openSubmenus[index] ? <FaMinus /> : <FaPlus />}</span>}
                </div>

                    <div
                    className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${
                        openSubmenus[index] ? 'max-h-40' : 'max-h-0'
                    }`}
                    >
                    {item.submenu &&
                        item.submenu.map((subItem, subIndex) => (
                        <button
                            key={subIndex}
                            type="button"
                            className="block w-full text-left px-2 py-1 hover:text-red-400 border-b border-gray-700 last:border-0"
                            onClick={() => {
                            setSidebarActive(false);
                            setSidebarVisible(false);
                            if (subItem.link !== '#') {
                                navigate(subItem.link);
                            }
                            }}
                        >
                            {subItem.title}
                        </button>
                        ))}
                    </div>
                </div>
                ))}
            </nav>

            <div className="mt-6 border-t border-gray-700 pt-4">
                {user ? (
                <button
                    onClick={() => {
                    navigate('/perfil-cliente');
                    setSidebarActive(false);
                    setSidebarVisible(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-300 hover:text-red-400"
                >
                    {user.nombre}
                </button>
                ) : (
                <>
                    <button
                    onClick={() => {
                        navigate('/login?role=admin');
                        setSidebarActive(false);
                        setSidebarVisible(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:text-red-400"
                    >
                    Admin
                    </button>
                    <button
                    onClick={() => {
                        navigate('/login?role=cliente');
                        setSidebarActive(false);
                        setSidebarVisible(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:text-red-400"
                    >
                    Cliente
                    </button>
                </>
                )}
            </div>
            </aside>
        )}
        </header>
    );
    }

    export default Header;
