import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Car, Database, ChevronRight, Github, ExternalLink, ShieldCheck } from 'lucide-react';
import { getHealth, getData, getCars } from './api';
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
      <span className="hero-badge">v1.0.0 Now Active</span>
      <h1 className="hero-title">
        The Future of <span>Dynamic</span> Architecture
      </h1>
      <p className="hero-subtitle">
        A seamless fusion of high-performance backend systems and fluid, responsive interfaces.
        Designed for those who demand more from their digital experiences.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button className="glass" style={{ padding: '0.8rem 2rem', background: '#6366f1', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          Explore Now
        </button>
        <button className="glass" style={{ padding: '0.8rem 2rem', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          Documentation
        </button>
      </div>
    </motion.div>
  </header>
);

const Card = ({ icon: Icon, title, description, badge }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="card glass"
  >
    <div className="card-icon"><Icon size={24} /></div>
    {badge && <span style={{ fontSize: '0.7rem', color: '#6366f1', fontWeight: 800 }}>{badge}</span>}
    <h3 className="card-title">{title}</h3>
    <p className="card-desc">{description}</p>
    <button style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
      View Details <ChevronRight size={16} />
    </button>
  </motion.div>
);

function App() {
  const [data, setData] = useState([]);
  const [cars, setCars] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, []);

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
                <Card
                  key={item.id}
                  icon={Database}
                  title={item.name}
                  description={`Status: ${item.status}. This item is synchronized with the backend real-time storage engine.`}
                  badge={`SYSTEM_ID: ${item.id}`}
                />
              ))}
            </div>
          )}
        </section>

        {/* Cars Fleet Section */}
        <section id="cars" style={{ marginBottom: '8rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Active Fleet</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{cars.length} vehicles detected in database</p>
          </div>
          <div className="grid">
            {cars.map((car) => (
              <Card
                key={car.id || car._id}
                icon={Car}
                title={`${car.make} ${car.model}`}
                description={`A high-performance ${car.color || 'sleek'} model from ${car.year}. Integrated via MongoDB storage.`}
                badge={car.regNo || 'VNTG-CAR'}
              />
            ))}
            {cars.length === 0 && !loading && (
              <div className="glass" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                <Car size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <p>No vehicles found in the fleet database.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
        <div className="app-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="nav-logo" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>BREAK</div>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>© 2026 Break Systems Corp. All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8' }}>
            <Github size={20} cursor="pointer" />
            <ExternalLink size={20} cursor="pointer" />
            <ShieldCheck size={20} cursor="pointer" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
