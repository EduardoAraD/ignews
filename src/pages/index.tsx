import { GetServerSideProps, GetStaticProps } from 'next'
import Head from 'next/head';
import Image from 'next/image';

import styles from './home.module.scss';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

/*
  Client-side -> pagina com informações que dependem de um usuário.
  Server-side -> uma pagina com dados dinamicos, (ex: informações de usuário)
  Static Site Generation -> uma pagina compartilhada para muita gente e não requer alteração continua(ex: Home de um blog, pagina de produto)

  Conteúdo do post -> STATIC
  comentários do post -> Client-side (Carrega depois da pagina ser carregada)
  */

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product } : HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
        <link rel="shortcut icon" href="/favicon.png" type='image/png' />
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world</h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>
        <Image
          src="/images/avatar.svg"
          alt="Girl coding"
          width={336}
          height={521}
        />

      </main>
    </>
  )
}

// Mantem um html estatico
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1NFHMsAgHGcqof3h8GjTdjWK')
  // const price = await stripe.prices.retrieve('price_1NFHMsAgHGcqof3h8GjTdjWK', {
  //   expand: ['product']
  // }) -> buscar as informações de produto

  const valueUnitAmount = price.unit_amount ?? 0;

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valueUnitAmount / 100),
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}
