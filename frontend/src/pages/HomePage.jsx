import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Play,
  Clock,
  Users,
  Building2,
  ShieldCheck,
  CheckCircle2,
  HeartPulse,
  Landmark,
  Utensils,
  Scissors,
  FileText,
} from 'lucide-react';

const industries = [
  {
    name: 'Healthcare',
    category: 'Hospital',
    description: 'Manage OPD queues efficiently.',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
    topColor: 'bg-[#CAD8C8]', // Muted sage
    textColor: 'text-[#476045]',
    icon: HeartPulse,
  },
  {
    name: 'Restaurants',
    category: 'Restaurant',
    description: 'Virtual table waitlists and smart seating.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    topColor: 'bg-[#F4CEBC]', // Warm peach
    textColor: 'text-[#8C3415]',
    icon: Utensils,
  },
  {
    name: 'Banks',
    category: 'Bank',
    description: 'Streamline customer service operations.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    topColor: 'bg-[#C3532B]', // Burnt orange
    textColor: 'text-white',
    icon: Landmark,
  },
  {
    name: 'Salons & Spas',
    category: 'Salon',
    description: 'Real-time stylist queue management.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    topColor: 'bg-[#231522]', // Deep plum
    textColor: 'text-white',
    icon: Scissors,
  },
  {
    name: 'Government',
    category: 'Government Office',
    description: 'Tokenized citizen services and renewals.',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    topColor: 'bg-[#CAD8C8]', // Soft sage
    textColor: 'text-[#476045]',
    icon: FileText,
  },
];

const philosophy = [
  {
    title: 'Zero Physical Waiting',
    subtitle: '70% Imagery • Pure Space',
    description: 'Customers take digital passes remotely from anywhere, reclaiming lost time.',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Dynamic Time Estimations',
    subtitle: 'Sub-second Intelligence',
    description: 'Real-time queue depth calculations notify visitors exactly when their turn approaches.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'One-Touch Counter Calling',
    subtitle: 'Quiet Staff Workflow',
    description: 'Counter agents call, advance, or reschedule tickets with effortless architectural grace.',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
  },
];

const HomePage = () => {
  const [activeSlide, setActiveSlide] = useState(1);

  return (
    <div className="flex flex-col min-h-screen bg-[#FBF8F2] dark:bg-[#170E16] text-[#231522] dark:text-[#FAF6F0] transition-colors">
      {/* Hero Section matching Top-Left Reference */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#EDE4D6] dark:border-[#2D1B2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Editorial Text Column */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#231522] dark:text-[#FAF6F0] leading-[1.05] mb-6">
                  Less
                  <br />
                  Waiting.
                  <br />
                  <span className="text-[#C3532B] italic font-normal">More</span>
                  <br />
                  <span className="text-[#C3532B] italic font-normal">Living.</span>
                </h1>

                <p className="text-sm sm:text-base text-[#685465] dark:text-[#C5B5C3] leading-relaxed max-w-md mb-8 font-sans">
                  QFlow helps businesses manage customer queues digitally — so people spend less
                  time waiting and more time doing what matters.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 mb-12">
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-semibold text-[#FBF8F2] bg-[#231522] dark:bg-[#C3532B] hover:bg-[#C3532B] dark:hover:bg-[#231522] transition-all shadow-soft"
                  >
                    <span>Explore Live Demo</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/business/register"
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-xs font-medium text-[#231522] dark:text-[#FAF6F0] hover:text-[#C3532B] transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full border border-[#EDE4D6] dark:border-[#3D2539] flex items-center justify-center">
                      <Play className="h-3 w-3 fill-current text-[#C3532B] ml-0.5" />
                    </div>
                    <span>For Businesses</span>
                  </Link>
                </div>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#EDE4D6] dark:border-[#2D1B2C]">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#231522] dark:text-[#FAF6F0]">
                      500+
                    </h3>
                    <p className="text-[11px] text-[#7A6777] dark:text-[#9E8C9B] font-medium mt-0.5">
                      Businesses
                    </p>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#231522] dark:text-[#FAF6F0]">
                      100K+
                    </h3>
                    <p className="text-[11px] text-[#7A6777] dark:text-[#9E8C9B] font-medium mt-0.5">
                      Happy Customers
                    </p>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#C3532B]">
                      40%
                    </h3>
                    <p className="text-[11px] text-[#7A6777] dark:text-[#9E8C9B] font-medium mt-0.5">
                      Reduced Wait Time
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Architectural Geometric Composition */}
            <div className="lg:col-span-7 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-w-2xl mx-auto"
              >
                {/* Main Large Geometric Cutout Frame */}
                <div className="relative w-full h-full overflow-hidden geometric-cutout-hero shadow-soft-lg bg-[#FAF5EE]">
                  {/* Architectural Photo */}
                  <img
                    src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80"
                    alt="Luxury Reception Lobby"
                    className="w-full h-full object-cover"
                  />

                  {/* Geometric Warm Orange Arch/Circle Overlay on the right */}
                  <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-[#C3532B] opacity-90 mix-blend-multiply pointer-events-none" />

                  {/* Soft Sage Green Pill Overlay at bottom */}
                  <div className="absolute -bottom-8 left-20 w-44 h-24 rounded-full bg-[#CAD8C8] opacity-80 pointer-events-none" />

                  {/* Logo overlay on interior wall */}
                  <div className="absolute top-1/2 left-1/4 -translate-y-1/2 pointer-events-none">
                    <span className="font-sans font-bold text-2xl sm:text-3xl tracking-tight text-white/90 drop-shadow-md">
                      QFlow
                    </span>
                  </div>

                  {/* Deep Plum Right Architectural Strip with Vertical Typography */}
                  <div className="absolute top-0 right-0 bottom-0 w-24 sm:w-28 bg-[#231522] flex flex-col justify-between items-center py-8 text-center text-[#FBF8F2] z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C3532B]" />
                    <div className="font-sans text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-bold text-[#FBF8F2] flex flex-col items-center gap-2.5 px-1 text-center">
                      <span className="leading-tight">A SMOOTHER</span>
                      <span className="leading-tight">TOMORROW</span>
                      <span className="leading-tight">FOR EVERYONE</span>
                    </div>
                    {/* Pagination Numbers */}
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#D8CAB9]">
                      <span>01</span>
                      <span>/</span>
                      <span>03</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Left Floating Mini Token Badge */}
                <div className="absolute -bottom-5 left-6 bg-[#FFFFFF] dark:bg-[#231522] border border-[#EDE4D6] dark:border-[#3D2539] p-3.5 rounded-28 shadow-soft flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#F4CEBC] text-[#8C3415] flex items-center justify-center font-serif font-bold text-sm">
                    Q
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#C3532B] block tracking-wider">
                      Live Queue Stream
                    </span>
                    <span className="text-xs font-bold text-[#231522] dark:text-[#FBF8F2]">
                      Token Q-042 Ready
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section matching Bottom-Left Reference */}
      <section className="py-20 border-b border-[#EDE4D6] dark:border-[#2D1B2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C3532B] mb-2">
                | INDUSTRIES
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#231522] dark:text-[#FAF6F0]">
                Built for Every Space.
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6777] dark:text-[#C5B5C3] mt-2 max-w-xl">
                From healthcare to dining, QFlow adapts to any queuing model with ease.
              </p>
            </div>

            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C3532B] hover:text-[#A43F1B] transition-colors uppercase tracking-wider"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* 5 Distinct Architectural Arch Cards from Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {industries.map((item, idx) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="group flex flex-col justify-between rounded-28 border border-[#EDE4D6] dark:border-[#3D2539] bg-white dark:bg-[#231522] p-3.5 shadow-soft hover:shadow-soft-lg transition-all"
              >
                <div>
                  {/* Top Arch Shape Photograph Container */}
                  <div className="relative aspect-[3/4] w-full rounded-t-full rounded-b-2xl overflow-hidden mb-4 bg-[#F5EFE4]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Arch Top Color Indicator Ribbon */}
                    <div
                      className={`absolute top-0 inset-x-0 h-4 ${item.topColor} opacity-70`}
                    />
                  </div>

                  {/* Minimal Content */}
                  <div className="px-2">
                    <div className="flex items-center gap-2 mb-1.5 text-[#C3532B]">
                      <item.icon className="h-4 w-4" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6777] dark:text-[#9E8C9B]">
                        Service
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#231522] dark:text-[#FAF6F0] mb-1">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-[#7A6777] dark:text-[#C5B5C3] leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Circular Action Button */}
                <div className="px-2 pt-2 border-t border-[#F0EAE1] dark:border-[#331E30] flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#8A7887]">
                    Explore desk
                  </span>
                  <Link
                    to={`/explore?category=${encodeURIComponent(item.category)}`}
                    className="h-8 w-8 rounded-full border border-[#EDE4D6] dark:border-[#3D2539] bg-[#FBF8F2] dark:bg-[#1C111B] flex items-center justify-center text-[#231522] dark:text-white group-hover:bg-[#C3532B] group-hover:text-white transition-all shadow-soft-sm"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Now Serving Highlight Section matching Bottom-Center Reference */}
      <section className="py-20 border-b border-[#EDE4D6] dark:border-[#2D1B2C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-36 overflow-hidden bg-[#231522] text-white shadow-soft-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
              {/* Left Asymmetric Plum Calling Display */}
              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-[#3D2539]">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E28555] mb-6">
                    | NOW SERVING
                  </div>
                  <div className="font-serif text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight mb-4">
                    A-102
                  </div>
                  <p className="text-sm font-semibold text-[#F4CEBC] mb-1">
                    Dr. Smith
                  </p>
                  <p className="text-xs text-[#C5B5C3]">
                    OPD General Consultation • Room 304
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <Link
                    to="/explore"
                    className="h-12 w-12 rounded-full border border-[#EDE4D6]/30 bg-white/10 hover:bg-[#C3532B] text-white flex items-center justify-center transition-all shadow-soft"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Link>

                  <div className="flex items-center gap-3 text-xs text-[#D8CAB9] font-mono">
                    <button
                      onClick={() => setActiveSlide((prev) => (prev === 1 ? 3 : prev - 1))}
                      className="p-1 hover:text-white"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                    <span>02 / 03</span>
                    <button
                      onClick={() => setActiveSlide((prev) => (prev === 3 ? 1 : prev + 1))}
                      className="p-1 hover:text-white"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Architectural Interior with Circular Frame */}
              <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-full overflow-hidden bg-[#1A0E1A]">
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
                  alt="Modern Hospital OPD Lounge"
                  className="w-full h-full object-cover opacity-85"
                />

                {/* Circular Geometric Arch Mask Overlay */}
                <div className="absolute top-1/4 -right-10 w-96 h-96 rounded-full border-4 border-[#C3532B]/60 pointer-events-none" />

                {/* Quote in Architectural Style */}
                <div className="absolute bottom-8 right-8 text-right bg-[#231522]/80 backdrop-blur-sm p-4 rounded-2xl border border-white/10 max-w-xs">
                  <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#F4CEBC]">
                    PEOPLE FIRST.
                    <br />
                    QUEUES SECOND.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / 70% Imagery Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C3532B] mb-2 block">
              ENGINEERED SIMPLICITY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#231522] dark:text-[#FAF6F0]">
              Designed with Spatial Breathing Room
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophy.map((item) => (
              <div
                key={item.title}
                className="rounded-28 border border-[#EDE4D6] dark:border-[#3D2539] bg-white dark:bg-[#231522] p-5 shadow-soft flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden mb-5 bg-[#F5EFE4]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C3532B] block mb-1">
                    {item.subtitle}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#231522] dark:text-[#FAF6F0] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#7A6777] dark:text-[#C5B5C3] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 bg-[#231522] text-[#FBF8F2] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Quiet waiting rooms begin with one click.
          </h2>
          <p className="text-xs sm:text-sm text-[#C5B5C3] max-w-xl mx-auto mb-8 font-sans leading-relaxed">
            Eliminate crowding, streamline staff operations, and let your visitors arrive when you are ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/business/register"
              className="px-8 py-3.5 rounded-full text-xs font-semibold text-white bg-[#C3532B] hover:bg-[#A43F1B] transition-all shadow-soft"
            >
              Register Your Space Free
            </Link>
            <Link
              to="/explore"
              className="px-8 py-3.5 rounded-full text-xs font-semibold text-[#FBF8F2] border border-[#EDE4D6]/30 hover:bg-white/10 transition-all"
            >
              Browse Active Places
            </Link>
          </div>
        </div>

        {/* Decorative architectural circle accent */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full border border-white/5 pointer-events-none" />
      </section>
    </div>
  );
};

export default HomePage;
