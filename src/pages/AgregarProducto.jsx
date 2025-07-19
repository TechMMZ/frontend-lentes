import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AgregarProducto = () => {
    const [secciones, setSecciones] = useState([]);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
    const [errorBackend, setErrorBackend] = useState(null);
    const [productoAgregado, setProductoAgregado] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            en_oferta: false,
            agotado: false,
            cantidad: 1,
        },
    });

    const enOferta = watch('en_oferta');
    const agotado = watch('agotado');

    useEffect(() => {
        const obtenerSecciones = async () => {
            try {
                const res = await fetch('http://localhost:7500/api/secciones');
                if (!res.ok) throw new Error(`Error ${res.status}`);
                const data = await res.json();
                setSecciones(data || []);
            } catch (error) {
                console.error('Error cargando secciones:', error);
                setSecciones([]);
            }
        };
        obtenerSecciones();
    }, []);

    const handleSeleccion = (seccion) => {
        setSeccionSeleccionada(seccion);
        reset({ en_oferta: false, agotado: false });
        setErrorBackend(null);
    };

    const cerrarModal = () => {
        reset();
        setSeccionSeleccionada(null);
        setErrorBackend(null);
    };

    const cerrarTodo = () => {
        navigate('/dashboard-admin');
    };

    const onSubmit = async (data) => {
        if (!seccionSeleccionada) {
            alert('Selecciona una sección');
            return;
        }

        if (!data.imagen_1?.[0] || !data.imagen_2?.[0]) {
            alert('Debes subir ambas imágenes');
            return;
        }

        if (enOferta && (!data.precio_oferta || Number(data.precio_oferta) <= 0)) {
            alert('Debes ingresar un precio de oferta válido');
            return;
        }

        const nombreSeccion = secciones.find((s) => s.seccion === seccionSeleccionada)?.nombre_seccion;
        if (!nombreSeccion) {
            alert('No se encontró el nombre de la sección');
            return;
        }

        setErrorBackend(null);

        try {
            const formData = new FormData();
            formData.append('seccion', seccionSeleccionada);
            formData.append('nombre_seccion', nombreSeccion);
            formData.append('nombre', data.nombre.trim());
            formData.append('precio_normal', data.precio_normal.toString());
            formData.append('cantidad', data.cantidad.toString()); // ✅ Agregado
            formData.append('en_oferta', enOferta ? '1' : '0');
            formData.append('precio_oferta', enOferta ? data.precio_oferta.toString() : '0.00');
            formData.append('en_stock', agotado ? '0' : '1');
            formData.append('imagen_1', data.imagen_1[0]);
            formData.append('imagen_2', data.imagen_2[0]);

            const res = await fetch('http://localhost:7500/api/productos', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                let msg = 'Error al crear producto';
                try {
                    const errorData = await res.json();
                    msg = errorData.message || msg;
                } catch { }
                setErrorBackend(msg);
                return;
            }

            await res.json();
            setProductoAgregado(true); // ✅ mostrar modal
            reset();
            setSeccionSeleccionada(null);

            // ✅ ocultar modal tras 2 segundos y redirigir
            setTimeout(() => {
                setProductoAgregado(false);
            }, 2000);

        } catch (error) {
            console.error(error);
            setErrorBackend('Error al comunicarse con el servidor');
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans relative">
            {/* Modal de éxito */}
            <AnimatePresence>
                {productoAgregado && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white text-green-700 text-xl font-semibold px-8 py-6 rounded-xl shadow-xl"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            ✅ Producto agregado exitosamente
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={cerrarTodo}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                aria-label="Cerrar"
            >
                ×
            </button>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Agregar Producto a Sección</h1>

            {secciones.length === 0 ? (
                <p className="text-center text-red-600">No hay secciones disponibles.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                    {secciones.map((item) => {
                        const isSelected = seccionSeleccionada === item.seccion;
                        return (
                            <motion.div
                                key={item.seccion}
                                className={`flex items-center p-4 rounded-xl border cursor-pointer select-none transition-shadow ${isSelected
                                    ? 'bg-blue-50 border-blue-600 shadow-lg'
                                    : 'border-gray-300 hover:shadow-md hover:bg-gray-50'
                                    }`}
                                onClick={() => handleSeleccion(item.seccion)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div
                                    className={`w-5 h-5 mr-3 rounded-full border-2 ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
                                        }`}
                                />
                                <span
                                    className={`text-lg font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-700'
                                        }`}
                                >
                                    {item.nombre_seccion}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Formulario */}
            <AnimatePresence>
                {seccionSeleccionada && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 relative"
                    >
                        <button
                            onClick={cerrarModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold"
                            aria-label="Cerrar formulario"
                        >
                            ×
                        </button>

                        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-6">
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">
                                    Nombre del producto
                                </label>
                                <input
                                    type="text"
                                    {...register('nombre', { required: 'El nombre es obligatorio' })}
                                    className={`w-full border px-4 py-2 rounded-lg ${errors.nombre ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.nombre && (
                                    <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Cantidad</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    {...register('cantidad', {
                                        required: 'La cantidad es obligatoria',
                                        min: { value: 0, message: 'Debe ser igual o mayor a 0' },
                                    })}
                                    className={`w-full border px-4 py-2 rounded-lg ${errors.cantidad ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.cantidad && (
                                    <p className="text-red-500 text-sm mt-1">{errors.cantidad.message}</p>
                                )}
                            </div>


                            <div>
                                <label className="block font-medium text-gray-700 mb-1">
                                    Precio normal (S/.)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('precio_normal', {
                                        required: 'El precio es obligatorio',
                                        min: { value: 0.01, message: 'Debe ser mayor a 0' },
                                    })}
                                    className={`w-full border px-4 py-2 rounded-lg ${errors.precio_normal ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.precio_normal && (
                                    <p className="text-red-500 text-sm mt-1">{errors.precio_normal.message}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input id="en_oferta" type="checkbox" {...register('en_oferta')} />
                                <label htmlFor="en_oferta" className="text-gray-700 font-medium">
                                    ¿Está en oferta?
                                </label>
                            </div>

                            <AnimatePresence>
                                {enOferta && (
                                    <motion.div
                                        key="precio_oferta"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <label className="block font-medium text-gray-700 mb-1">
                                            Precio de oferta (S/.)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('precio_oferta', {
                                                required: 'El precio de oferta es obligatorio',
                                                min: { value: 0.01, message: 'Debe ser mayor a 0' },
                                            })}
                                            className={`w-full border px-4 py-2 rounded-lg ${errors.precio_oferta ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.precio_oferta && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.precio_oferta.message}
                                            </p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center space-x-2">
                                <input id="agotado" type="checkbox" {...register('agotado')} />
                                <label htmlFor="agotado" className="text-gray-700 font-medium">
                                    ¿Agotado?
                                </label>
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Imagen 1</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register('imagen_1', { required: 'Imagen requerida' })}
                                />
                                {errors.imagen_1 && (
                                    <p className="text-red-500 text-sm mt-1">{errors.imagen_1.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block font-medium text-gray-700 mb-1">Imagen 2</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register('imagen_2', { required: 'Imagen requerida' })}
                                />
                                {errors.imagen_2 && (
                                    <p className="text-red-500 text-sm mt-1">{errors.imagen_2.message}</p>
                                )}
                            </div>

                            {errorBackend && (
                                <p className="text-red-600 font-semibold text-center">{errorBackend}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
                            >
                                {isSubmitting ? 'Agregando...' : 'Agregar Producto'}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AgregarProducto;
