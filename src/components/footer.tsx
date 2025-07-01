import React, { useMemo } from 'react';

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

const Footer: React.FC = React.memo(() => {
  // Cache navigation links to prevent recreation
  const navigationLinks = useMemo<FooterLink[]>(
    () => [
      { href: '#help-center', label: 'How to Play' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service', external: true }
    ],
    []
  );

  // Cache friend links to prevent recreation
  const friendLinks = useMemo<FooterLink[]>(
    () => [
      {
        href: 'https://wordless.online/',
        label: 'Wordless',
        external: true
      },
      {
        href: 'https://emojis.click/en',
        label: 'EmojiClick',
        external: true
      }
    ],
    []
  );

  // Cache social links to prevent recreation
  const socialLinks = useMemo(
    () => [
      {
        href: 'https://github.com/win-wiz/waffle-game',
        label: 'GitHub',
        icon: (
          <svg
            className='w-6 h-6'
            fill='currentColor'
            viewBox='0 0 24 24'
            aria-hidden='true'
          >
            <path
              fillRule='evenodd'
              d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
              clipRule='evenodd'
            />
          </svg>
        )
      }
    ],
    []
  );

  // Cache current year to prevent recreation
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className='bg-gradient-to-br from-slate-50/80 via-gray-50/60 to-blue-50/75 border-t border-slate-200'>
      <div className='max-w-6xl mx-auto px-6 py-16'>
        {/* Main footer content */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-slate-800 mb-4'>
            Waffle Game
          </h2>
          <p className='text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed'>
            A fun and challenging word puzzle game to test your vocabulary and
            strategic thinking skills through letter swapping.
          </p>
        </div>

        {/* Navigation and friend links */}
        <div className='flex flex-col justify-center items-center gap-8 mb-8'>
          {/* Navigation links */}
          <nav
            className='flex flex-wrap justify-center gap-6'
            aria-label='Footer navigation'
          >
            {navigationLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className='text-slate-600 hover:text-slate-800 transition-colors duration-200 font-medium'
                {...(link.external && {
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  'aria-label': `${link.label} (opens in new tab)`
                })}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Friend links */}
          <div className='flex items-center gap-2'>
            <span className='text-slate-500 text-sm'>Friends:</span>
            <div className='flex gap-4'>
              {friendLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-slate-600 hover:text-slate-800 transition-colors duration-200 text-sm'
                  aria-label={`${link.label} (opens in new tab)`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className='flex justify-center mb-8'>
          {socialLinks.map(social => (
            <a
              key={social.label}
              href={social.href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-slate-400 hover:text-slate-600 transition-colors duration-200 p-2'
              aria-label={`${social.label} (opens in new tab)`}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className='text-center pt-8 border-t border-slate-200'>
          <p className='text-slate-500 text-sm'>
            © {currentYear} Waffle Game. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
