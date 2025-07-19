import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTruck, FaCreditCard } from "react-icons/fa";
import { PiEyeglassesBold } from "react-icons/pi";
import { Plus, Minus, CheckCircle2 } from "lucide-react";
import { useCarrito } from "../components/CarritoContext";
import { UserContext } from "../pages/UserContext";

const IMG_BASE_URL = "http://localhost:7500/img/";

const ModalCarrito = ({ producto, cantidad, onCerrar, onAumentar, onDisminuir, onIrCarrito }) => {
  if (!producto) return null;
  const precioTotal = (producto.precio * cantidad).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onCerrar}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 size={48} className="text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">Producto agregado al carrito</h2>
          <div className="flex items-center gap-4 w-full border rounded p-3">
            <img
              src={producto.imagen ? `${IMG_BASE_URL}${producto.imagen}` : ""}
              alt={producto.nombre}
              className="w-20 h-20 object-cover rounded"
              onError={e => (e.target.style.display = "none")}
            />
            <div className="flex-1">
              <p className="font-semibold">{producto.nombre}</p>
              <p className="text-gray-700">Precio unitario: S/ {producto.precio.toFixed(2)}</p>
              <p className="font-bold text-lg text-gray-900">Total: S/ {precioTotal}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <button onClick={onAumentar} className="p-1 border rounded hover:bg-gray-100" aria-label="Aumentar cantidad">
                <Plus size={16} />
              </button>
              <span className="text-lg font-semibold">{cantidad}</span>
              <button onClick={onDisminuir} className="p-1 border rounded hover:bg-gray-100" aria-label="Disminuir cantidad" disabled={cantidad <= 1}>
                <Minus size={16} />
              </button>
            </div>
          </div>
          <div className="flex gap-4 w-full mt-6">
            <button onClick={onCerrar} className="flex-1 py-2 border rounded-lg hover:bg-gray-100 transition font-medium text-sm">
              Cerrar
            </button>
            <button onClick={onIrCarrito} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm">
              Ir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalLoginRequerido = ({ visible, onCerrar, onLogin }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onCerrar}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md text-left" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold leading-6 text-gray-900">Iniciar sesión requerido</h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Antes de continuar con tu compra, por favor inicia sesión o crea una cuenta como cliente.
          </p>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCerrar} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
            Cancelar
          </button>
          <button onClick={onLogin} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700">
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { addToCart, dispatch, setCantidad } = useCarrito();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCantidad, setModalCantidad] = useState(1);
  const [mostrarEnvio, setMostrarEnvio] = useState(false);
  const [mostrarLoginModal, setMostrarLoginModal] = useState(false);

  const sesionIniciada = user?.role === "cliente";

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:7500/api/productos/${id}`);
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();
        setProduct(data);
        setMainImage(data.imagen_1 || "");
      } catch (err) {
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.en_stock === 0) return;
    const estaEnOferta = product.en_oferta === 1 || product.en_oferta === true;

    addToCart({
      id: Number(id),
      nombre: product.nombre,
      precio: estaEnOferta ? Number(product.precio_oferta) : Number(product.precio_normal),
      imagen: product.imagen_1,
    });
    setModalCantidad(1);
    setModalVisible(true);
  };

  const handleContinuarCompra = () => {
    if (!sesionIniciada) setMostrarLoginModal(true);
    else navigate("/carrito");
  };
  const handleCerrarModal = () => setModalVisible(false);
  const handleAumentarCantidad = () => {
    if (!product) return;
    const nueva = modalCantidad + 1;
    setModalCantidad(nueva);
    setCantidad(dispatch, Number(id), nueva);
  };
  const handleDisminuirCantidad = () => {
    if (modalCantidad <= 1) return;
    const nueva = modalCantidad - 1;
    setModalCantidad(nueva);
    setCantidad(dispatch, Number(id), nueva);
  };
  const handleIrCarrito = () => {
    setModalVisible(false);
    navigate("/carrito");
  };
  const handleCerrarLoginModal = () => setMostrarLoginModal(false);
  const handleLoginRedirect = () => {
    setMostrarLoginModal(false);
    navigate("/login?role=cliente");
  };
  const toggleEnvio = () => setMostrarEnvio(v => !v);

  if (loading) return <div className="p-10 text-center">Cargando producto...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Error: {error}</div>;
  if (!product) return <div className="p-10 text-center">Producto no encontrado</div>;

  const { nombre, precio_normal, precio_oferta, en_oferta, imagen_1, imagen_2, en_stock } = product;
  const estaEnOferta = en_oferta === 1 || en_oferta === true;
  const agotado = en_stock === 0 || en_stock === false;
  const images = [imagen_1, imagen_2].filter(Boolean);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-10 grid md:grid-cols-2 gap-10">
        {/* Imágenes */}
        <div className="flex flex-col items-center">
          <div className="flex gap-4 mb-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={`${IMG_BASE_URL}${img}`}
                alt={`vista ${i}`}
                className={`w-20 h-20 rounded-lg object-cover border-2 cursor-pointer ${mainImage === img ? "border-blue-600" : "border-gray-300"
                  }`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
          <img src={`${IMG_BASE_URL}${mainImage}`} alt={nombre} className="w-full max-w-md rounded-xl shadow-lg object-cover" />
        </div>

        {/* Detalles */}
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-gray-800">{nombre}</h1>
          <div>
            {estaEnOferta ? (
              <>
                <p className="text-lg line-through text-gray-400">S/ {Number(precio_normal).toFixed(2)}</p>
                <p className="text-2xl font-bold text-red-600">S/ {Number(precio_oferta).toFixed(2)}</p>
              </>
            ) : (
              <p className="text-2xl font-bold text-gray-900">S/ {Number(precio_normal).toFixed(2)}</p>
            )}
          </div>
          {agotado && <p className="font-semibold text-lg text-red-600">Producto agotado</p>}

          <div className="flex flex-col gap-3 max-w-sm w-full">
            <button
              onClick={handleAddToCart}
              disabled={agotado}
              className={`py-2 rounded-lg text-sm font-medium transition ${agotado ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gray-900 hover:bg-black text-white"
                }`}
            >
              Añadir al Carrito
            </button>

            {!sesionIniciada && (
              <button
                onClick={handleContinuarCompra}
                disabled={agotado}
                className={`py-2 rounded-lg text-sm font-medium transition ${agotado ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
              >
                Continuar Compra
              </button>
            )}

            {sesionIniciada && (
              <>
                <a
                  href={`https://wa.me/?text=Hola, estoy interesado en ${encodeURIComponent(nombre)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`py-2 rounded-lg text-sm font-medium transition ${agotado
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                    : "bg-green-500 hover:bg-green-600 text-white"
                    } block text-center`}
                >
                  Comprar por WhatsApp
                </a>
                <button
                  onClick={() => { }}
                  disabled={agotado}
                  className={`py-2 rounded-lg text-sm font-medium transition ${agotado
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  Pagar con Tarjeta
                </button>
                <button
                  onClick={() => { }}
                  disabled={agotado}
                  className={`py-2 rounded-lg text-sm font-medium transition ${agotado
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                >
                  Pagar con Yape
                </button>
              </>
            )}
          </div>

          <div className="mt-8 flex gap-6 text-xl text-gray-600">
            <FaTruck title="Envío rápido" />
            <FaCreditCard title="Pago seguro" />
            <PiEyeglassesBold title="Garantía" />
          </div>

          <div className="mt-6 max-w-sm w-full">
            <button
              onClick={toggleEnvio}
              className="py-2 px-4 text-sm rounded-lg border hover:bg-gray-100 text-gray-700 w-full transition"
            >
              {mostrarEnvio ? "Ocultar forma de envío" : "Ver forma de envío"}
            </button>
            {mostrarEnvio && (
              <div className="mt-3 bg-gray-100 p-4 rounded-lg text-sm text-gray-700">
                - Envíos disponibles a todo el país.<br />
                - Tiempo de entrega: 2 a 5 días hábiles.<br />
                - Costos varían según la ubicación.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalCarrito
        producto={
          modalVisible
            ? {
              id: Number(id),
              nombre: product.nombre,
              precio: estaEnOferta ? Number(precio_oferta) : Number(precio_normal),
              imagen: product.imagen_1,
            }
            : null
        }
        cantidad={modalCantidad}
        onCerrar={handleCerrarModal}
        onAumentar={handleAumentarCantidad}
        onDisminuir={handleDisminuirCantidad}
        onIrCarrito={handleIrCarrito}
      />

      <ModalLoginRequerido visible={mostrarLoginModal} onCerrar={handleCerrarLoginModal} onLogin={handleLoginRedirect} />
    </>
  );
};

export default ProductDetail;
