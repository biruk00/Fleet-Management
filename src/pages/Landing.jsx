import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { Truck, MapPin, Shield, ArrowRight, Package, Sparkles, Navigation, CheckCircle, Globe, Zap, Eye, ChevronDown, Radio, ShieldCheck, LayoutList, MessageSquare } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import LoginModal from '../components/LoginModal';

/* ── Animated Counter ── */
function AnimatedCounter({ value, suffix = '', duration = 2 }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView && value > 0) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * value));
        if (progress < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    }
  }, [value, duration, isInView]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
}

/* ── Section Reveal ── */
function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Language Toggle ── */
function LangToggle() {
  const { lang, switchLanguage } = useLanguage();
  return (
    <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5 text-xs font-bold">
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1.5 rounded-full transition-all ${lang === 'en' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:text-white'}`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('am')}
        className={`px-3 py-1.5 rounded-full transition-all ${lang === 'am' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:text-white'}`}
      >
        አማ
      </button>
    </div>
  );
}

export default function Landing() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [stats, setStats] = useState({ total: 0, loading: 0, ongoing: 0, parked: 0 });

  useEffect(() => { fetchPublicStats(); }, []);

  const fetchPublicStats = async () => {
    try {
      const { data, error } = await supabase.from('trucks').select('status');
      if (error) throw error;
      if (data) {
        const counts = { total: data.length, loading: 0, ongoing: 0, parked: 0 };
        data.forEach(tr => {
          const s = tr.status?.toLowerCase() || '';
          if (s === 'loading') counts.loading++;
          if (s === 'ongoing') counts.ongoing++;
          if (s === 'parked' || s === 'garage') counts.parked++;
        });
        setStats(counts);
      }
    } catch (err) {
      console.error('Error fetching public stats:', err);
    }
  };

  const CTA = ({ className = '' }) =>
    user ? (
      <Link to="/dashboard" className={`group inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full transition-all ${className}`}>
        {t('hero.cta_dashboard')} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Link>
    ) : (
      <button onClick={() => setIsLoginOpen(true)} className={`group inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full transition-all ${className}`}>
        {t('hero.cta_signin')} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </button>
    );

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-orange-500/30 overflow-hidden">

      {/* ═══════════ NAVBAR ═══════════ */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed w-full z-50 top-0 backdrop-blur-xl bg-[#030712]/70 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Truck className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">GS Trading</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#about" className="hover:text-white transition-colors">{t('nav.about')}</a>
            <a href="#services" className="hover:text-white transition-colors">{t('nav.services')}</a>
            <a href="#fleet" className="hover:text-white transition-colors">{t('nav.fleet')}</a>
            <a href="#contact" className="hover:text-white transition-colors">{t('nav.contact')}</a>
          </div>

          <div className="flex items-center gap-3">
            <LangToggle />
            <CTA className="hidden sm:inline-flex text-sm !px-5 !py-2 text-slate-900 bg-white hover:bg-slate-100 shadow-[0_0_20px_-5px_rgba(255,255,255,0.15)]" />
          </div>
        </div>
      </motion.nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/hero-truck.png" alt="GS Trading Logistics" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/70 via-[#030712]/40 to-[#030712]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/70 via-transparent to-[#030712]/70" />
        </div>

        <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-24">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-md text-orange-300 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" /> {t('hero.badge')}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8"
          >
            {t('hero.title_1')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
              {t('hero.title_2')}
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-12 font-light"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <CTA className="text-slate-900 bg-white hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_60px_-15px_rgba(255,255,255,0.3)] w-full sm:w-auto" />
            <a href="#about" className="px-8 py-4 text-base font-medium text-white/90 border border-white/15 bg-white/5 backdrop-blur-md rounded-full hover:bg-white/10 transition-all w-full sm:w-auto text-center">
              {t('hero.cta_learn')}
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="mt-20 hidden md:flex justify-center"
          >
            <a href="#about" className="animate-bounce text-white/30 hover:text-white/60 transition-colors">
              <ChevronDown className="w-6 h-6" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ ABOUT US ═══════════ */}
      <section id="about" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src="/gs-warehouse.png" alt="GS Trading Headquarters" className="w-full aspect-[4/3] object-cover" />
                </div>
                <div className="absolute -bottom-6 -right-6 lg:-right-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-6 shadow-2xl shadow-orange-500/30">
                  <div className="text-4xl font-black text-white">23+</div>
                  <div className="text-sm font-bold text-white/80">{t('fleet.badge')}</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div>
                <span className="text-orange-400 font-bold text-sm uppercase tracking-widest mb-4 block">{t('nav.about')}</span>
                <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6 leading-tight">
                  {t('hero.title_1')} {t('hero.title_2')}
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-6">
                  {t('hero.subtitle')}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Globe, text: 'Cross-border Shipments' },
                    { icon: Shield, text: 'Health & Safety Standards' },
                    { icon: Zap, text: 'Fast & Reliable Delivery' },
                    { icon: Eye, text: 'GPS & VMS Tracking' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <item.icon className="w-5 h-5 text-orange-400 shrink-0" />
                      <span className="text-sm font-medium text-slate-300">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════ SERVICES ═══════════ */}
      <section id="services" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-20">
              <span className="text-orange-400 font-bold text-sm uppercase tracking-widest mb-4 block">{t('services.label')}</span>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6">
                {t('services.title_1')}<br className="hidden md:block" /> {t('services.title_2')}
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                {t('services.subtitle')}
              </p>
            </div>
          </Reveal>

          {/* Top Row — 2 Large Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Reveal>
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d1322] to-[#0a0f1a] border border-white/5 p-8 lg:p-10 hover:border-orange-500/20 transition-all h-full">
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-[80px] group-hover:bg-orange-500/10 transition-colors" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6">
                    <Radio className="w-7 h-7 text-orange-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{t('services.fleet_mgmt_title')}</h3>
                  <p className="text-slate-400 leading-relaxed">{t('services.fleet_mgmt_desc')}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d1322] to-[#0a0f1a] border border-white/5 p-8 lg:p-10 hover:border-blue-500/20 transition-all h-full">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[80px] group-hover:bg-blue-500/10 transition-colors" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                    <Eye className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight">{t('services.cargo_title')}</h3>
                  <p className="text-slate-400 leading-relaxed">{t('services.cargo_desc')}</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Bottom Row — 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal>
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d1322] to-[#0a0f1a] border border-white/5 p-8 hover:border-emerald-500/20 transition-all h-full">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight">{t('services.vetted_title')}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{t('services.vetted_desc')}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d1322] to-[#0a0f1a] border border-white/5 p-8 hover:border-amber-500/20 transition-all h-full">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5">
                    <LayoutList className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight">{t('services.loads_title')}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{t('services.loads_desc')}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d1322] to-[#0a0f1a] border border-white/5 p-8 hover:border-purple-500/20 transition-all h-full">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight">{t('services.comms_title')}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{t('services.comms_desc')}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════ FLEET IMAGE SHOWCASE ═══════════ */}
      <section id="fleet" className="py-32 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <Reveal>
              <div>
                <span className="text-orange-400 font-bold text-sm uppercase tracking-widest mb-4 block">{t('fleet.label')}</span>
                <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6 leading-tight">
                  {t('fleet.title_1')}<br /> {t('fleet.title_2')}
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">{t('fleet.desc')}</p>

                <div className="flex flex-wrap gap-4 mb-10">
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                    <span className="text-sm font-semibold text-white">{t('fleet.gps')}</span>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-semibold text-white">{t('fleet.safety')}</span>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-sm font-semibold text-white">{t('fleet.monitoring')}</span>
                  </div>
                </div>

                <CTA className="text-slate-900 bg-white hover:bg-slate-100 shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]" />
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/20 to-amber-500/10 rounded-[2rem] blur-2xl opacity-40" />
                <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src="/fleet-aerial.png" alt="GS Trading Fleet" className="w-full aspect-[4/3] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/60 via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-5 -left-5 bg-[#0d1322] border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-sm">
                  <div className="text-3xl font-black text-orange-400"><AnimatedCounter value={23} suffix="+" duration={1.5} /></div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('fleet.badge')}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════ TRUST / AWARD ═══════════ */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 mb-8">
              <CheckCircle className="w-10 h-10 text-orange-400" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
              {t('award.title')}
            </h2>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              {t('award.desc_1')} <span className="text-white font-semibold">{t('award.award_name')}</span> {t('award.desc_2')} <span className="text-white font-semibold">{t('award.desc_3')}</span>.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ CTA SECTION ═══════════ */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-orange-500 to-amber-500 p-12 lg:p-20 text-center">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
                  {t('cta.title')}
                </h2>
                <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10">
                  {t('cta.desc')}
                </p>
                <CTA className="text-orange-600 bg-white hover:bg-slate-50 shadow-2xl shadow-orange-900/30 hover:scale-[1.02] active:scale-[0.98]" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer id="contact" className="border-t border-white/5 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg">GS Trading</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                {t('footer.tagline')}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">{t('footer.contact')}</h4>
              <div className="space-y-3 text-sm text-slate-500">
                <p>info@gstrading.com</p>
                <p>GS trading.PLC.et@gmail.com</p>
                <p>+251-911 20 22 39</p>
                <a href="https://www.google.com/maps?q=8.9009722,38.7614167" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {t('footer.location')}
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">{t('footer.quicklinks')}</h4>
              <div className="space-y-3 text-sm text-slate-500">
                <a href="#about" className="block hover:text-white transition-colors">{t('footer.about_us')}</a>
                <a href="#services" className="block hover:text-white transition-colors">{t('footer.services')}</a>
                <a href="#fleet" className="block hover:text-white transition-colors">{t('footer.our_fleet')}</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-sm">&copy; {new Date().getFullYear()} GS Trading. {t('footer.copyright')}</p>
            <p className="text-slate-700 text-xs">{t('footer.designer')}</p>
          </div>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
