import React from 'react'
import Footer from './components/Footer'
import Navigation from './components/Navigation'
import { LanguageProvider } from './contexts/LanguageContext'
import './styles.css'

export const metadata = {
  description: 'Ceyara Tours - Discover the beauty of Sri Lanka',
  title: 'Ceyara Tours',
  icons: {
    icon: '/falcon-icon.png',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Afacad+Flux:wght@100..1000&family=Dosis:wght@200..800&family=Exo+2:ital,wght@0,100..900;1,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        {/* Suppress NEXT_REDIRECT console errors (known Next.js 15 + React 19 issue) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                const originalError = console.error;
                console.error = function(...args) {
                  const message = args[0]?.toString() || '';
                  // Suppress NEXT_REDIRECT errors
                  if (message.includes('NEXT_REDIRECT') || message.includes('RedirectErrorBoundary')) {
                    return;
                  }
                  // Suppress hydration warnings from browser extensions (e.g., Grammarly)
                  if (message.includes('hydrated') && message.includes('data-new-gr-c-s-check-loaded')) {
                    return;
                  }
                  if (message.includes('hydrated') && message.includes('data-gr-ext-installed')) {
                    return;
                  }
                  originalError.apply(console, args);
                };
              }
            `,
          }}
        />
        {/* Facebook Messenger SDK */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.fbAsyncInit = function() {
                FB.init({
                  xfbml: true,
                  version: 'v18.0'
                });
              };
              (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-jssdk'));
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
          {/* Facebook Messenger Chat Widget */}
          <div
            className="fb-customerchat"
            data-attribution="setup_tool"
            data-page_id="100094188200000"
            data-theme_color="#008080"
            data-logged_in_greeting="Hi! How can we help you plan your Sri Lanka adventure?"
            data-logged_out_greeting="Hi! How can we help you plan your Sri Lanka adventure?"
          />
        </LanguageProvider>
      </body>
    </html>
  )
}
