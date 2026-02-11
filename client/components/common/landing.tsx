"use client";

import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/router';
import { useModal } from "@/context/ModalContext";

interface Slide {
  id: number;
  image: string;
  heading: string;
  name1: string;
  name2: string;
  buttonText: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/assets/image/perfumewonan.png",
    heading: "Not just perfume. An experience.",
    name1: "Empire ",
    name2: "Fragrance!",
    buttonText: "Shop Now",
  },
  {
    id: 2,
    image: "/assets/image/perfumeman2.png",
    heading: "Command the room. Elegance, bottled.",
    name1: "Empire ",
    name2: "Fragrance!",
    buttonText: "Shop Now",
  },
  {
    id: 3,
    image: "/assets/image/perfumewoman2.png",
    heading: "Luxury in every drop. Redefines timeless allure.",
    name1: "Empire ",
    name2: "Fragrance!",
    buttonText: "Explore Collections",
  },
];

const SLIDE_DURATION = 5000; // total time per slide (ms)

const LandingSlider: FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // autoplay
  useEffect(() => {
    const timer = setTimeout(() => {
      goToSlide(index + 1, 1);
    }, SLIDE_DURATION);

    return () => clearTimeout(timer);
  }, [index]);

  const goToSlide = (newIndex: number, newDirection: 1 | -1) => {
    setDirection(newDirection);
    setIndex((prev) => {
      const total = slides.length;
      const normalized = ((newIndex % total) + total) % total;
      return normalized;
    });
  };

  const handleNext = () => goToSlide(index + 1, 1);
  const handlePrev = () => goToSlide(index - 1, -1);

  const slideVariants = {
    enter: (dir: 1 | -1) => ({
      x: dir === 1 ? "100%" : "-100%", // from right if going forward, from left if going back
      opacity: 0,
    }),
    center: {
      x: "0%",
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
    exit: (dir: 1 | -1) => ({
      x: dir === 1 ? "-100%" : "100%", // leave to left if forward, right if back
      opacity: 0,
      transition: {
        duration: 0.8,
      },
    }),
  };

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number } }
  ) => {
    const threshold = 80;
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
  };

  const currentSlide = slides[index];


   const [showRegister, setShowRegister] = useState(false);
      const [showLogin, setShowLogin] = useState(false);
      const { setActiveModal } = useModal();
  
      const [isOpen, setIsOpen] = useState(false);
      const [isSidebarOpen, setIsSidebarOpen] = useState(false);
      const [lastScrollY, setLastScrollY] = useState(0);
      const [showHeader, setShowHeader] = useState(true);
      const router = useRouter();
  
      /*const isActive = (href: string) => router.pathname === href;*/
      const isActive = (...paths: string[]) => paths.includes(router.pathname);
  
  
      const toggleSidebar = () => { setIsSidebarOpen(prev => !prev); }
  
      useEffect(() => {
          const handleScroll = () => {
              const currentScrollY = window.scrollY;
  
              if (currentScrollY > lastScrollY && currentScrollY > 100) {
                  setShowHeader(false); // scrolling down
              } else {
                  setShowHeader(true); // scrolling up
              }
  
              setLastScrollY(currentScrollY);
          };
  
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
      }, [lastScrollY]);

  return (
    <section className="relative w-full overflow-hidden bg-black text-white">
      <div className="relative mx-auto flex h-[420px] max-w-6xl items-center px-4 sm:h-[480px] lg:h-[560px] lg:px-8">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 flex"
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-60"
              style={{ backgroundImage: `url(${currentSlide.image})` }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />

            {/* Content */}
            <div className="relative z-10 flex h-full w-full flex-col items-start justify-center gap-4 px-4 sm:max-w-md sm:px-6 lg:max-w-lg">
              <motion.p
                className="text-sm uppercase tracking-[0.25em] text-amber-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Fragrance Collection
              </motion.p>

              <motion.h2
                className="text-2xl font-semibold sm:text-3xl lg:text-4xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {currentSlide.heading}
              </motion.h2>

              <motion.h1
                className="text-3xl font-bold sm:text-4xl lg:text-5xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <span className="text-amber-300">{currentSlide.name1}</span>
                <span className="text-white">{currentSlide.name2}</span>
              </motion.h1>

              <motion.p
                className="max-w-md text-sm text-gray-200 sm:text-base"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Discover scents crafted to define your presence, turn heads, and leave a memory long after you’ve left
                the room.
              </motion.p>

              <motion.div
                className="mt-2 flex gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <button
                onClick={() => setActiveModal('login')}
                 className="rounded-full bg-amber-400 px-6 py-2 text-sm font-semibold text-black shadow-lg shadow-amber-500/40 transition hover:bg-amber-300">
                  {currentSlide.buttonText}
                </button>
                <a href="/user/about" className="rounded-full border border-white/40 px-6 py-2 text-sm font-medium text-white/90 transition hover:border-white hover:text-white">
                  Learn More
                </a>
              </motion.div>
            </div>

            {/* Right-side large image (visible on larger screens) */}
            <div className="pointer-events-none relative hidden h-full flex-1 items-center justify-center md:flex">
              <motion.img
                src={currentSlide.image}
                alt={currentSlide.heading}
                className="h-[70%] max-h-[420px] object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.9)]"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Left/right arrows */}
        <div className="pointer-events-none absolute inset-y-0 flex w-full items-center justify-between px-2 sm:px-4">
          <button
            type="button"
            onClick={handlePrev}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white shadow-md transition hover:bg-black/70 sm:h-10 sm:w-10"
          >
            <span className="-ml-[1px] text-lg">&#8592;</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white shadow-md transition hover:bg-black/70 sm:h-10 sm:w-10"
          >
            <span className="ml-[1px] text-lg">&#8594;</span>
          </button>
        </div>

        {/* Dots */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-6">
          {slides.map((slide, i) => {
            const isActive = i === index;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(i, i > index ? 1 : -1)}
                className={`pointer-events-auto h-2 rounded-full transition-all ${
                  isActive ? "w-6 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingSlider;



/*
import { Abril_Fatface } from 'next/font/google';
import Image from 'next/image';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import { motion } from 'framer-motion';

const slides = [
    {
        id: 1,
        image: '/assets/image/perfumewonan.png',
        heading: 'Not just perfume. An experience.',
        name1: 'Empire ',
        name2: 'Fragrance!',
        buttonText: 'Shop Now',
    },
    {
        id: 2,
        image: '/assets/image/perfumeman2.png',
        heading: 'Command the room. Elegance, bottled.',
        name1: 'Empire ',
        name2: 'Fragrance!',
        buttonText: 'Shop Now',
    },
    {
        id: 3,
        image: '/assets/image/perfumewoman2.png',
        heading: 'Luxury in every drop. Redefines timeless allure.',
        name1: 'Empire ',
        name2: 'Fragrance!',
        buttonText: 'Explore Collections',
    },
];

const greatVibes = Abril_Fatface({
    subsets: ['latin'],
    weight: ['400'],
});

export default function LandingSlider() {
     const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="relative w-full h-[500px] xs:h-[600px] overflow-hidden bg-gradient-to-bl pt-4 from-[#171717] via-[#464646] to-[#171717]">
            <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                speed={1000}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                className="w-full h-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={slide.id}>
                        <div className="flex justify-center items-center w-full h-[500px] xs:h-[600px] relative">
                            {activeIndex === index && (
                                <motion.div
                                    key={slide.id + "-image"}
                                    initial={{ x: index === 0 ? 0 : 300, opacity: 0 }}
                                    animate={{ 
                                        x: activeIndex === index ? 0 : -300, 
                                        opacity: activeIndex === index ? 1 : 0 
                                    }}
                                    transition={{ delay: 1, duration: 0.8 }}

                                    className="relative flex flex-col w-full justify-center items-start pl-4 xs:pl-8 gap-4 z-10 rounded-md bg-black/40 p-4"
                                >
                                    <h1 className="font-bold text-2xl text-gray-300">{slide.heading}</h1>

                                    <div className="flex gap-2 flex-col items-center justify-center">
                                        <h1 className={`${greatVibes.className} font-extrabold text-4xl flex flex-nowrap text-secondary`}>
                                            {slide.name1}
                                        </h1>
                                        <h1 className={`${greatVibes.className} font-extrabold text-4xl flex flex-nowrap text-secondary`}>
                                            {slide.name2}
                                        </h1>
                                    </div>

                                    <button className="px-4 py-2 w-full max-w-[220px] hover:bg-white flex justify-center items-center bg-gray-300 rounded text-gray-700 hover:text-gray-900 font-bold transition duration-300">
                                        {slide.buttonText}
                                    </button>
                                </motion.div>)}

                            <Image
                                src={slide.image}
                                alt="Slide Image"
                                width={500}
                                height={500}
                                className="object-cover absolute top-0 right-0 h-[500px] xs:h-[600px]"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}*/