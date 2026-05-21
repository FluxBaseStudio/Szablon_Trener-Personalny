"use client";

import React, { useEffect, useState, useRef } from 'react';

interface CounterProps {
  target: string;
  duration?: number;
  suffix?: string;
}

function Counter({ target, duration = 2000, suffix = "" }: CounterProps) {
  const [count, setCount] = useState<number>(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const end = parseInt(target, 10);
          if (isNaN(end)) return;

          const totalMiliseconds = duration;
          const frameRate = 1000 / 60;
          const totalFrames = Math.round(totalMiliseconds / frameRate);
          let currentFrame = 0;

          const counter = setInterval(() => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            const easeProgress = progress * (2 - progress);
            const currentCount = Math.round(end * easeProgress);

            if (currentFrame === totalFrames) {
              setCount(end);
              clearInterval(counter);
            } else {
              setCount(currentCount);
            }
          }, frameRate);
        }
      },
      { threshold: 0.1 }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [target, duration]);

  return (
    <span ref={elementRef}>
      {count}
      {suffix}
    </span>
  );
}

export default function TrainerLandingPage() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string; desc: string } | null>({
    name: 'ONLINE PRO',
    price: '399 PLN',
    desc: 'Indywidualny plan treningowy i opieka zdalna'
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = (planType: string) => {
    if (planType === 'online') {
      setSelectedPlan({ 
        name: 'ONLINE PRO', 
        price: '399 PLN',
        desc: 'Indywidualny plan treningowy i opieka zdalna'
      });
    } else {
      setSelectedPlan({ 
        name: 'HYBRID ELITE', 
        price: '1499 PLN',
        desc: 'Treningi personalne 1-na-1 + pełne prowadzenie online'
      });
    }
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 font-sans selection:bg-amber-400 selection:text-black overflow-x-hidden">
      
      {/* NAVIGATION */}
      <nav className={`sticky top-0 z-40 w-full bg-white border-b-4 border-black px-6 py-4 flex justify-between items-center transition-all duration-300 ${scrolled ? 'py-2.5 shadow-[0_4px_0_0_rgba(0,0,0,1)]' : ''}`}>
        <span className="text-2xl font-black tracking-tighter uppercase group cursor-pointer">
          RAZOR<span className="text-amber-500 inline-block group-hover:translate-x-1 transition-transform">.</span>FIT
        </span>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCartOpen(true)}
            className="relative p-2 border-2 border-black bg-amber-400 font-bold uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Koszyk ({selectedPlan ? "1" : "0"})
          </button>
          <a 
            href="#cennik" 
            className="bg-black text-white font-bold uppercase tracking-wider text-sm px-6 py-2.5 border-2 border-black hover:bg-amber-400 hover:text-black transition-all duration-150 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
          >
            Zacznij Trening
          </a>
        </div>
      </nav>

      {/* CART MODAL */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black max-w-lg w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b-4 border-black flex justify-between items-center bg-neutral-50">
              <div>
                <p className="text-amber-500 font-black uppercase text-xs tracking-widest mb-0.5">// TWÓJ KOSZYK</p>
                <h3 className="text-2xl font-black uppercase tracking-tight">PODSUMOWANIE</h3>
              </div>
              <button 
                onClick={() => setCartOpen(false)}
                className="w-10 h-10 bg-black text-white font-black text-center flex items-center justify-center border-2 border-black hover:bg-amber-400 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
              >
                X
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {selectedPlan ? (
                <div className="border-2 border-black p-4 bg-neutral-50 flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div>
                    <p className="font-black uppercase text-sm tracking-tight">{selectedPlan.name}</p>
                    <p className="text-neutral-500 text-xs uppercase font-bold mt-0.5">{selectedPlan.desc}</p>
                  </div>
                  <span className="font-black text-lg text-right whitespace-nowrap pl-4">{selectedPlan.price}</span>
                </div>
              ) : (
                <div className="border-2 border-black p-4 bg-neutral-50 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="font-black uppercase text-sm tracking-tight text-neutral-500">Brak wybranego planu. Wybierz pakiet z cennika.</p>
                </div>
              )}

              <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-black text-xs uppercase text-amber-500 mb-4 tracking-wider">// DANE ZAMAWIAJĄCEGO</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wide mb-1 text-neutral-700">Imię i Nazwisko</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="np. Jan Kowalski"
                      className="w-full bg-neutral-50 border-2 border-black p-2.5 text-sm font-bold uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all placeholder:text-neutral-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wide mb-1 text-neutral-700">Adres E-mail</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="np. jan@kowalski.pl"
                      className="w-full bg-neutral-50 border-2 border-black p-2.5 text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all placeholder:text-neutral-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wide mb-1 text-neutral-700">Numer Telefonu</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="np. +48 500 600 700"
                      className="w-full bg-neutral-50 border-2 border-black p-2.5 text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all placeholder:text-neutral-400"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-neutral-100 p-4 border-2 border-dashed border-neutral-400 text-xs font-semibold uppercase tracking-wider text-neutral-600 space-y-1.5">
                <p>• Po sfinalizowaniu płatności automatycznie utworzymy Twoje konto.</p>
                <p>• Dane dostępowe do panelu podopiecznego otrzymasz na podany e-mail.</p>
              </div>
            </div>

            <div className="p-6 border-t-4 border-black bg-neutral-50 space-y-3">
              <button 
                onClick={() => alert(`Dane klienta (${formData.fullName || 'Brak danych'}) zostały zapisane.`)}
                className="w-full bg-black text-white font-black uppercase tracking-wider py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(245,158,11,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                PRZEJDŹ DO FINALIZACJI
              </button>
              <button 
                onClick={() => setCartOpen(false)}
                className="w-full bg-white text-black font-black uppercase tracking-wider py-2.5 border-2 border-black hover:bg-neutral-200 transition-all text-xs"
              >
                Wróć do przeglądania strony
              </button>
            </div>

          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <header className="grid grid-cols-1 lg:grid-cols-12 border-b-4 border-black min-h-[calc(100vh-80px)]">
        <div className="lg:col-span-7 flex flex-col justify-center p-6 md:p-12 lg:p-20 bg-white">
          <div className="inline-block bg-amber-400 text-black font-black uppercase text-xs tracking-widest px-3 py-1 border-2 border-black w-max mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Wyniki {">"} Wymówki</div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            OSTRA FORMA <br />
            <span className="bg-black text-white px-3 py-1 inline-block my-2 transform -rotate-1">BEZ ROZMYWANIA</span> <br />
            FAKTÓW.
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-xl text-neutral-700 mb-10 leading-relaxed border-l-4 border-black pl-4">
            Nie obiecuję cudów w 3 dni. Buduję surową siłę, redukuję tkankę tłuszczową i programuję nawyki, które zostają na lata. Czysta nauka, zero intuicji.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#cennik" className="bg-amber-400 text-black text-center font-black uppercase tracking-wider px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">Wybierz Plan Treningowy</a>
            <a href="#metody" className="bg-white text-black text-center font-bold uppercase tracking-wider px-8 py-4 border-4 border-black hover:bg-neutral-900 hover:text-white transition-colors duration-200">Moja Metodyka</a>
          </div>
        </div>
        <div className="lg:col-span-5 bg-neutral-200 border-t-4 lg:border-t-0 lg:border-l-4 border-black relative min-h-[400px] lg:min-h-auto overflow-hidden">
          <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop" alt="Trener" className="w-full h-full object-cover grayscale contrast-125 brightness-90 transition-transform duration-700 hover:scale-105" />
        </div>
      </header>

      {/* STATS STRIP WITH COUNTERS */}
      <section className="bg-black text-white border-b-4 border-black grid grid-cols-2 md:grid-cols-4 divide-y-4 md:divide-y-0 md:divide-x-4 divide-white text-center">
        <div className="p-8 hover:bg-neutral-900 transition-colors"><p className="text-4xl md:text-6xl font-black text-amber-400"><Counter target="120" suffix="+" /></p><p className="text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-400 mt-2">Metamorfoz</p></div>
        <div className="p-8 hover:bg-neutral-900 transition-colors"><p className="text-4xl md:text-6xl font-black text-amber-400"><Counter target="8" suffix=" lat" /></p><p className="text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-400 mt-2">Doświadczenia</p></div>
        <div className="p-8 hover:bg-neutral-900 transition-colors"><p className="text-4xl md:text-6xl font-black text-amber-400"><Counter target="100" suffix="%" /></p><p className="text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-400 mt-2">Naukowe Podejście</p></div>
        <div className="p-8 hover:bg-neutral-900 transition-colors"><p className="text-4xl md:text-6xl font-black text-amber-400"><Counter target="450" suffix="k+" /></p><p className="text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-400 mt-2">Przerzuconych Ton</p></div>
      </section>

      {/* METHODOLOGY */}
      <section id="metody" className="p-6 md:p-12 lg:p-20 border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-amber-500 font-black uppercase text-sm tracking-widest mb-2">// SYSTEM PRACY</p>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">TRZY FILARY SKUTECZNOŚCI</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-4 border-black p-8 bg-neutral-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              <div className="w-12 h-12 bg-black text-amber-400 flex items-center justify-center font-black text-xl border-2 border-black mb-6">01</div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Periodyzacja Treningowa</h3>
              <p className="text-neutral-700 font-medium">Koniec z losowym machaniem ciężarami. Twój plan ma precyzyjnie rozpisane makrocykle.</p>
            </div>
            <div className="border-4 border-black p-8 bg-neutral-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              <div className="w-12 h-12 bg-black text-amber-400 flex items-center justify-center font-black text-xl border-2 border-black mb-6">02</div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Bilans i Suplementacja</h3>
              <p className="text-neutral-700 font-medium">Żadnych restrykcyjnych diet. Otrzymujesz wyliczone zapotrzebowanie i strategię suplementacyjną.</p>
            </div>
            <div className="border-4 border-black p-8 bg-neutral-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              <div className="w-12 h-12 bg-black text-amber-400 flex items-center justify-center font-black text-xl border-2 border-black mb-6">03</div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Biometria i Raporty</h3>
              <p className="text-neutral-700 font-medium">Co tydzień analizujemy obwody, wagę oraz wideo z wykonaniem kluczowych bojów.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CASE STUDY */}
      <section className="grid grid-cols-1 lg:grid-cols-2 border-b-4 border-black bg-neutral-900 text-white">
        <div className="p-6 md:p-12 lg:p-20 flex flex-col justify-center border-b-4 lg:border-b-0 lg:border-r-4 border-black">
          <p className="text-amber-400 font-black uppercase text-sm tracking-widest mb-2">// DOWÓD ANALITYCZNY</p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">CASE STUDY: REKOMPOZYCJA TOMASZA</h2>
          <div className="space-y-6 border-l-2 border-neutral-700 pl-6 my-6">
            <div><p className="text-neutral-400 text-xs uppercase tracking-wider">Okres współpracy</p><p className="font-bold text-lg">16 tygodni</p></div>
            <div><p className="text-neutral-400 text-xs uppercase tracking-wider">Waga</p><p className="font-bold text-lg text-amber-400">94 kg → 83 kg (-11 kg)</p></div>
          </div>
          <blockquote className="bg-neutral-800 p-6 border-2 border-amber-400 font-medium italic text-neutral-300">
            "Dopiero podejście oparte na ścisłej periodyzacji odmieniło moją sylwetkę."
            <span className="block mt-4 text-white font-black not-italic uppercase text-sm">— Tomasz, 34 lata</span>
          </blockquote>
        </div>
        <div className="bg-neutral-800 relative grid grid-cols-2 divide-x-4 divide-black h-[400px] lg:h-auto overflow-hidden">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop" alt="Przed" className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-500 hover:scale-102" />
          <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop" alt="Po" className="w-full h-full object-cover contrast-150 transition-transform duration-500 hover:scale-102" />
        </div>
      </section>

      {/* PRICING SECTION WITH TABLES */}
      <section id="cennik" className="p-6 md:p-12 lg:p-20 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <p className="text-amber-500 font-black uppercase text-sm tracking-widest mb-2">// WYBIERZ SWÓJ POZIOM</p>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">CENNIK I OFERTA</h2>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* CARD 1: ONLINE PRO */}
          <div className="border-4 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tight">ONLINE PRO</h3>
              <p className="text-neutral-500 text-xs font-bold uppercase mt-1">Współpraca zdalna 100%</p>
              <div className="text-5xl font-black my-6 border-b-4 border-black pb-4">399 PLN <span className="text-sm font-bold text-neutral-500 uppercase tracking-wider">/ msc</span></div>
              
              <table className="w-full text-left text-xs uppercase font-bold tracking-wide mb-8 divide-y-2 divide-black">
                <tbody>
                  <tr><td className="py-2.5 text-neutral-600">Plan treningowy</td><td className="py-2.5 text-right">Indywidualny</td></tr>
                  <tr><td className="py-2.5 text-neutral-600">Rozpiska makro</td><td className="py-2.5 text-right">Tak</td></tr>
                  <tr><td className="py-2.5 text-neutral-600">Raporty wideo</td><td className="py-2.5 text-right">Co tydzień</td></tr>
                  <tr><td className="py-2.5 text-neutral-600">Kontakt z trenerem</td><td className="py-2.5 text-right">Czat / Aplikacja</td></tr>
                  <tr><td className="py-2.5 text-neutral-600">Medyczne konsultacje</td><td className="py-2.5 text-right text-neutral-400">Brak</td></tr>
                </tbody>
              </table>
            </div>
            <button onClick={() => handleAddToCart('online')} className="w-full bg-black text-white font-black uppercase tracking-wider py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(245,158,11,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">KUP PLAN ONLINE</button>
          </div>

          {/* CARD 2: HYBRID ELITE */}
          <div className="border-4 border-black bg-neutral-950 text-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(245,158,11,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col justify-between relative">
            <div>
              <div className="absolute -top-4 right-6 bg-amber-400 text-black border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">Najwyższa jakość</div>
              <h3 className="text-3xl font-black uppercase tracking-tight text-white">HYBRID ELITE</h3>
              <p className="text-neutral-400 text-xs font-bold uppercase mt-1">Trening personalny + online</p>
              <div className="text-5xl font-black my-6 text-amber-400 border-b-4 border-neutral-800 pb-4">1499 PLN <span className="text-sm font-bold text-neutral-400 uppercase tracking-wider">/ msc</span></div>
              
              <table className="w-full text-left text-xs uppercase font-bold tracking-wide mb-8 divide-y-2 divide-neutral-800">
                <tbody>
                  <tr><td className="py-2.5 text-neutral-400">Plan treningowy</td><td className="py-2.5 text-right text-white">Indywidualny</td></tr>
                  <tr><td className="py-2.5 text-neutral-400">Treningi 1-na-1</td><td className="py-2.5 text-right text-amber-400">8 sesji / msc</td></tr>
                  <tr><td className="py-2.5 text-neutral-400">Rozpiska makro</td><td className="py-2.5 text-right text-white">Pełna suplementacja</td></tr>
                  <tr><td className="py-2.5 text-neutral-400">Kontakt z trenerem</td><td className="py-2.5 text-right text-white">Priorytet 24/7</td></tr>
                  <tr><td className="py-2.5 text-neutral-400">Analiza badań krwi</td><td className="py-2.5 text-right text-amber-400">Tak (Co kwartał)</td></tr>
                </tbody>
              </table>
            </div>
            <button onClick={() => handleAddToCart('hybrid')} className="w-full bg-amber-400 text-black font-black uppercase tracking-wider py-4 border-2 border-amber-400 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">ZAREZERWUJ MIEJSCE</button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white p-8 md:p-12 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-xl font-black uppercase tracking-tight">RAZOR<span className="text-amber-500">.</span>FIT</p>
          <p className="text-neutral-500 text-xs uppercase tracking-wider mt-1">© 2026 Wszelkie prawa zastrzeżone. Projekt wdrożony na infrastrukturze FluxBase.</p>
        </div>
        <div className="flex gap-6 text-sm font-bold uppercase tracking-wider">
          <span className="text-neutral-400">Warszawa, Polska</span>
          <span className="text-amber-400 hover:underline cursor-pointer">kontakt@razor.fit</span>
        </div>
      </footer>
    </div>
  );
}