import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic');
jest.mock('next-auth/client');
jest.mock('next/router');

const post = 
  {
    slug: 'my-new-post',
    title: 'My new post',
    content: '<p>Post content</p>',
    updatedAt: '10 de Abril'
  }

describe('<Post />', () => {
  it ('renders correctly', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<PostPreview post={post} />)

    expect(screen.getByText('My new post')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it ('redirects user to full post when user is subscribed', () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      {
        activeSubscription: 'fake-subscription'
      },
      false
    ]);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<PostPreview post={post} />);
    
    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');
  });

  it('load initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My new post'}
          ],
          content: [
            { type: 'paragraph', text: 'My new post content excerpt'}
          ],
        },
        last_publication_date: '04-01-2021'
      })
    } as any);

    const response = await getStaticProps({
      req: {
        cookies: {}
      },
      params: {
        slug: 'my-new-post'
      }
    } as any)

    expect(response).toEqual(expect.objectContaining({
      props: {
        post: {
          slug: 'my-new-post',
          title: 'My new post',
          content: '<p>My new post content excerpt</p>',
          updatedAt: '01 de abril de 2021'
        }
      }
    }))
  });
})