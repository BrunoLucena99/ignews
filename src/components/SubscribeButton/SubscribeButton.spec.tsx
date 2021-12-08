import {fireEvent, render, screen} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {signIn, useSession} from 'next-auth/client'
import {useRouter} from 'next/router';
import { SubscribeButton } from '.';

jest.mock('next-auth/client');

jest.mock('next/router');


describe('<SubscribeButton />', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);
    
    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it ('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);
    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton)
    expect(signInMocked).toHaveBeenCalled();
  })

  it('redirects to posts when user already has a subscription', () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMock = jest.fn();
  
    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any)

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
        },
        activeSubscription: 'fake-subscription',
      },
      false
    ])

    render(<SubscribeButton />);
    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalled();
  })
})

