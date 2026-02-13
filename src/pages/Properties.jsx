import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from '../components/PropertyCard';
import { useInView } from '../hooks/useInView';
import { fetchProperties } from '../services/api';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const getProperties = async () => {
      try {
        setLoading(true);
        setDebugInfo('Fetching properties...');
        const data = await fetchProperties();
        
        setDebugInfo(`Received ${data.length} properties`);
        
        if (data.length === 0) {
          setError('No properties found. Make sure WordPress properties endpoint is working.');
        } else {
          setProperties(data);
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
        setDebugInfo(err.toString());
      } finally {
        setLoading(false);
      }
    };

    getProperties();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading properties...</p>
          <p className="text-xs text-gray-500 mt-2">{debugInfo}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="text-center max-w-md">
          <p className="text-red-400 text-lg mb-4 font-semibold">⚠️ {error}</p>
          <div className="bg-gray-800 p-4 rounded-lg text-left text-sm border border-gray-700">
            <p className="text-gray-200 mb-2"><strong>Expected API URL:</strong></p>
            <code className="block bg-gray-900 p-2 rounded text-xs mb-4 break-all text-gray-300">
              http://localhost/Real-estate-website/wp-json/wp/v2/properties
            </code>
            <p className="text-gray-400 text-xs">Debug: {debugInfo}</p>
          </div>
          <p className="text-gray-400 text-xs mt-4">Check browser console (F12) for more details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header Section */}
      <motion.div 
        className="bg-gradient-to-b from-gray-800 to-gray-900 py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-5xl sm:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            All Properties
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            Browse our complete collection of premium properties. Find your perfect match from our extensive listings.
          </motion.p>
        </div>
      </motion.div>

      {/* Properties Grid Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {properties.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.1,
                  },
                },
              }}
            >
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'easeOut',
                  }}
                  whileHover={{ y: -8 }}
                >
                  <PropertyCard property={property} index={index} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-400 text-lg">No properties available.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Properties;
