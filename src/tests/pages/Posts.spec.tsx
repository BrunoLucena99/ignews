import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic');

const posts = [
  {
    slug: 'my-new-post',
    title: 'My new post',
    excerpt: 'Post excerpt',
    updatedAt: '10 de Abril'
  }
]

describe('<Posts />', () => {
  it ('renders correctly', () => {
    render(<Posts posts={posts} />)
    expect(screen.getByText('My new post')).toBeInTheDocument();
    expect(screen.getByText('Post excerpt')).toBeInTheDocument();
    expect(screen.getByText('10 de Abril')).toBeInTheDocument();
  });

  it ('load initial data from getStaticProps', async () => {
    const getPrimisClientMocked = mocked(getPrismicClient);

    getPrimisClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                { type: 'heading', text: 'My new post'}
              ],
              content: [
                { type: 'paragraph', text: 'My new post content excerpt'}
              ]
            },
            last_publication_date: '04-01-2021',
          }
        ]
      })
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(expect.objectContaining({
      props: {
        posts: [{
          slug: 'my-new-post',
          title: 'My new post',
          excerpt: 'My new post content excerpt',
          updatedAt: '01 de abril de 2021'
        }]
      }
    }))
  })
})