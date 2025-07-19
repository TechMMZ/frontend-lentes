    // components/WhatsAppButton.jsx
    import React from 'react';
    import { FaWhatsapp } from 'react-icons/fa';

    function WhatsAppButton() {
    return (
        <a
        href="https://wa.me/51969578760" // Reemplaza con tu número incluyendo código de país sin '+'
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
        >
        <FaWhatsapp className="w-6 h-6" />
        <span className="hidden sm:inline">WhatsApp</span>
        </a>
    );
    }

    export default WhatsAppButton;
