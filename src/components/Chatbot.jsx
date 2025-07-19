import React, { useState, useEffect, useRef } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';

const IMG_BASE_URL = "http://localhost:7500/img/";

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null); // Para marcar opción clicada
    const userId = 'usuario123';
    const messagesEndRef = useRef(null);

    // Reinicia el chat al abrirlo
    const handleToggleChat = () => {
        if (!isOpen) {
            setMessages([{ from: 'bot', content: [{ text: '¡Hola! Escribe tu mensaje para comenzar.' }] }]);
            setInput('');
            setSelectedOptionIndex(null);
        }
        setIsOpen(!isOpen);
    };

    // Scroll automático hacia el final
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Enviar mensaje al backend
    const sendMessage = async (customMessage = null) => {
        const userMessage = customMessage !== null ? customMessage : input.trim();
        if (!userMessage) return;

        setMessages(prev => [...prev, { from: 'user', content: [{ text: userMessage }] }]);
        setInput('');
        setSelectedOptionIndex(null);

        try {
            const res = await fetch('http://localhost:7500/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, message: userMessage }),
            });

            if (!res.ok) throw new Error(`Error: ${res.status}`);

            const data = await res.json();

            setMessages(prev => [...prev, { from: 'bot', content: data.reply }]);
        } catch {
            setMessages(prev => [
                ...prev,
                { from: 'bot', content: [{ text: 'Error al conectar con el servidor.' }] },
            ]);
        }
    };

    // Detecta Enter para enviar
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Renderiza mensaje del bot con opciones clickeables si es lista
    const renderBotMessage = (content, messageIndex) => {
        // Si el contenido es una lista y todas las partes tienen texto, mostramos botones (excepto la primera línea)
        if (content.length > 1 && content.every(part => part.text)) {
            return (
                <div>
                    <p className="mb-2 whitespace-pre-wrap">{content[0].text}</p>
                    <div className="flex flex-col gap-2">
                        {content.slice(1).map((option, idx) => {
                            const globalOptionIndex = `${messageIndex}-${idx}`; // índice único para cada opción
                            const isSelected = selectedOptionIndex === globalOptionIndex;
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`text-left px-3 py-2 rounded-lg border transition
                        ${isSelected
                                            ? 'bg-red-600 text-white border-red-700'
                                            : 'bg-red-100 text-red-900 border-transparent hover:bg-red-200'
                                        }`}
                                    onClick={() => {
                                        setSelectedOptionIndex(globalOptionIndex);
                                        // Quitar el número y punto inicial "1. " y enviar texto limpio
                                        const textoLimpio = option.text.replace(/^\d+\.\s*/, '');
                                        setInput(textoLimpio);
                                        sendMessage(textoLimpio);
                                    }}
                                    aria-pressed={isSelected}
                                >
                                    {option.text}
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        } else {
            // Render normal: texto + imágenes
            return content.map((part, idx) => {
                if (part.text) {
                    return (
                        <p key={idx} className="mb-1 whitespace-pre-wrap">
                            {part.text}
                        </p>
                    );
                }
                if (part.image) {
                    // Soporta URL completas o solo nombre de archivo
                    const imageUrl = part.image.startsWith('http')
                        ? part.image
                        : `${IMG_BASE_URL}${part.image}`;

                    return (
                        <img
                            key={idx}
                            src={imageUrl}
                            alt="Producto"
                            className="mt-2 rounded-md max-w-[150px] h-auto"
                        />
                    );
                }
                return null;
            });
        }
    };

    return (
        <>
            {/* Botón flotante para abrir/cerrar chat */}
            <button
                onClick={handleToggleChat}
                aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
                className="fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-red-600 to-red-500 shadow-lg text-white hover:scale-110 transition-transform"
            >
                {isOpen ? <FaTimes className="w-6 h-6" /> : <FaComments className="w-6 h-6" />}
            </button>

            {/* Ventana del chat */}
            {isOpen && (
                <div
                    className="fixed bottom-6 right-6 z-50 w-[320px] h-[420px] bg-white rounded-xl shadow-2xl flex flex-col"
                    role="region"
                    aria-label="Chatbot"
                >
                    <header className="bg-gradient-to-r from-red-600 to-red-500 text-white p-4 flex justify-between items-center rounded-t-xl">
                        <h2 className="font-semibold text-lg">Chatbot - Sistema Lentes</h2>
                        <button
                            onClick={handleToggleChat}
                            aria-label="Cerrar chat"
                            className="hover:text-red-200 transition"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </header>

                    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4 scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-red-100">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`max-w-[75%] p-3 rounded-lg break-words whitespace-pre-wrap ${m.from === 'bot'
                                    ? 'bg-red-100 text-red-900 self-start shadow-sm'
                                    : 'bg-red-600 text-white self-end shadow-md'
                                    }`}
                            >
                                {m.from === 'bot'
                                    ? renderBotMessage(m.content, i)
                                    : m.content.map((part, idx) =>
                                        part.text ? (
                                            <p key={idx} className="mb-1 whitespace-pre-wrap">
                                                {part.text}
                                            </p>
                                        ) : null
                                    )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage();
                        }}
                        className="p-3 border-t border-red-200 flex items-center gap-3 bg-white rounded-b-xl"
                    >
                        <textarea
                            rows={1}
                            className="flex-grow resize-none border border-red-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe tu mensaje..."
                            aria-label="Escribe tu mensaje"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            aria-disabled={!input.trim()}
                            className="bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            Enviar
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
