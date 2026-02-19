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
import ScrollProgressBar from './components/ScrollProgressBar'
import TypingEffect from './components/TypingEffect'
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
      <ScrollProgressBar />
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
    return <div>Loading properties...</div>;
  }

  if (properties.length === 0) {
    return <div>No properties available at the moment.</div>;
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
              <TypingEffect 
                text="Find Your Dream Property" 
                speed={60}
                delay={300}
                className="text-5xl font-bold tracking-tight text-white sm:text-6xl"
              />
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

      {/* CTA Section - Premium Design */}
      <div ref={ctaRef} className="relative isolate overflow-hidden py-24 sm:py-32">
        {/* Multi-layer gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/20 -z-10" />
        
        {/* Animated decorative elements */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
          {/* Content Container with Glassmorphism */}
          <motion.div
            className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-12 sm:p-16 shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-white/20 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-white/20 rounded-br-3xl" />

            {/* Main Content */}
            <div className="text-center space-y-8">
              {/* Eyebrow text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-block"
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-pink-500/20 border border-white/20 backdrop-blur-sm">
                  <motion.span
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-pink-400"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm font-semibold bg-gradient-to-r from-blue-200 to-pink-200 bg-clip-text text-transparent">
                    Ready for your next move?
                  </span>
                </span>
              </motion.div>

              {/* Main heading */}
              <motion.h2
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="block bg-gradient-to-r from-blue-200 via-white to-pink-200 bg-clip-text text-transparent pb-2">
                  Find Your Perfect Property
                </span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl mt-4 bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  Today
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p
                className="mx-auto max-w-2xl text-lg sm:text-xl text-indigo-100/90 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Join thousands of satisfied clients who found their dream properties with us. 
                Expert guidance, premium listings, and exceptional service.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {/* Primary Button */}
                <Link to="/properties">
                  <motion.button
                    className="group relative px-10 py-4 sm:px-12 sm:py-5 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-bold text-lg rounded-xl shadow-2xl overflow-hidden"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Button shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -z-10"
                      animate={{ x: [-100, 400] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    />
                    <span className="relative flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Browse Properties
                    </span>
                  </motion.button>
                </Link>

                {/* Secondary Button */}
                <motion.a
                  href="#contact"
                  className="px-10 py-4 sm:px-12 sm:py-5 border-2 border-white/30 hover:border-white/60 text-white font-bold text-lg rounded-xl backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Sales
                </motion.a>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-indigo-100/70"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>12,000+ Happy Clients</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>4.9/5 Average Rating</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
