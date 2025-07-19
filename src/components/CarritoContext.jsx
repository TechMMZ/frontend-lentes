    import React, { createContext, useContext, useReducer, useEffect, useMemo } from "react";

    const CarritoContext = createContext();

    // Cargar desde localStorage al inicio
    const initialState = JSON.parse(localStorage.getItem("carrito")) || [];

    function carritoReducer(state, action) {
    switch (action.type) {
        case "AGREGAR_PRODUCTO": {
        const existente = state.find((p) => p.id === action.payload.id);

        if (existente) {
            return state.map((p) =>
            p.id === action.payload.id
                ? { ...p, cantidad: p.cantidad + 1 }
                : p
            );
        }

        return [
            ...state,
            {
            ...action.payload,
            cantidad: 1,
            precio_normal: action.payload.precio_normal || action.payload.precio,
            },
        ];
        }

        case "AUMENTAR_CANTIDAD":
        return state.map((p) =>
            p.id === action.payload ? { ...p, cantidad: p.cantidad + 1 } : p
        );

        case "DISMINUIR_CANTIDAD":
        return state.map((p) =>
            p.id === action.payload && p.cantidad > 1
            ? { ...p, cantidad: p.cantidad - 1 }
            : p
        );

        case "ELIMINAR_PRODUCTO":
        return state.filter((p) => p.id !== action.payload);

        case "SET_CANTIDAD":
        return state.map((p) =>
            p.id === action.payload.id
            ? { ...p, cantidad: Math.max(1, action.payload.cantidad) }
            : p
        );

        default:
        return state;
    }
    }

    export function CarritoProvider({ children }) {
    const [carrito, dispatch] = useReducer(carritoReducer, initialState);

    // Guardar en localStorage cada vez que el carrito cambie
    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    // Memoizado: calcula si hay productos en el carrito
    const tieneProductos = useMemo(() => carrito.length > 0, [carrito]);

    // Acciones disponibles
    const addToCart = (producto) => {
        const payload = {
        ...producto,
        precio: Number(producto.precio),
        precio_normal: Number(producto.precio_normal) || Number(producto.precio),
        };
        dispatch({ type: "AGREGAR_PRODUCTO", payload });
    };

    const aumentarCantidad = (id) => {
        dispatch({ type: "AUMENTAR_CANTIDAD", payload: id });
    };

    const disminuirCantidad = (id) => {
        dispatch({ type: "DISMINUIR_CANTIDAD", payload: id });
    };

    const eliminarProducto = (id) => {
        dispatch({ type: "ELIMINAR_PRODUCTO", payload: id });
    };

    const setCantidad = (id, cantidad) => {
        dispatch({ type: "SET_CANTIDAD", payload: { id, cantidad } });
    };

    return (
        <CarritoContext.Provider
        value={{
            carrito,
            dispatch,
            tieneProductos, // 👈 esto se usa en el Header para el punto
            addToCart,
            aumentarCantidad,
            disminuirCantidad,
            eliminarProducto,
            setCantidad,
        }}
        >
        {children}
        </CarritoContext.Provider>
    );
    }

    export function useCarrito() {
    return useContext(CarritoContext);
    }
