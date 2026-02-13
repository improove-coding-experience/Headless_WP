import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import Dashboard from './pages/Dashboard'
import Contact from './pages/Contact'
import Login from './pages/Login'
import PropertyCard from './components/PropertyCard'
import Header from './components/Header'
import Footer from './components/Footer'
import { useInView } from './hooks/useInView'
import { fetchProperties } from './services/api'
import { Navigate } from 'react-router-dom'

const products = [
  { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('username') || '';
  });

  const handleLogin = (loggedIn, user) => {
    setIsLoggedIn(loggedIn);
    setUsername(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  };

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      </Routes>
      <Footer />
    </Router>
  )
}

function FeaturedPropertiesSection() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref, isInView] = useInView();

  useEffect(() => {
    const getProperties = async () => {
      const data = await fetchProperties();
      setProperties(data.slice(0, 6));
      setLoading(false);
    };
    getProperties();
  }, []);

  if (loading) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div ref={ref} className="bg-gradient-to-b from-gray-900 to-gray-800 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-base/7 font-semibold text-indigo-400 mb-3">Featured Listings</h2>
          <h3 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Premium Properties
          </h3>
          <p className="mx-auto max-w-2xl text-lg text-gray-300 mt-4">
            Handpicked selection of premium properties in prime locations
          </p>
        </motion.div>
        {properties.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {properties.map((property, index) => (
              <motion.div key={property.id} variants={itemVariants}>
                <PropertyCard property={property} index={index} />
              </motion.div>
            ))}
          </motion.div>
        ) : null}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link
            to="/properties"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-indigo-700 button-transition hover:shadow-glow"
          >
            View All Properties →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function LandingPage() {
  const [featuresRef, featuresInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  const heroTextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const featureItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="bg-gray-900">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden pt-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] bg-gradient-to-tr from-[#ff80b5] to-[#7c3aed] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl py-24 sm:py-40 lg:py-48">
          <motion.div className="text-center space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            <motion.h1
              variants={heroTextVariants}
              className="text-5xl font-bold tracking-tight text-white sm:text-6xl"
            >
              Find Your Dream Property
            </motion.h1>
            <motion.p
              variants={heroTextVariants}
              className="text-lg text-gray-300"
            >
              Discover premium residential and commercial properties with professional listings and seamless booking.
            </motion.p>
            <motion.div variants={heroTextVariants} className="flex items-center justify-center gap-x-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/properties"
                  className="rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover-glow button-transition"
                >
                  Explore Now
                </Link>
              </motion.div>
              <a href="#featured" className="text-base font-semibold text-indigo-200 link-underline">
                View Featured ↓
              </a>
            </motion.div>
          </motion.div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] bg-gradient-to-tr from-[#ff80b5] to-[#7c3aed] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      {/* Featured Properties */}
      <FeaturedPropertiesSection />

      {/* Features Section */}
      <div ref={featuresRef} className="mx-auto max-w-7xl px-6 py-20 lg:px-8 bg-gray-900">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-base/7 font-semibold text-indigo-400 mb-3">Why Choose Us</h2>
          <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Premium Real Estate Solutions
          </p>
          <p className="mt-4 text-lg text-gray-300">
            Everything you need to find and manage properties efficiently
          </p>
        </motion.div>
        <div className="mx-auto mt-14 max-w-2xl lg:mt-16 lg:max-w-none">
          <motion.dl
            className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {products.map((product) => (
              <motion.div
                key={product.name}
                variants={featureItemVariants}
                className="relative pl-16"
                whileHover={{ y: -8 }}
              >
                <dt className="text-base/7 font-semibold text-white">
                  <motion.div
                    className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600 button-transition"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <product.icon aria-hidden="true" className="size-6 text-white" />
                  </motion.div>
                  {product.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-400">{product.description}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>

      {/* CTA Section */}
      <div ref={ctaRef} className="relative isolate overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-800 py-16 sm:py-20">
        <motion.div
          className="mx-auto max-w-2xl text-center space-y-6"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="mx-auto text-lg text-indigo-100">
            Join thousands of satisfied clients who found their dream properties with us.
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/properties"
                className="rounded-md bg-white px-8 py-2.5 text-base font-semibold text-indigo-600 shadow-lg hover-glow button-transition"
              >
                Browse Properties
              </Link>
            </motion.div>
            <a href="#" className="text-base font-semibold text-white link-underline">
              Contact Sales →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
