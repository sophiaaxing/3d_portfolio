import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { styles } from '../styles';
import { navLinks } from '../constants';

const Navbar = () => {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const links = (mobile = false) => navLinks.map((link) => (
    <li key={link.id}>
      <a
        href={`#${link.id}`}
        aria-current={active === link.id ? 'location' : undefined}
        onClick={() => { setActive(link.id); setOpen(false); }}
        className={`${mobile ? 'block px-5 py-3' : 'px-5 py-2'} rounded-full text-sm font-medium transition-colors ${active === link.id ? 'bg-[#f5dce4] text-accent' : 'text-secondary hover:bg-[#f9e8ed] hover:text-accent'}`}
      >
        {link.title}
      </a>
    </li>
  ));

  return (
    <nav ref={navRef} aria-label="Main navigation" className={`${styles.paddingX} fixed top-0 z-20 w-full bg-[#fff8f5]/95 backdrop-blur-md border-b border-[#edd3dc]`}>
      <div className="relative max-w-7xl mx-auto flex min-h-[84px] items-center justify-between gap-4">
        <Link to="/" aria-label="Sophia Xing home" className="flex items-center gap-3 rounded-lg" onClick={() => { setActive(''); setOpen(false); window.scrollTo(0, 0); }}>
          <span className="sx-monogram" aria-hidden="true">
            <img src="/images/sxlogo.png" alt="" />
          </span>
          <span className="editorial-title text-2xl italic text-ink">Sophia Xing</span>
        </Link>
        <ul className="hidden sm:flex items-center gap-1 rounded-full border border-accent/15 bg-white/60 p-1.5">
          {links()}
        </ul>
        <button ref={toggleRef} type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className="sm:hidden rounded-full border border-accent/25 bg-[#fcebee] px-4 py-2.5 text-sm font-medium text-accent">
          {open ? 'Close ×' : 'Menu +'}
        </button>
        <div id="mobile-navigation" hidden={!open} className="sm:hidden absolute top-full mt-3 right-0 w-56 rounded-2xl border border-accent/20 bg-[#fff8f5] p-2 shadow-[0_12px_30px_#66354d18]">
          <ul className="space-y-1">{links(true)}</ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
