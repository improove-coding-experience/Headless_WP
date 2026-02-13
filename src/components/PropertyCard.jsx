import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';

function PropertyCard({ property, index = 0 }) {
  const [ref, isInView] = useInView();
  
  // Handle both post and property custom post type formats
  const title = property.title?.rendered || property.title || 'Untitled';
  
  // Get description - try multiple sources
  let description = 'No description available';
  if (property.acf?.description) {
    description = property.acf.description;
  } else if (property.excerpt?.rendered) {
    description = property.excerpt.rendered.replace(/<[^>]*>/g, '');
  } else if (property.content?.rendered) {
    description = property.content.rendered.replace(/<[^>]*>/g, '').substring(0, 120);
  }
  
  // Get price - try multiple sources
  let price = null;
  if (property.acf?.price) {
    price = property.acf.price;
  } else if (property.meta?.price) {
    price = property.meta.price;
  }
  
  const featuredImage = property._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  // Framer Motion variants for card
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: index * 0.1,
      },
    },
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.08,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <Link to={`/property/${property.id}`} className="block" ref={ref}>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        whileHover={{ y: -8 }}
        className="bg-white rounded-lg overflow-hidden h-full flex flex-col card-hover"
      >
        {/* Property Image */}
        <motion.div
          className="h-48 bg-gray-300 overflow-hidden relative"
          variants={imageVariants}
          initial="rest"
          whileHover="hover"
        >
          {featuredImage ? (
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white">
              No Image
            </div>
          )}
        </motion.div>

        {/* Property Info */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-indigo-600">
            {title}
          </h3>
          
          {/* Price */}
          {price && (
            <motion.p
              className="text-2xl font-bold text-indigo-600 mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              ${parseFloat(price).toLocaleString()}
            </motion.p>
          )}
          
          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
            {description}
          </p>

          {/* View Details Link */}
          <div className="flex justify-between items-center mt-auto">
            <span className="text-indigo-600 font-bold text-sm link-underline">
              View Details →
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default PropertyCard;
