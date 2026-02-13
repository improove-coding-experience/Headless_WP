import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchPropertyById } from '../services/api';

function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProperty = async () => {
      setLoading(true);
      const data = await fetchPropertyById(id);
      if (data) {
        setProperty(data);
      } else {
        setError('Property not found');
      }
      setLoading(false);
    };

    getProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4 font-semibold">{error || 'Property not found'}</p>
          <Link to="/properties" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  // Handle both post and property custom post type formats
  const title = property.title?.rendered || property.title || 'Untitled';
  const content = property.content?.rendered || property.description || '';
  const excerpt = property.excerpt?.rendered || '';
  const featuredImage = property._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const postDate = property.date ? new Date(property.date).toLocaleDateString() : 'N/A';
  const status = property.status === 'publish' ? 'Available' : 'Not Available';
  
  // Get price - try multiple sources
  let price = null;
  if (property.acf?.price) {
    price = property.acf.price;
  } else if (property.meta?.price) {
    price = property.meta.price;
  }
  
  // Get location if available
  let location = null;
  if (property.acf?.location) {
    location = property.acf.location;
  } else if (property.meta?.location) {
    location = property.meta.location;
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header/Navigation Section */}
      <motion.div 
        className="bg-gradient-to-b from-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8 border-b border-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-4xl mx-auto">
          <Link to="/properties" className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium mb-6 inline-block">
            ← Back to Properties
          </Link>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {/* Featured Image */}
          <motion.div
            className="mb-12 rounded-xl overflow-hidden shadow-2xl"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
            whileHover={{ scale: 1.02 }}
          >
            {featuredImage ? (
              <img
                src={featuredImage}
                alt={title}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="bg-gray-800 h-96 flex items-center justify-center border border-gray-700">
                <p className="text-gray-500">No featured image</p>
              </div>
            )}
          </motion.div>

          {/* Property Title */}
          <motion.h1 
            className="text-5xl font-bold text-white mb-8"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
          >
            {title}
          </motion.h1>

          {/* Property Meta Info */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {price && (
              <motion.div 
                className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-lg shadow-lg"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
                }}
                whileHover={{ y: -8 }}
              >
                <h3 className="text-sm text-indigo-200 uppercase tracking-wide font-semibold">Price</h3>
                <motion.p 
                  className="text-3xl font-bold text-white mt-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  ${parseFloat(price).toLocaleString()}
                </motion.p>
              </motion.div>
            )}
            {location && (
              <motion.div 
                className="bg-gray-800 p-6 rounded-lg border border-gray-700"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
                }}
                whileHover={{ y: -8 }}
              >
                <h3 className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Location</h3>
                <p className="text-xl font-semibold text-white mt-2">
                  {location}
                </p>
              </motion.div>
            )}
            <motion.div 
              className="bg-gray-800 p-6 rounded-lg border border-gray-700"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              whileHover={{ y: -8 }}
            >
              <h3 className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Status</h3>
              <p className="text-xl font-semibold text-white mt-2">
                {status}
              </p>
            </motion.div>
            <motion.div 
              className="bg-gray-800 p-6 rounded-lg border border-gray-700"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              whileHover={{ y: -8 }}
            >
              <h3 className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Posted On</h3>
              <p className="text-xl font-semibold text-white mt-2">
                {postDate}
              </p>
            </motion.div>
          </motion.div>

          {/* Property Description */}
          {content && (
            <motion.div 
              className="mb-12"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
              }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">Description</h2>
              <div className="prose prose-invert prose-sm max-w-none text-gray-300 bg-gray-800 p-8 rounded-lg border border-gray-700">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </motion.div>
          )}

          {/* Excerpt if available */}
          {excerpt && (
            <motion.div 
              className="mb-12 bg-gradient-to-r from-indigo-900 to-purple-900 p-8 rounded-lg border-l-4 border-indigo-600"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
              }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Summary</h3>
              <div className="text-gray-200">
                <div dangerouslySetInnerHTML={{ __html: excerpt }} />
              </div>
            </motion.div>
          )}

          {/* Call to Action */}
          <motion.div 
            className="flex gap-4 items-center"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
          >
            <motion.button 
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Agent
            </motion.button>
            <Link
              to="/properties"
            >
              <motion.div
                className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View More Properties
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default PropertyDetail;
