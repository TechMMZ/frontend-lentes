/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell,
  PieChart, Pie, CartesianGrid
} from 'recharts';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

const API_BASE = `${API_URL}/api/productos`;
const IMG_BASE_URL = `${API_URL}/img/`;
const colores = [
  '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#F472B6',
  '#22D3EE', '#34D399', '#FCD34D', '#F87171', '#60A5FA', '#E879F9', '#A78BFA',
  '#FDBA74', '#FCA5A5', '#6EE7B7', '#4ADE80', '#FBBF24', '#FB7185'
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const producto = payload[0].payload;
    const imgSrc = producto.imagen_1
      ? `${IMG_BASE_URL}${producto.imagen_1}`
      : 'https://via.placeholder.com/60';

    return (
      <div className="bg-white border rounded-xl shadow-xl w-64 p-4 flex items-start gap-3">
        <img src={imgSrc} alt={producto.nombre} className="w-16 h-16 object-cover rounded-md border" />
        <div>
          <p className="text-gray-900 font-semibold">{producto.nombre}</p>
          <p className="text-sm text-gray-600">Cantidad: <strong>{producto.cantidad}</strong></p>
          <p className="text-sm text-gray-500">Sección: {producto.seccion}</p>
        </div>
      </div>
    );
  }
  return null;
};

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [tipoGrafico, setTipoGrafico] = useState('Barra');
  const [seccion, setSeccion] = useState('Todos');
  const [notificaciones, setNotificaciones] = useState([]);
  const [verNotificaciones, setVerNotificaciones] = useState(false);
  const chartRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API_BASE)
      .then(res => setProductos(res.data))
      .catch(err => console.error('Error al obtener productos', err));
  }, []);

  const filtrarProductos = () =>
    seccion === 'Todos' ? productos : productos.filter(p => p.seccion === seccion);

  useEffect(() => {
    setNotificaciones(filtrarProductos().filter(p => p.cantidad <= 5));
  }, [productos, seccion]);

  const exportPdf = async () => {
    const chartElement = chartRef.current;
    if (!chartElement) return;

    // Establecer fondo blanco antes de tomar el canvas
    const canvas = await html2canvas(chartElement, {
      backgroundColor: '#ffffff',
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF('landscape', 'pt', 'a4');

    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(20);
    doc.text(`Reporte de Inventario - Sección: ${seccion}`, margin, 40);
    doc.addImage(imgData, 'PNG', margin, 60, pageWidth - margin * 2, 250);

    doc.setFontSize(14);
    doc.text('Resumen Detallado:', margin, 330);

    const startY = 350;
    const rowHeight = 20;
    const colWidths = [250, 100, 150];
    const headers = ['Producto', 'Cantidad', 'Sección'];

    doc.setFillColor(240);
    doc.setTextColor(0);
    doc.setFontSize(12);
    let y = startY;

    headers.forEach((header, i) => {
      doc.rect(margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, colWidths[i], rowHeight, 'F');
      doc.text(header, margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, y + 14);
    });

    y += rowHeight;

    filtrarProductos().forEach(row => {
      const cols = [row.nombre, `${row.cantidad}`, row.seccion];
      cols.forEach((txt, i) => {
        doc.rect(margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, colWidths[i], rowHeight);
        doc.text(txt, margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5, y + 14);
      });
      y += rowHeight;
    });

    doc.save(`Inventario_${seccion}.pdf`);
  };

  const secciones = ['Todos', ...new Set(productos.map(p => p.seccion))];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-6 relative">
      <button
        onClick={() => navigate('/dashboard-admin')}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold z-50"
        aria-label="Cerrar"
      >
        ×
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">📦 Inventario</h1>
          <div className="relative">
            <Bell className="w-7 h-7 cursor-pointer text-gray-700" onClick={() => setVerNotificaciones(!verNotificaciones)} />
            {notificaciones.length > 0 && (
              <span className="absolute top-0 right-0 block h-3 w-3 bg-red-600 rounded-full ring-2 ring-white" />
            )}
            {verNotificaciones && (
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-10 p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">🔔 Notificaciones</h2>
                {notificaciones.length === 0 ? (
                  <p className="text-sm text-gray-600">No hay alertas</p>
                ) : (
                  notificaciones.map((p, i) => (
                    <div key={i} className="text-sm text-red-600 border-b py-1">
                      {p.nombre} tiene stock bajo: <strong>{p.cantidad}</strong>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <select className="border rounded px-4 py-2 bg-white shadow-sm" value={tipoGrafico} onChange={e => setTipoGrafico(e.target.value)}>
            <option value="Barra">📊 Gráfico de Barras</option>
            <option value="Pastel">🥧 Gráfico de Pastel</option>
          </select>
          <select className="border rounded px-4 py-2 bg-white shadow-sm" value={seccion} onChange={e => setSeccion(e.target.value)}>
            {secciones.map((sec, i) => <option key={i} value={sec}>{sec}</option>)}
          </select>
          <button onClick={exportPdf} className="bg-rose-500 text-white px-4 py-2 rounded shadow hover:bg-rose-600 transition">
            📄 Descargar PDF
          </button>
        </div>

        <div ref={chartRef} className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
          <ResponsiveContainer width="100%" height={420}>
            {tipoGrafico === 'Barra' ? (
              <BarChart data={filtrarProductos()} margin={{ top: 20, right: 20, bottom: 80, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="nombre"
                  angle={-45}
                  interval={0}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" />
                <Bar dataKey="cantidad">
                  {filtrarProductos().map((_, index) => (
                    <Cell key={index} fill={colores[index % colores.length]} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <PieChart margin={{ top: 20, bottom: 20 }}>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" layout="horizontal" height={50} />
                <Pie
                  data={filtrarProductos()}
                  dataKey="cantidad"
                  nameKey="nombre"
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  label
                >
                  {filtrarProductos().map((_, index) => (
                    <Cell key={index} fill={colores[index % colores.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Inventario;
