import IconLogo from '../../assets/Icon.svg';

const Footer = () => {
  const links = [
    { label: 'Tentang Kami', href: '#' },
    { label: 'Kebijakan Privasi', href: '#' },
    { label: 'Kontak Darurat', href: '#' },
    { label: 'Pusat Bantuan', href: '#' },
  ];

  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: '#ffffff',
        borderColor: 'rgba(45,106,106,0.1)',
        fontFamily: '"Manrope", sans-serif',
        fontSize: '14px',
      }}
    >
      <div className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
        {/* Brand Group */}
        <div className="flex items-center gap-3">
          <img
            src={IconLogo}
            alt="Logo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <div className="text-lg font-bold" style={{ color: '#2D6A6A' }}>
            MindBalance
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="underline-offset-4 hover:underline transition-all duration-300 ease-in-out"
              style={{ color: '#64748b' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#2D6A6A')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div style={{ color: '#2D6A6A' }}>© 2026 MindBalance&nbsp;</div>
      </div>
    </footer>
  );
};

export default Footer;
