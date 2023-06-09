import { signIn, useSession } from 'next-auth/react';

import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

import styles from './styles.module.scss';
import { useRouter } from 'next/router';

export function SubscribeButton () {
  const { data, status } = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if(status !== 'authenticated') {
      signIn('github');
      return;
    }

    if(data.activeSubscription) {
      router.push('/posts');
      return;
    }

    try{
      const response = await api.post('/subscribe')

      const { sessionId } = response.data;
      console.log(response.data);

      const stripe = await getStripeJs();

      await stripe?.redirectToCheckout({ sessionId });

    } catch (err) {
      alert(err.message);
    }

  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}