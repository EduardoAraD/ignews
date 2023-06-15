import { render, screen } from "@testing-library/react"
import { SignInButton } from "."
import { useSession } from "next-auth/react";

jest.mock('next-auth/react');

describe('SignInButton component', () => {
  it('renders correcty when user is not auhenticated', () => {
    (useSession as jest.Mock).mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    })

    render(
      <SignInButton />
    );

    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument()
  })

  it('renders correcty when user is auhenticated', () => {
    (useSession as jest.Mock).mockReturnValueOnce({
      data: {
        user: {
          email: 'johndoe@exemple.com', name: 'John Doe',
        },
        expires: 'fake expires',
      },
      status: 'authenticated',
    })

    render(
      <SignInButton />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
