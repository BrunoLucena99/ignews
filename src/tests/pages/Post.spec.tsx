import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { getSession } from 'next-auth/client';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic');
jest.mock('next-auth/client');

const post = 
  {
    slug: 'my-new-post',
    title: 'My new post',
    content: '<p>Post content</p>',
    updatedAt: '10 de Abril'
  }

describe('<Post />', () => {
  it ('renders correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('My new post')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
  });

  it ('redirects user if no subscription found', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    })

    const response = await getServerSideProps({
      req: {
        cookies: {}
      },
      params: {
        slug: 'my-new-post'
      }
    } as any);

    expect(response).toEqual(expect.objectContaining({
      redirect: expect.objectContaining({
        destination: 'posts/preview/my-new-post'
      })
    }))
  });

  it('load initial data', async () => {
    const getSessionMocked = mocked(getSession);
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

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    }).mockReturnValueOnce

    const response = await getServerSideProps({
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