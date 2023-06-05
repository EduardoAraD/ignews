import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import { SessionProvider as NextAuthProvider } from 'next-auth/react' 

import '../styles/global.scss';
import { Header } from '../components/Header';

const roboto = Roboto({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto'
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session} >
      <main className={roboto.className}>
        <Header />
        <Component {...pageProps} />
      </main>
    </NextAuthProvider>
  )
}
