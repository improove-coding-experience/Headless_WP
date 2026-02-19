import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import { fetchProperties } from '../services/api';
import AnimatedCounter from '../components/AnimatedCounter';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    sold: 0,
    available: 0,
    pending: 0,
  });

  useEffect(() => {
    const getProperties = async () => {
      try {
        const data = await fetchProperties();
        console.log('API Response:', data);
        // Add random status to properties for demo (in real app, this would come from WordPress)
        const propertiesWithStatus = data.map(property => ({
          ...property,
          status: ['Available', 'Sold', 'Pending'][Math.floor(Math.random() * 3)],
        }));
        setProperties(propertiesWithStatus);
        
        // Calculate stats
        const calculateStats = () => {
          const totalProps = propertiesWithStatus.length;
          const soldProps = propertiesWithStatus.filter(p => p.status === 'Sold').length;
          const availableProps = propertiesWithStatus.filter(p => p.status === 'Available').length;
          const pendingProps = propertiesWithStatus.filter(p => p.status === 'Pending').length;

          setStats({
            total: totalProps,
            sold: soldProps,
            available: availableProps,
            pending: pendingProps,
          });
        };

        calculateStats();
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    getProperties();
  }, []);

  useEffect(() => {
    console.log('Properties data:', properties);
  }, [properties]);

  useEffect(() => {
    console.log('Stats calculation:', stats);
  }, [stats]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sold':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'Available':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const filteredProperties = statusFilter === 'all' 
    ? properties 
    : properties.filter(p => p.status === statusFilter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const salesData = {
    labels: ['Sold', 'Available', 'Pending'],
    datasets: [
      {
        label: 'Property Sales',
        data: [stats.sold, stats.available, stats.pending],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.h1 
            className="text-4xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            Property Dashboard
          </motion.h1>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Track and manage your property sales and status
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
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
          {/* Total Properties */}
          <motion.div 
            className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg p-6 text-white shadow-lg"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
            whileHover={{ y: -8 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Total Properties</p>
                <p className="text-4xl font-bold mt-2">
                  <AnimatedCounter targetNumber={stats.total} duration={2000} />
                </p>
              </div>
              <motion.div 
                className="bg-indigo-500 rounded-full p-3 opacity-20 button-transition"
                whileHover={{ scale: 1.1, opacity: 0.3 }}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Sold Properties */}
          <motion.div 
            className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white shadow-lg"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
            whileHover={{ y: -8 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Sold Properties</p>
                <p className="text-4xl font-bold mt-2">
                  <AnimatedCounter targetNumber={stats.sold} duration={2000} />
                </p>
              </div>
              <motion.div 
                className="bg-green-500 rounded-full p-3 opacity-20 button-transition"
                whileHover={{ scale: 1.1, opacity: 0.3 }}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 10-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Available Properties */}
          <motion.div 
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
            whileHover={{ y: -8 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Available</p>
                <p className="text-4xl font-bold mt-2">
                  <AnimatedCounter targetNumber={stats.available} duration={2000} />
                </p>
              </div>
              <motion.div 
                className="bg-blue-500 rounded-full p-3 opacity-20 button-transition"
                whileHover={{ scale: 1.1, opacity: 0.3 }}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-2a4 4 0 00-8 0v2h8z" />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Pending Properties */}
          <motion.div 
            className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-lg p-6 text-white shadow-lg"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
            whileHover={{ y: -8 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pending</p>
                <p className="text-4xl font-bold mt-2">
                  <AnimatedCounter targetNumber={stats.pending} duration={2000} />
                </p>
              </div>
              <motion.div 
                className="bg-yellow-500 rounded-full p-3 opacity-20 button-transition"
                whileHover={{ scale: 1.1, opacity: 0.3 }}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filter and Table */}
        <motion.div 
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Property Listings</h2>
            <div className="flex flex-wrap gap-2">
              <motion.button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'all' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                All
              </motion.button>
              <motion.button
                onClick={() => setStatusFilter('Available')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'Available' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Available
              </motion.button>
              <motion.button
                onClick={() => setStatusFilter('Sold')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'Sold' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sold
              </motion.button>
              <motion.button
                onClick={() => setStatusFilter('Pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === 'Pending' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Pending
              </motion.button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Property</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property, index) => (
                    <motion.tr 
                      key={property.id} 
                      className={`hover:bg-gray-700/50 button-transition ${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50'}`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      viewport={{ once: true, amount: 0.5 }}
                    >
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <div className="font-medium text-white">
                          {property.title?.rendered || property.title || 'Untitled'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        ${parseFloat(property.acf?.price || property.meta?.price || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <motion.span 
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold button-transition hover:shadow-lg ${getStatusColor(property.status)}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {property.status}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link 
                          to={`/property/${property.id}`}
                          className="text-indigo-400 hover:text-indigo-300 link-underline font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                      No properties found with selected status.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Results count */}
          <div className="px-6 py-3 bg-gray-700 text-sm text-gray-400 border-t border-gray-600">
            Showing {filteredProperties.length} of {stats.total} properties
          </div>
        </motion.div>

        {/* Pivot Table - Status Summary */}
        <motion.div 
          className="mt-12 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Property Status Summary</h2>
            <p className="text-gray-400 text-sm mt-1">Total property overview by status</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700 border-b border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Count</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Avg Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Total Value</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-white">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {['Available', 'Sold', 'Pending'].map((status) => {
                  const statusProperties = properties.filter(p => p.status === status);
                  const count = statusProperties.length;
                  const totalValue = statusProperties.reduce((sum, p) => sum + parseFloat(p.acf?.price || p.meta?.price || 0), 0);
                  const avgPrice = count > 0 ? totalValue / count : 0;
                  const percentage = stats.total > 0 ? ((count / stats.total) * 100).toFixed(1) : 0;

                  const statusColors = {
                    'Available': 'bg-blue-600',
                    'Sold': 'bg-green-600',
                    'Pending': 'bg-yellow-600',
                  };

                  return (
                    <motion.tr 
                      key={status}
                      className="hover:bg-gray-700/30 button-transition"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
                          <span className="font-medium text-white">{status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <span className="font-semibold text-white text-lg">{count}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        ${parseFloat(avgPrice).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        ${parseFloat(totalValue).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ width: 0 }}
                          whileInView={{ width: 'auto' }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        >
                          <div className="bg-gray-700 rounded-full h-2 w-24">
                            <motion.div
                              className={`h-full rounded-full ${statusColors[status]}`}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                          <span className="text-white font-semibold">{percentage}%</span>
                        </motion.div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Sales Graph */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-white">Sales Distribution</h2>
          <div className="h-64">
            <Pie data={salesData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
