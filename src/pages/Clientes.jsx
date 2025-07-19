import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaTrashAlt } from 'react-icons/fa';
const API_URL = import.meta.env.VITE_API_URL;

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/clientes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const sortedClientes = response.data.sort(
                    (a, b) => new Date(b.ultimo_login || 0) - new Date(a.ultimo_login || 0)
                );

                setClientes(sortedClientes);
            } catch (err) {
                console.error('Error al obtener clientes:', err);
                setError('No se pudieron cargar los clientes.');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchClientes();
        } else {
            setError('No hay token de autenticación.');
            setLoading(false);
        }
    }, [token]);

    const eliminarCliente = async (id) => {
        const resultado = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará permanentemente al cliente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e3342f',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!resultado.isConfirmed) return;

        try {
            await axios.delete(`${API_URL}/api/auth/clientes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setClientes((prev) => prev.filter((c) => c.id !== id));

            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El cliente ha sido eliminado correctamente.',
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el cliente.',
            });
        }
    };

    const filteredClientes = clientes.filter((cliente) =>
        `${cliente.nombre} ${cliente.apellidos} ${cliente.email}`.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
    const paginatedClientes = filteredClientes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => setCurrentPage(page);
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const cerrarVistaClientes = () => {
        navigate('/dashboard-admin');
    };

    const tiempoDesde = (fecha) => {
        if (!fecha) return 'Sin actividad';
        const ahora = new Date();
        const ultima = new Date(fecha);
        const diffMs = ahora - ultima;

        const segundos = Math.floor(diffMs / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        const dias = Math.floor(horas / 24);

        if (dias > 0) return `hace ${dias} día${dias > 1 ? 's' : ''}`;
        if (horas > 0) return `hace ${horas} hora${horas > 1 ? 's' : ''}`;
        if (minutos > 0) return `hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
        return 'hace unos segundos';
    };

    if (loading) return <p className="text-gray-600 text-center mt-10">Cargando clientes...</p>;
    if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

    return (
        <div className="p-6 max-w-6xl mx-auto relative">
            <button
                onClick={cerrarVistaClientes}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold"
                aria-label="Cerrar"
            >
                ×
            </button>

            <h2 className="text-2xl font-semibold mb-12 text-center">Lista de Clientes</h2>

            <div className="mb-8 flex justify-center">
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellidos o email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 w-full max-w-md"
                />
            </div>

            {filteredClientes.length === 0 ? (
                <p className="text-gray-600 text-center">No hay clientes registrados.</p>
            ) : (
                <>
                    <div className="overflow-x-auto mb-6">
                        <table className="min-w-full text-sm text-left border border-gray-200">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-6 py-3">Nombre</th>
                                    <th className="px-6 py-3">Apellidos</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Celular</th>
                                    <th className="px-6 py-3">DNI</th>
                                    <th className="px-6 py-3">Estado</th>
                                    <th className="px-6 py-3">Última actividad</th>
                                    <th className="px-6 py-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedClientes.map((cliente) => (
                                    <tr key={cliente.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">{cliente.nombre}</td>
                                        <td className="px-6 py-4">{cliente.apellidos}</td>
                                        <td className="px-6 py-4">{cliente.email}</td>
                                        <td className="px-6 py-4">{cliente.celular}</td>
                                        <td className="px-6 py-4">{cliente.dni}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block w-3 h-3 rounded-full mr-2 ${cliente.activo ? 'bg-green-500' : 'bg-red-500'
                                                    }`}
                                                title={cliente.activo ? 'Activo' : 'Inactivo'}
                                            ></span>
                                            <span className={cliente.activo ? 'text-green-600' : 'text-red-600'}>
                                                {cliente.activo ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{tiempoDesde(cliente.ultimo_login)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => eliminarCliente(cliente.id)}
                                                className="text-red-600 hover:text-red-800 text-lg"
                                                title="Eliminar cliente"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label htmlFor="itemsPerPage">Mostrar:</label>
                            <select
                                id="itemsPerPage"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                className="border rounded px-2 py-1"
                            >
                                <option value={5}>5</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                            <span>clientes por página</span>
                        </div>

                        <div className="flex gap-1 flex-wrap">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`px-3 py-1 rounded border ${currentPage === index + 1
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Clientes;
