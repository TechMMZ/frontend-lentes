import React, { useEffect, useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL;

export default function HeroBackground() {
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/hero-background`)
      .then(res => res.json())
      .then(data => setHeroData(data))
      .catch(err => console.error('Error cargando HeroBackground:', err));
  }, []);

  if (!heroData) {
    return <p>Cargando...</p>;
  }

  const baseUrl = `${API_URL}/uploads/`;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src={`${baseUrl}${heroData.fondoGrande}`}
        alt=""
        aria-hidden="true"
        className="hidden md:block absolute inset-0 w-full h-full object-cover object-center z-0"
      />
      <img
        src={`${baseUrl}${heroData.fondoPequeno}`}
        alt=""
        aria-hidden="true"
        className="block md:hidden absolute inset-0 w-full h-full object-cover object-center z-0"
      />
      <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 md:px-8 py-10 md:pt-28 md:pb-10">
        <h1 className="text-3xl md:text-6xl font-extrabold text-red-500 mb-4 drop-shadow-[2px_2px_3px_rgba(0,0,0,0.7)]">
          {heroData.title}
        </h1>
        <p className="text-white text-base md:text-xl max-w-3xl drop-shadow-md leading-relaxed mb-6">
          {heroData.description}
        </p>
        <div className="w-full max-w-[600px] px-4">
          <img
            src={`${baseUrl}${heroData.anuncio}`}
            alt="Anuncio de promoción de lentes"
            className="rounded-xl shadow-lg w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}
