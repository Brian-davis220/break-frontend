import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Car, Database, ChevronRight, Terminal, ExternalLink, ShieldCheck, Plus, Trash2, Edit3, X } from 'lucide-react';
import { getHealth, getData, getCars, createCar, deleteCar, updateCar } from './api';
import './index.css';

const Navbar = () => (
  <motion.nav
    initial={{ y: -100, x: '-50%' }}
    animate={{ y: 0, x: '-50%' }}
    className="navbar glass"
  >
    <div className="nav-logo">BREAK</div>
    <div className="nav-links">
      <a href="#hero" className="nav-link">Home</a>
      <a href="#data" className="nav-link">Engine</a>
      <a href="#cars" className="nav-link">Fleet</a>
    </div>
    <button className="glass" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', cursor: 'pointer', color: '#f8fafc' }}>
      Connect
    </button>
  </motion.nav>
);

const Hero = () => (
  <header id="hero" className="hero app-container">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <span className="hero-badge">v1.1.0 Management Suite</span>
      <h1 className="hero-title">
        The Future of <span>Dynamic</span> Architecture
      </h1>
      <p className="hero-subtitle">
        A seamless fusion of high-performance backend systems and fluid, responsive interfaces.
        Manage your assets with precision and elegance.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <a href="#cars" style={{ textDecoration: 'none' }}>
          <button className="glass" style={{ padding: '0.8rem 2rem', background: '#6366f1', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Manage Fleet
          </button>
        </a>
        <button className="glass" style={{ padding: '0.8rem 2rem', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          Documentation
        </button>
      </div>
    </motion.div>
  </header>
);

const CarCard = ({ car, onDelete, onEdit }) => (
  <motion.div
    layout
    whileHover={{ y: -10 }}
    className="card glass"
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div className="card-icon"><Car size={24} /></div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => onEdit(car)} className="icon-btn" style={{ background: 'rgba(99,102,241,0.1)', border: 'none', color: '#6366f1', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
          <Edit3 size={16} />
        </button>
        <button onClick={() => onDelete(car._id || car.id)} className="icon-btn" style={{ background: 'rgba(244,63,94,0.1)', border: 'none', color: '#f43f5e', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    <span style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 800 }}>${car.price || '0.00'}</span>
    <h3 className="card-title">{car.make} {car.model}</h3>
    <p className="card-desc">
      A high-performance {car.color || 'sleek'} model from {car.year}.
    </p>
  </motion.div>
);

const CarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    price: '',
    ...initialData
  });

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{ padding: '2.5rem', width: '100%', maxWidth: '500px', margin: '1rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>{initialData ? 'Update Vehicle' : 'Add New Vehicle'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
          <div className="form-grid">
            <div className="input-group">
              <label>Make</label>
              <input value={formData.make} onChange={e => setFormData({ ...formData, make: e.target.value })} required className="glass" />
            </div>
            <div className="input-group">
              <label>Model</label>
              <input value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} required className="glass" />
            </div>
            <div className="input-group">
              <label>Year</label>
              <input type="number" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} required className="glass" />
            </div>
            <div className="input-group">
              <label>Color</label>
              <input value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} className="glass" />
            </div>
            <div className="input-group" style={{ gridColumn: 'span 2' }}>
              <label>Price ($)</label>
              <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="glass" />
            </div>
          </div>
          <button type="submit" className="glass" style={{ width: '100%', marginTop: '2rem', padding: '1rem', background: '#6366f1', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            {initialData ? 'Save Changes' : 'Add to Fleet'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

function App() {
  const [data, setData] = useState([]);
  const [cars, setCars] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  const fetchAllData = async () => {
    try {
      const [healthRes, dataRes, carsRes] = await Promise.all([
        getHealth(),
        getData(),
        getCars()
      ]);
      setHealth(healthRes.data);
      setData(dataRes.data);
      setCars(carsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddCar = async (carData) => {
    try {
      await createCar(carData);
      setIsModalOpen(false);
      fetchAllData();
    } catch (error) {
      alert('Failed to add car. Please check your backend connection.');
    }
  };

  const handleUpdateCar = async (carData) => {
    try {
      await updateCar(editingCar._id || editingCar.id, carData);
      setEditingCar(null);
      fetchAllData();
    } catch (error) {
      alert('Failed to update car.');
    }
  };

  const handleDeleteCar = async (id) => {
    if (window.confirm('Are you sure you want to remove this vehicle?')) {
      try {
        await deleteCar(id);
        fetchAllData();
      } catch (error) {
        alert('Failed to delete car.');
      }
    }
  };

  return (
    <div className="App">
      <Navbar />

      <Hero />

      <main className="app-container">
        {/* System Health Status */}
        <section id="status" style={{ marginBottom: '5rem' }}>
          <div className="glass" style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Activity className={health?.status === 'UP' ? 'text-green' : ''} style={{ color: health?.status === 'UP' ? '#10b981' : '#f43f5e' }} />
              <div>
                <h4 style={{ fontSize: '1rem' }}>System Status</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Monitoring backend connectivity and latency</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.9rem', color: health?.status === 'UP' ? '#10b981' : '#f43f5e', fontWeight: 700 }}>
                {health?.status === 'UP' ? 'OPERATIONAL' : 'OFFLINE'}
              </span>
              <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Last checked: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </section>

        {/* Data Engine Section */}
        <section id="data" style={{ marginBottom: '5rem' }}>
          <h2 className="section-title">Data Engine</h2>
          {loading ? (
            <div className="loader-container"><div className="loader"></div></div>
          ) : (
            <div className="grid">
              {data.map((item) => (
                <div key={item.id} className="card glass">
                  <div className="card-icon"><Database size={24} /></div>
                  <span style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 800 }}>SYSTEM_ID: {item.id}</span>
                  <h3 className="card-title">{item.name}</h3>
                  <p className="card-desc">Status: {item.status}. This item is synchronized with the backend real-time storage engine.</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Cars Fleet Section */}
        <section id="cars" style={{ marginBottom: '8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Active Fleet</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{cars.length} vehicles detected in database</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="glass"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#6366f1', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              <Plus size={20} /> Add Vehicle
            </button>
          </div>

          <AnimatePresence>
            <div className="grid">
              {cars.map((car) => (
                <CarCard
                  key={car._id || car.id}
                  car={car}
                  onDelete={handleDeleteCar}
                  onEdit={setEditingCar}
                />
              ))}
              {cars.length === 0 && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ gridColumn: '1 / -1', padding: '5rem', textAlign: 'center', color: '#94a3b8' }}>
                  <Car size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                  <p>Database is empty. Add your first vehicle to get started.</p>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </section>
      </main>

      {/* Modals */}
      <CarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCar}
      />
      {editingCar && (
        <CarModal
          isOpen={true}
          onClose={() => setEditingCar(null)}
          onSubmit={handleUpdateCar}
          initialData={editingCar}
        />
      )}

      {/* Footer */}
      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
        <div className="app-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="nav-logo" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>BREAK</div>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>© 2026 Break Systems Corp. All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8' }}>
            <Terminal size={20} cursor="pointer" />
            <ExternalLink size={20} cursor="pointer" />
            <ShieldCheck size={20} cursor="pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
