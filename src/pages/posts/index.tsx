import Prismic from '@prismicio/client';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import { PageTitle } from '../../components/PageTitle';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';


interface Post {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}
interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <PageTitle title="Posts | ig.news" />
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const {results} = await prismic.query(
    Prismic.predicates.at('document.type', 'post'),
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 100,
    }  
  )

  const posts = results.map(post => ({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    excerpt:
      post.data.content.find(content => content.type === 'paragraph')?.text
      ?? '',
    updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }))

  return {
    props: { posts }
  }
}
