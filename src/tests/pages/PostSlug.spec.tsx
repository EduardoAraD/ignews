import { render, screen } from '@testing-library/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';
import { getSession } from 'next-auth/react';

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

const post =  {
  content: '<p>Post content</p>',
  slug: 'my-mew-post',
  title: 'My new post',
  updatedAt: '20 de maio'
}

describe('Post[SLUG] page', () => {
  it('renders correcty', () => {
    render(
      <Post post={post} />
    )

    expect(screen.getByText("My new post")).toBeInTheDocument();
    expect(screen.getByText("Post content")).toBeInTheDocument();
  })

  it('redirects user if no subscription is found', async () => {
    ;(getSession as jest.Mock).mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        }),
      })
    )
  })

  it('loads initial data', async () => {
    ;(getSession as jest.Mock).mockResolvedValueOnce({
      activeSubscription: true,
    });

    ;(getPrismicClient as jest.Mock).mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My new post' },
          ],
          content: [
            { type: 'paragraph', text: 'Post content' }
          ],
        },
        last_publication_date: '2023-05-20 12:00:00',
      })
    })

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updatedAt: '20 de maio de 2023'
          }
        }
      })
    )
  })
})
