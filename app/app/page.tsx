'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingParticles, FogEffect, SmokeEffect, MysteryOrbs, FlickeringLight, Vignette } from '@/components/ui/FloatingParticles';
import { TypewriterText, AnimatedCounter } from '@/components/ui/TypewriterText';
import MusicThemeSetter from '@/components/MusicThemeSetter';
import { useStats } from '@/lib/hooks/useStats';

const FEATURES = [
  {
    icon: '🔍',
    title: 'INVESTIGATE MYSTERIES',
    description: 'Examine crime scenes, collect evidence, and piece together clues to solve intricate cases.',
  },
  {
    icon: '🧩',
    title: 'CRACK THE CODE',
    description: 'Solve cryptic puzzles, decode secret messages, and unlock hidden chambers.',
  },
  {
    icon: '🎭',
    title: 'INTERROGATE SUSPECTS',
    description: 'Question witnesses, spot lies, and deduce the truth from their testimonies.',
  },
  {
    icon: '🏆',
    title: 'EARN YOUR BADGE',
    description: 'Rise through the ranks from Rookie to Master Detective with every case you crack.',
  },
];

const TESTIMONIALS = [
  {
    quote: "The most immersive detective experience I've ever had. Every case feels like a real investigation!",
    author: 'Agent Shadow',
    role: 'Senior Investigator',
    rating: 5,
  },
  {
    quote: "My students are completely engaged. They're learning critical thinking without even realizing it.",
    author: 'Inspector Chen',
    role: 'Academy Instructor',
    rating: 5,
  },
  {
    quote: "Finally cracked the Midnight Heist case after 3 hours. Best feeling ever!",
    author: 'Detective Nova',
    role: 'Junior Detective',
    rating: 5,
  },
];

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { stats } = useStats();

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <MusicThemeSetter theme="menu" />

      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/detective-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      <div
        className="fixed inset-0 z-[1]"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      {/* Atmospheric Effects - Layered for depth */}
      <Vignette className="z-[2]" intensity={0.7} />
      <SmokeEffect className="z-[3]" />
      <MysteryOrbs className="z-[4]" />
      <FloatingParticles count={60} color="rgba(255, 215, 0, 0.25)" className="z-[5]" />
      <FogEffect className="z-[6]" />
      <FlickeringLight className="z-[7]" />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
              className="mb-6 inline-block"
            >
              <div
                className="text-8xl md:text-9xl"
                style={{ filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))' }}
              >
                🔎
              </div>
            </motion.div>

            {/* Title */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[0.15em] mb-4"
              style={{
                color: '#ffd700',
                textShadow: '0 0 30px rgba(255, 215, 0, 0.8), 0 0 60px rgba(255, 215, 0, 0.4), 0 4px 0 #b8860b',
                fontFamily: "'Impact', 'Arial Black', sans-serif",
              }}
            >
              {showContent ? (
                <TypewriterText text="DETECTIVE SIGMA" speed={100} cursor={false} />
              ) : (
                'DETECTIVE SIGMA'
              )}
            </h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-xl md:text-2xl lg:text-3xl tracking-[0.4em] uppercase font-bold mb-2"
              style={{
                color: '#ff9500',
                textShadow: '0 0 20px rgba(255, 149, 0, 0.6)',
              }}
            >
              CLASSIFIED INVESTIGATIONS UNIT
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="text-lg md:text-xl text-amber-400/70 font-mono tracking-widest mb-8"
            >
              WHERE MYSTERIES MEET THEIR MATCH
            </motion.p>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <div className="h-0.5 w-24 md:w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              <span className="text-amber-400 text-sm font-mono tracking-widest">EST. 2025</span>
              <div className="h-0.5 w-24 md:w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            </motion.div>

            {/* Stats - Real data from database */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12"
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400 font-mono">
                  {showContent && stats ? <AnimatedCounter end={stats.casesSolved} duration={2500} delay={2200} /> : '0'}
                </div>
                <div className="text-amber-400/60 text-xs tracking-[0.3em] uppercase mt-1">Cases Cracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400 font-mono">
                  {showContent && stats ? <AnimatedCounter end={stats.solveRate} duration={2500} delay={2400} suffix="%" /> : '0'}
                </div>
                <div className="text-amber-400/60 text-xs tracking-[0.3em] uppercase mt-1">Solve Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400 font-mono">
                  {showContent && stats ? <AnimatedCounter end={stats.detectivesCount} duration={2500} delay={2600} /> : '0'}
                </div>
                <div className="text-amber-400/60 text-xs tracking-[0.3em] uppercase mt-1">Active Agents</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/login"
                className="group relative px-8 py-4 rounded font-black text-lg tracking-[0.2em] uppercase transition-all hover:scale-105 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
                  color: '#000000',
                  boxShadow: '0 0 30px rgba(255, 215, 0, 0.5), 0 4px 15px rgba(0, 0, 0, 0.3)',
                  border: '2px solid #ffea00',
                  fontFamily: "'Courier New', monospace",
                }}
              >
                <span className="relative z-10">⚡ BEGIN INVESTIGATION</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
              <Link
                href="/register/student"
                className="group px-8 py-4 rounded font-bold text-lg tracking-[0.15em] uppercase transition-all hover:scale-105 font-mono"
                style={{
                  background: 'rgba(255, 215, 0, 0.1)',
                  color: '#ffd700',
                  border: '2px solid #ffd700',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
                }}
              >
                🎓 JOIN THE AGENCY
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-amber-400/60 text-center"
            >
              <div className="text-xs tracking-widest mb-2 font-mono">SCROLL TO EXPLORE</div>
              <div className="text-2xl">↓</div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-center mb-4 tracking-[0.2em]"
              style={{
                color: '#ffd700',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
                fontFamily: "'Impact', 'Arial Black', sans-serif",
              }}
            >
              🕵️ YOUR MISSION BRIEFING
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-amber-400/70 font-mono tracking-wider mb-12 max-w-2xl mx-auto"
            >
              MASTER THE ART OF DEDUCTION. EVERY CLUE COUNTS. EVERY DETAIL MATTERS.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 rounded-lg transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(13, 13, 13, 0.9) 100%)',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)',
                  }}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-amber-400 font-bold text-sm tracking-[0.15em] mb-2 font-mono">
                    {feature.title}
                  </h3>
                  <p className="text-amber-400/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 relative">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-center mb-4 tracking-[0.2em]"
              style={{
                color: '#ffd700',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
                fontFamily: "'Impact', 'Arial Black', sans-serif",
              }}
            >
              📜 FIELD REPORTS
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center text-amber-400/70 font-mono tracking-wider mb-12"
            >
              DISPATCHES FROM OUR ELITE OPERATIVES
            </motion.p>

            <div className="relative h-64">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 p-8 rounded-lg text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(13, 13, 13, 0.9) 100%)',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                  }}
                >
                  <div className="text-amber-400 text-2xl mb-4">
                    {'⭐'.repeat(TESTIMONIALS[currentTestimonial].rating)}
                  </div>
                  <p className="text-amber-100/80 text-lg italic mb-6 font-mono">
                    "{TESTIMONIALS[currentTestimonial].quote}"
                  </p>
                  <div className="text-amber-400 font-bold tracking-wider">
                    — {TESTIMONIALS[currentTestimonial].author}
                  </div>
                  <div className="text-amber-400/60 text-sm font-mono tracking-widest">
                    {TESTIMONIALS[currentTestimonial].role}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'bg-amber-400 w-6'
                      : 'bg-amber-400/30 hover:bg-amber-400/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center p-12 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(13, 13, 13, 0.95) 100%)',
              border: '3px solid #ffd700',
              boxShadow: '0 0 50px rgba(255, 215, 0, 0.3)',
            }}
          >
            <div className="text-6xl mb-6">🎖️</div>
            <h2
              className="text-3xl md:text-4xl font-black tracking-[0.15em] mb-4"
              style={{
                color: '#ffd700',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
                fontFamily: "'Impact', 'Arial Black', sans-serif",
              }}
            >
              THE CASE AWAITS
            </h2>
            <p className="text-amber-400/70 font-mono tracking-wider mb-8 max-w-xl mx-auto">
              UNSOLVED MYSTERIES PILE UP BY THE HOUR. THE CITY NEEDS YOUR SHARP MIND.
              WILL YOU ANSWER THE CALL, DETECTIVE?
            </p>
            <Link
              href="/login"
              className="inline-block group relative px-10 py-5 rounded font-black text-xl tracking-[0.2em] uppercase transition-all hover:scale-105 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
                color: '#000000',
                boxShadow: '0 0 40px rgba(255, 215, 0, 0.6), 0 4px 20px rgba(0, 0, 0, 0.4)',
                border: '3px solid #ffea00',
                fontFamily: "'Courier New', monospace",
              }}
            >
              <span className="relative z-10">🔓 ACCEPT THE MISSION</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-amber-500/20">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-amber-400/50 text-sm font-mono tracking-widest">
              ⚠️ CLASSIFIED • SIGMA HQ • TANJONG PAGAR • EST. 2025 ⚠️
            </p>
            <p className="text-amber-400/30 text-xs font-mono mt-2">
              "When you have eliminated the impossible, whatever remains must be the truth."
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
