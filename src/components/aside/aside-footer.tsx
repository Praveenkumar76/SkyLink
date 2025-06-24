import { useState } from 'react';

const footerLinks = [
  ['Terms of Service', 'https://x.com/tos'],
  ['Privacy Policy', 'https://x.com/privacy'],
  ['Cookie Policy', 'https://support.x.com/articles/20170514'],
  ['Accessibility', 'https://help.x.com/resources/accessibility'],
  [
    'Ads Info',
    'https://business.x.com/en/help/troubleshooting/how-x-ads-work.html'
  ]
] as const;

const moreLinks = [
  ['About X', 'https://about.x.com'],
  ['Developer', 'https://your-portfolio-link.com'],
  ['Download the X app', 'https://x.com/download']
] as const;

export function AsideFooter(): JSX.Element {
  const [showMore, setShowMore] = useState(false);

  return (
    <footer className='mt-8 text-center text-sm text-light-secondary dark:text-dark-secondary'>
      <nav className='flex flex-row flex-wrap flex-wrap items-center justify-center gap-1'>
        {footerLinks.map(([text, href], index) => (
          <span key={href}>
            <a
              href={href}
              target='_blank'
              rel='noreferrer'
              className='transition-opacity hover:underline hover:opacity-90'
            >
              {text}
            </a>
            <span>{index !== footerLinks.length - 1 ? ' | ' : ' | '}</span>
          </span>
        ))}

        {/* More Button */}
        <button
          onClick={() => setShowMore((prev) => !prev)}
          className='transition-opacity hover:underline hover:opacity-90'
        >
          More...
        </button>
      </nav>

      {/* Dropdown menu for more */}
      {showMore && (
        <div className='mt-2 flex flex-col items-center gap-1'>
          {moreLinks.map(([text, href]) => (
            <a
              key={href}
              href={href}
              target='_blank'
              rel='noreferrer'
              className='transition-opacity hover:underline hover:opacity-90'
            >
              {text}
            </a>
          ))}
        </div>
      )}

      <p className='mt-2'>© 2025 X, Corp.</p>
    </footer>
  );
}
