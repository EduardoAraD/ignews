import { render, screen } from '@testing-library/react'
import HomePage, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  })
}));
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../../services/stripe');

describe('Home page', () => {
  it('renders correcty', () => {
    render(
      <HomePage
        product={{
          priceId: 'fake-price-id',
          amount: 'R$10,00',
        }}
      />
    )

    expect(screen.getByText("for R$10,00 month")).toBeInTheDocument();
  })

  it('loads initial data', async () => {
    ;(stripe.prices.retrieve as jest.Mock).mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    });

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00',
          }
        }
      })
    )
  })
})
