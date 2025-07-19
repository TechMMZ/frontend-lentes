import React, { useEffect, useState, Fragment, useContext } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCarrito } from "./CarritoContext";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../pages/UserContext";
const API_URL = import.meta.env.VITE_API_URL;

function Carrito() {
    const navigate = useNavigate();
    const [modalAbierto, setModalAbierto] = useState(false);
    const { carrito, aumentarCantidad, disminuirCantidad, eliminarProducto } = useCarrito();
    const { user } = useContext(UserContext);
    const estaLogueado = user?.role === "cliente";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const abrirModal = () => setModalAbierto(true);
    const cerrarModal = () => setModalAbierto(false);
    const irALogin = () => navigate("/login?role=cliente");

    // Generar mensaje de WhatsApp dinámico
    const generarMensajeWhatsApp = () => {
        let mensaje = "Hola, quiero hacer una compra:\n";
        carrito.forEach((item) => {
            mensaje += `- ${item.cantidad}x ${item.nombre} - S/ ${(item.precio * item.cantidad).toFixed(2)}\n`;
        });
        mensaje += `Total: S/ ${total.toFixed(2)}`;
        return encodeURIComponent(mensaje);
    };

    const pagarConTarjeta = async () => {
        try {
            const response = await fetch(`${API_URL}/pago`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ carrito }),
            });

            const data = await response.json();

            if (data.init_point) {
                window.location.href = data.init_point; // Redirige a Mercado Pago
            } else {
                alert('Error iniciando el pago');
            }
        } catch (error) {
            console.error('Error al pagar:', error);
            alert('Hubo un problema al procesar el pago.');
        }
    };

    return (
        <div className="pt-24 px-4 max-w-7xl mx-auto min-h-screen">
            <h1 className="text-3xl font-bold mb-6">
                Carrito ({carrito.length} producto{carrito.length !== 1 ? "s" : ""})
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Lista de productos */}
                <div className="flex-1 space-y-6">
                    {carrito.length === 0 ? (
                        <p className="text-gray-500">Tu carrito está vacío.</p>
                    ) : (
                        carrito.map((item) => {
                            const tieneOferta = item.precio_normal && item.precio < item.precio_normal;
                            return (
                                <div
                                    key={item.id}
                                    className="border rounded-xl shadow p-4 flex flex-wrap sm:flex-nowrap items-center gap-4 bg-white"
                                >
                                    <img
                                        src={`${API_URL}/img/${item.imagen}`}
                                        alt={item.nombre}
                                        className="w-24 h-24 object-contain rounded-lg"
                                    />
                                    <div className="flex-1 min-w-[150px]">
                                        <p className="font-semibold text-lg">{item.nombre}</p>
                                        {tieneOferta ? (
                                            <div className="mt-1 text-sm">
                                                <p className="text-gray-400 line-through">S/ {Number(item.precio_normal).toFixed(2)}</p>
                                                <p className="text-red-600 font-semibold">S/ {item.precio.toFixed(2)} c/u</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-700 text-sm mt-1">S/ {item.precio.toFixed(2)} c/u</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            aria-label={`Disminuir cantidad de ${item.nombre}`}
                                            className="p-1 border rounded hover:bg-gray-100"
                                            onClick={() => disminuirCantidad(item.id)}
                                            disabled={item.cantidad <= 1}
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-6 text-center">{item.cantidad}</span>
                                        <button
                                            aria-label={`Aumentar cantidad de ${item.nombre}`}
                                            className="p-1 border rounded hover:bg-gray-100"
                                            onClick={() => aumentarCantidad(item.id)}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <p className="font-bold text-gray-700 whitespace-nowrap">
                                        S/ {(item.precio * item.cantidad).toFixed(2)}
                                    </p>

                                    <button
                                        aria-label={`Eliminar ${item.nombre} del carrito`}
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => eliminarProducto(item.id)}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Resumen */}
                <div className="w-full lg:w-96 border rounded-xl shadow p-6 bg-white h-fit">
                    <h2 className="text-xl font-semibold mb-4">Resumen de la orden</h2>
                    <div className="flex justify-between mb-2 text-gray-700">
                        <span>Productos ({carrito.length})</span>
                        <span>S/ {total.toFixed(2)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-lg mb-4">
                        <span>Total:</span>
                        <span>S/ {total.toFixed(2)}</span>
                    </div>

                    {estaLogueado ? (
                        <div className="space-y-3">
                            <button
                                disabled={carrito.length === 0}
                                className={`w-full py-3 rounded-lg text-white bg-green-600 hover:bg-green-700 ${carrito.length === 0 ? "opacity-50 cursor-not-allowed hover:bg-green-600" : ""
                                    }`}
                                onClick={() =>
                                    window.open(
                                        `https://wa.me/51999999999?text=${generarMensajeWhatsApp()}`,
                                        "_blank"
                                    )
                                }
                            >
                                Comprar por WhatsApp
                            </button>

                            <button
                                disabled={carrito.length === 0}
                                className={`w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 ${carrito.length === 0 ? "opacity-50 cursor-not-allowed hover:bg-blue-600" : ""
                                    }`}
                                onClick={pagarConTarjeta}
                            >
                                Pagar con Tarjeta (Mercado Pago)
                            </button>

                            <button
                                disabled={carrito.length === 0}
                                className={`w-full py-3 rounded-lg text-white bg-purple-600 hover:bg-purple-700 ${carrito.length === 0 ? "opacity-50 cursor-not-allowed hover:bg-purple-600" : ""
                                    }`}
                                onClick={() => navigate("/pago-yape")}
                            >
                                Pagar con Yape
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                                disabled={carrito.length === 0}
                                onClick={abrirModal}
                            >
                                Continuar compra
                            </button>
                            <div className="mt-4 bg-purple-100 text-purple-800 text-sm p-3 rounded-lg">
                                ¡Ahora puedes pagar tus compras con <strong>Yape</strong>!
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}
            <Transition appear show={modalAbierto} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={cerrarModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-200"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-100"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title className="text-lg font-bold leading-6 text-gray-900">
                                        Iniciar sesión requerido
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Antes de continuar con tu compra, por favor inicia sesión o crea una cuenta como cliente.
                                        </p>
                                    </div>
                                    <div className="mt-4 flex justify-end gap-2">
                                        <button
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                                            onClick={cerrarModal}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                                            onClick={irALogin}
                                        >
                                            Iniciar sesión
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default Carrito;
