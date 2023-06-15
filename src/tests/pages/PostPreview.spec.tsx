import { render, screen } from '@testing-library/react'
import PostPreview, { getStaticPaths, getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

jest.mock('next-auth/react')
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))
jest.mock('../../services/prismic')

const post =  {
  content: '<p>Post content</p>',
  slug: 'my-mew-post',
  title: 'My new post',
  updatedAt: '20 de maio'
}

describe('Post preview page', () => {
  it('renders correcty', () => {
    ;(useSession as jest.Mock).mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })

    render(
      <PostPreview post={post} />
    )

    expect(screen.getByText("My new post")).toBeInTheDocument();
    expect(screen.getByText("Post content")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  })

  it('redirects iser to full post when user is subscribed', () => {
    ;(useSession as jest.Mock).mockReturnValueOnce({
      data: {
        activeSubscription: true,
      },
      status: 'authenticated'
    })

    const pushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValueOnce({
      push: pushMock
    });

    render(<PostPreview post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/my-mew-post')
  })

  it('loads initial data', async () => {
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

    const response = await getStaticProps({ params: { slug: 'my-new-post' }})

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
