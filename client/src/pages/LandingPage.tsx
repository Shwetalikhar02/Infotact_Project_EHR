import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Video, Calendar, FileText, ArrowRight, Shield, Star,
  CheckCircle, ChevronRight, Stethoscope, Heart, Activity,
  Phone, Mail, MapPin, Lock, Users, Award, Clock, User,
  ChevronDown, Send, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ROUTE_PATHS } from '@/lib/index';
import { TESTIMONIALS } from '@/data/index';
import { toast } from 'sonner';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link to={ROUTE_PATHS.HOME} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Stethoscope size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">MediConnect</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {['Features', 'How It Works', 'Testimonials', 'FAQ', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => document.getElementById(item.toLowerCase().replace(/ /g, '-'))?.scrollIntoView({ behavior: 'smooth' })}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to={ROUTE_PATHS.LOGIN}>
              <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10 border border-white/20">
                Sign In
              </Button>
            </Link>
            <Link to={ROUTE_PATHS.REGISTER}>
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-white rounded-full px-5 font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-primary pt-16">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-accent/8 translate-x-1/2 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/3 -translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-accent rounded-full opacity-60" />
          <div className="absolute top-40 right-1/3 w-3 h-3 bg-white/30 rounded-full" />
          <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-accent/60 rounded-full" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center py-16">
            {/* Left Content */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
                <Shield size={14} className="text-accent" />
                <span className="text-accent text-sm font-medium">HIPAA Compliant & Secure</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Healthcare at{' '}
                <span className="text-accent">Your</span>{' '}
                Fingertips
              </motion.h1>

              <motion.p variants={fadeUp} className="text-white/70 text-lg lg:text-xl leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Connect with board-certified doctors instantly. Book appointments, attend video consultations, and receive digital prescriptions — all from the comfort of your home.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => navigate(ROUTE_PATHS.LOGIN)}
                  className="bg-accent hover:bg-accent/90 text-white rounded-full px-8 py-3 text-base font-semibold hero-glow gap-2"
                >
                  Book Appointment
                  <ArrowRight size={18} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate(ROUTE_PATHS.LOGIN)}
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white rounded-full px-8 py-3 text-base font-semibold gap-2"
                >
                  Doctor Login
                  <ChevronRight size={18} />
                </Button>
              </motion.div>

              {/* Quick Stats */}
              <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-6 justify-center lg:justify-start">
                {[
                  { label: 'Active Doctors', value: '500+', icon: <Users size={16} /> },
                  { label: 'Patients Served', value: '50K+', icon: <Heart size={16} /> },
                  { label: 'Avg. Wait Time', value: '< 5 min', icon: <Clock size={16} /> },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <span className="text-accent">{stat.icon}</span>
                    <div>
                      <p className="text-white font-bold text-lg leading-tight">{stat.value}</p>
                      <p className="text-white/50 text-xs">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Visual Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              {/* Floating Card - Main */}
              <div className="bg-card rounded-2xl p-6 shadow-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Video size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-foreground font-semibold text-sm">Video Consultation</p>
                    <p className="text-muted-foreground text-xs">Dr. Michael Chen • Cardiologist</p>
                  </div>
                  <span className="ml-auto text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">Live</span>
                </div>

                {/* Fake video area */}
                <div className="bg-primary rounded-xl h-40 mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent/20" />
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                      <User size={28} className="text-white/60" />
                    </div>
                    <p className="text-white/60 text-xs">Dr. Michael Chen</p>
                  </div>
                  {/* Self-view PiP */}
                  <div className="absolute bottom-3 right-3 w-16 h-12 bg-white/20 rounded-lg border border-white/30 flex items-center justify-center">
                    <User size={14} className="text-white/50" />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                  {['bg-muted', 'bg-muted', 'bg-red-500'].map((color, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
                      <Activity size={16} className={color === 'bg-red-500' ? 'text-white' : 'text-muted-foreground'} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating mini card - appointment */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -left-8 bg-card rounded-xl p-4 shadow-xl border border-border w-52"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-accent" />
                  <span className="text-xs font-semibold text-foreground">Next Appointment</span>
                </div>
                <p className="text-foreground text-sm font-medium">May 6, 2026</p>
                <p className="text-muted-foreground text-xs">10:00 AM • Cardiology</p>
              </motion.div>

              {/* Floating mini card - prescription */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-6 -right-4 bg-card rounded-xl p-4 shadow-xl border border-border w-48"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={14} className="text-accent" />
                  <span className="text-xs font-semibold text-foreground">Prescription Ready</span>
                </div>
                <p className="text-muted-foreground text-xs">Cetirizine 10mg</p>
                <div className="mt-2 flex items-center gap-1">
                  <CheckCircle size={12} className="text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Digitally Signed</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-accent text-sm font-semibold uppercase tracking-widest">Why MediConnect</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Everything You Need for Modern Healthcare</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Our platform combines cutting-edge technology with clinical expertise to deliver an unmatched healthcare experience.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Video size={28} />,
                title: 'Secure Video Consultations',
                desc: 'HD video calls with end-to-end encryption. Consult with specialists from anywhere in the world, at any time.',
                color: 'bg-blue-50 text-blue-600',
                border: 'border-blue-100',
              },
              {
                icon: <Calendar size={28} />,
                title: 'Smart Scheduling',
                desc: 'AI-powered scheduling that matches you with the right doctor. Choose from hundreds of available slots across specialties.',
                color: 'bg-teal-50 text-teal-600',
                border: 'border-teal-100',
              },
              {
                icon: <FileText size={28} />,
                title: 'Digital Prescriptions',
                desc: 'Receive digitally signed prescriptions instantly after your consultation. Securely stored in your health records.',
                color: 'bg-purple-50 text-purple-600',
                border: 'border-purple-100',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-card rounded-2xl p-8 border ${feature.border} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
              >
                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-foreground font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Extra Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: <Lock size={18} />, label: 'HIPAA Compliant' },
              { icon: <Shield size={18} />, label: 'Data Encrypted' },
              { icon: <Award size={18} />, label: 'Board Certified' },
              { icon: <Activity size={18} />, label: '24/7 Support' },
            ].map((item) => (
              <div key={item.label} className="bg-card rounded-xl p-4 border border-border flex items-center gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  {item.icon}
                </div>
                <span className="text-foreground text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/8 translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-accent text-sm font-semibold uppercase tracking-widest">Simple Process</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mt-2 mb-4">Get Care in 3 Easy Steps</h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">From registration to consultation in minutes. Healthcare designed around your busy life.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-white/10" />

            {[
              { step: '01', title: 'Register', desc: 'Create your free account in under 2 minutes. Verify your identity and set up your health profile securely.', icon: <User size={28} /> },
              { step: '02', title: 'Book', desc: 'Search for doctors by specialty. View their availability, ratings, and book the perfect slot that works for you.', icon: <Calendar size={28} /> },
              { step: '03', title: 'Consult', desc: 'Join your secure video consultation. Get your diagnosis, treatment plan, and digital prescription instantly.', icon: <Video size={28} /> },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative z-10"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mx-auto">
                    {step.icon}
                  </div>
                  <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{step.step.slice(1)}</span>
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-white/60 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              size="lg"
              onClick={() => navigate(ROUTE_PATHS.REGISTER)}
              className="bg-accent hover:bg-accent/90 text-white rounded-full px-10 gap-2 font-semibold"
            >
              Start Your Free Account
              <ArrowRight size={18} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-accent text-sm font-semibold uppercase tracking-widest">Real Stories</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Trusted by Thousands</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm"
              >
                <div className="flex mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-5 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-foreground font-semibold text-sm">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 bg-accent/10 border-y border-accent/20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Ready to Transform Your Healthcare Experience?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">Join 50,000+ patients who've already discovered a better way to access care.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate(ROUTE_PATHS.REGISTER)} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 gap-2 font-semibold">
                Create Free Account <ArrowRight size={18} />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate(ROUTE_PATHS.LOGIN)} className="rounded-full px-8 border-primary/30 text-primary hover:bg-primary/5 gap-2">
                Sign In <ChevronRight size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-accent text-sm font-semibold uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Everything you need to know about MediConnect.</p>
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-3">
            <FAQItem
              q="How do I book an appointment?"
              a="Simply create a free account, browse our doctors by specialty, choose an available time slot, and confirm your booking. You'll receive a confirmation instantly."
            />
            <FAQItem
              q="Is my medical data secure?"
              a="Absolutely. MediConnect is fully HIPAA compliant. All data is encrypted at rest and in transit using AES-256 encryption. We never share your data with third parties."
            />
            <FAQItem
              q="How does the video consultation work?"
              a="Once your appointment is confirmed, you'll see a 'Join Call' button on your dashboard 5 minutes before the scheduled time. Click it to enter a secure, end-to-end encrypted video room with your doctor."
            />
            <FAQItem
              q="Can I get prescriptions through video calls?"
              a="Yes! After your consultation, your doctor can issue a digitally signed prescription which will appear in your Prescriptions tab. You can download it as a PDF."
            />
            <FAQItem
              q="What if I need to cancel or reschedule?"
              a="You can cancel or reschedule appointments up to 2 hours before the scheduled time from your dashboard. There are no cancellation fees for rescheduling."
            />
            <FAQItem
              q="Is MediConnect free to use?"
              a="Creating an account is completely free. You only pay for consultations, and the fees are set transparently by each doctor on their profile."
            />
          </div>
        </div>
      </section>

      {/* ── Contact Form Section ── */}
      <section id="contact" className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent/8 translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-accent text-sm font-semibold uppercase tracking-widest">Get in Touch</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mt-2 mb-4">We'd Love to Hear From You</h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">Have a question, partnership inquiry, or feedback? Send us a message and our team will get back to you within 24 hours.</p>
              <div className="space-y-4">
                {[
                  { icon: <Mail size={18} />, label: 'support@mediconnect.com' },
                  { icon: <Phone size={18} />, label: '+1 (800) MEDI-CON' },
                  { icon: <MapPin size={18} />, label: 'San Francisco, CA 94102' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent">{item.icon}</div>
                    <span className="text-white/70 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <Stethoscope size={16} className="text-white" />
                </div>
                <span className="font-bold text-xl">MediConnect</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Connecting patients and doctors for a healthier world through secure telemedicine.
              </p>
              <div className="flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-3 py-1.5 w-fit">
                <Shield size={12} className="text-accent" />
                <span className="text-accent text-xs font-semibold">HIPAA Compliant</span>
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Platform', links: ['Book Appointment', 'For Doctors', 'For Hospitals', 'Pricing'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press'] },
              { title: 'Contact', links: [] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-4 text-white/90">{col.title}</h4>
                {col.links.length > 0 ? (
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-white/50 hover:text-white text-sm transition-colors">{link}</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/50 text-sm"><Mail size={14} /> support@mediconnect.com</div>
                    <div className="flex items-center gap-2 text-white/50 text-sm"><Phone size={14} /> +1 (800) MEDI-CON</div>
                    <div className="flex items-center gap-2 text-white/50 text-sm"><MapPin size={14} /> San Francisco, CA</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">© 2026 MediConnect. All rights reserved.</p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service', 'HIPAA Notice'].map((link) => (
                <a key={link} href="#" className="text-white/40 hover:text-white/70 text-xs transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── FAQ Accordion Item ──────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="text-foreground font-medium text-sm pr-4">{q}</span>
        <ChevronDown size={18} className={`text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-5 pb-5"
        >
          <p className="text-muted-foreground text-sm leading-relaxed">{a}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Contact Form ────────────────────────────────────────────────────────────
import api from '@/lib/axios';

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    
    try {
      // Call the real backend feedback API
      // Passing rating: 5 as default since it's required by the backend
      await api.post('/feedback', { 
        name: form.name, 
        email: form.email, 
        message: form.message,
        rating: 5 
      });
      
      toast.success('Message sent successfully!', { description: "We'll get back to you within 24 hours." });
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Feedback error:", error);
      toast.error('Failed to send message', { description: "Please try again later or contact us directly." });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare size={18} className="text-accent" />
        <h3 className="text-white font-semibold">Send a Message</h3>
      </div>
      <div>
        <Input
          placeholder="Your Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
          required
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
          required
        />
      </div>
      <div>
        <Textarea
          placeholder="Your Message..."
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={sending}
        className="w-full bg-accent hover:bg-accent/90 text-white rounded-full gap-2 font-semibold"
      >
        {sending ? 'Sending...' : <><Send size={16} /> Send Message</>}
      </Button>
    </form>
  );
}
