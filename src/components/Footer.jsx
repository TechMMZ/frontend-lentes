import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../assets/LOGO SUNCITY blanco.png';

function Footer() {
  return (
    <footer className="bg-black text-white pt-14 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Logo + Descripción */}
        <div>
          <img src={logo} alt="SUNCITY Logo" className="h-12 mb-4" />
          <p className="text-gray-400 text-sm leading-relaxed">
            Estilo y protección bajo el sol. Vive la experiencia SUNCITY con los mejores lentes y monturas.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Navegación</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/" className="hover:text-red-500 transition">Inicio</Link></li>
            <li><Link to="/categoria/vertodo" className="hover:text-red-500 transition">Tienda</Link></li>
            <li><Link to="/categoria/lonuevo" className="hover:text-red-500 transition">Lo Nuevo</Link></li>
            <li><Link to="/categoria/unisex" className="hover:text-red-500 transition">Lentes de Sol</Link></li>
            <li><Link to="/categoria/monturas" className="hover:text-red-500 transition">Monturas</Link></li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contacto</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>
              Email: <a href="mailto:contacto@suncity.com" className="hover:text-red-500 transition">contacto@suncity.com</a>
            </li>
            <li>
              WhatsApp: <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition">+51 123 456 789</a>
            </li>
            <li>Horario: Lunes a Sábado, 9am - 7pm</li>
          </ul>
        </div>

        {/* Redes Sociales */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"
               className="w-10 h-10 rounded-full flex items-center justify-center text-[#1877F2] bg-white/10 hover:bg-white/20 transition hover:scale-110 shadow-md">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"
               className="w-10 h-10 rounded-full flex items-center justify-center text-[#E1306C] bg-white/10 hover:bg-white/20 transition hover:scale-110 shadow-md">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"
               className="w-10 h-10 rounded-full flex items-center justify-center text-[#1DA1F2] bg-white/10 hover:bg-white/20 transition hover:scale-110 shadow-md">
              <FaTwitter />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok"
               className="w-10 h-10 rounded-full flex items-center justify-center text-black bg-white border border-white hover:scale-110 transition shadow-md">
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="text-white font-semibold">SUNCITY</span>. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
