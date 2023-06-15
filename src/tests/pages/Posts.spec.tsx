import { render, screen } from '@testing-library/react'
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic')

const post = [
  { excerpt: 'Post excerpt', slug: 'my-mew-post', title: 'My new post', updatedAt: '20 de maio' },
]

describe('Posts page', () => {
  it('renders correcty', () => {
    render(
      <Posts posts={post} />
    )

    expect(screen.getByText("My new post")).toBeInTheDocument();
  })

  it('loads initial data', async () => {
    ;(getPrismicClient as jest.Mock).mockReturnValueOnce({
      getAllByType: jest.fn().mockResolvedValueOnce(
        [
          {
            uid: 'fake-slug',
            data: {
              title: [
                { type: 'heading', text: 'My new post' },
              ],
              content: [
                { type: 'paragraph', text: 'Post excerpt' }
              ],
            },
            last_publication_date: '2023-05-20 12:00:00',
          }
        ]
      )
    });

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'fake-slug',
              title: 'My new post',
              excerpt: 'Post excerpt',
              updatedAt: '20 de maio de 2023'
            }
          ],
        }
      })
    )
  })
})
