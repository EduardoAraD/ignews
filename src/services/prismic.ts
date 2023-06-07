import * as Prismic from '@prismicio/client';

export const getPrismicClient = () => {
  const client = Prismic.createClient(
    process.env.PRISMIC_ENDPOINT ?? '',
    {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    }
  );

  return client;
}
