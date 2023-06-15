import { fireEvent, render, screen } from "@testing-library/react"
import { SubscribeButton } from "."
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

jest.mock('next-auth/react');
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

describe('SubscribeButton components', () => {
  it('renders correcty', () => {
    (useSession as jest.Mock).mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    })

    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('redirects user to sign in when not authenticated', () => {
    (useSession as jest.Mock).mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    })

    const signInMocked = jest.mocked(signIn);

    render(<SubscribeButton />)
    
    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  })

  it('redirects to posts when user already has a subscription', () => {
    ;(useSession as jest.Mock).mockReturnValueOnce({
      data: {
        user: {
          email: 'johndoe@exemple.com',
          name: 'John Doe',
        },
        activeSubscription: true,
        expires: 'fake expires',
      },
      status: 'authenticated',
    })
    
    const pushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValueOnce({
      push: pushMock
    });

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/posts');
  })
})