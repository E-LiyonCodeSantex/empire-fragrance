import { useState, useRef, useEffect } from "react";

interface StickyPageHeaderProps {
    title: string;
    path: string;
}

const StickyPageHeader = ({ title, path }: StickyPageHeaderProps) => {

    const headerRef = useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (!headerRef.current) return;
            const rect = headerRef.current.getBoundingClientRect();
            const scrollTop = window.scrollY;

            if (rect.top <= 0 && scrollTop > 100) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);




return (
     <div
      ref={headerRef}
      className={`w-full xs:h-[120px] h-[70px] rounded-bl-xl rounded-br-xl overflow-hidden flex items-center justify-center bg-gradient-to-bl pt-4 from-black via-gray-600 to-black transition-all z-30 duration-300 ${
        isSticky ? 'fixed top-0 left-0 shadow-lg' : 'relative'
      }`}
    >

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-gray-300 xs:gap-2 gap-1">
            <h1 className="font-bold text-2xl">{title}</h1>
            <h1 className="font-normal text-l">{path}</h1>
        </div>

        {/* Bubbles */}
        <div className="bubble bg-gold animate-burst delay-[0ms]"></div>
        <div className="bubble bg-silver animate-burst delay-[300ms]"></div>
        <div className="bubble bg-whitey animate-burst delay-[600ms]"></div>
        <div className="bubble bg-gold animate-burst delay-[900ms]"></div>
        <div className="bubble bg-silver animate-burst delay-[1200ms]"></div>
        <div className="bubble bg-blue animate-burst delay-[0ms]"></div>
    </div>
)
}


export default StickyPageHeader;