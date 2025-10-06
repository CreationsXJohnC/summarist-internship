'use client';

import Image from 'next/image';

const Footer = () => {
  const footerLinks = {
    actions: [
      { name: 'Summarist Magazine', href: '/magazine' },
      { name: 'Cancel Subscription', href: '/cancel' },
      { name: 'Help', href: '/help' },
      { name: 'Contact Us', href: '/contact' }
    ],
    usefulLinks: [
      { name: 'Pricing', href: '/pricing' },
      { name: 'Summarist Business', href: '/business' },
      { name: 'Gift Cards', href: '/gift-cards' },
      { name: 'Authors & Publishers', href: '/authors-publishers' }
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Partners', href: '/partners' },
      { name: 'Code of Conduct', href: '/code-of-conduct' }
    ],
    other: [
      { name: 'Sitemap', href: '/sitemap' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' }
    ]
  };

  return (
    <footer className="bg-[#032b41] text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Actions Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <ul className="space-y-3">
              {footerLinks.actions.map((link, index) => (
                <li key={index}>
                  <span className="text-gray-300 cursor-not-allowed select-none opacity-70" aria-disabled="true" tabIndex={-1}>
                    {link.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-3">
              {footerLinks.usefulLinks.map((link, index) => (
                <li key={index}>
                  <span className="text-gray-300 cursor-not-allowed select-none opacity-70" aria-disabled="true" tabIndex={-1}>
                    {link.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <span className="text-gray-300 cursor-not-allowed select-none opacity-70" aria-disabled="true" tabIndex={-1}>
                    {link.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Other</h3>
            <ul className="space-y-3">
              {footerLinks.other.map((link, index) => (
                <li key={index}>
                  <span className="text-gray-300 cursor-not-allowed select-none opacity-70" aria-disabled="true" tabIndex={-1}>
                    {link.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 pt-8">
          <div className="text-center">
            <div className="text-gray-300 text-sm">
              © 2024 Summarist. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;