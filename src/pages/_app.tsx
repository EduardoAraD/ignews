import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import '../styles/global.scss';
import { Header } from '@/components/Header';

const roboto = Roboto({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto'
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={roboto.className}>
      <Header />
      <Component {...pageProps} />
    </main>
  )
}
