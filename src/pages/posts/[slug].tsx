import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { RichText } from "prismic-dom";
import { PageTitle } from "../../components/PageTitle";
import { getPrismicClient } from "../../services/prismic";

import styles from './post.module.scss';

interface IPost {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface PostProps {
  post: IPost;
}

export default function Post({post}: PostProps) {
  return (
    <>
      <PageTitle title={`${post.title} | ig.news`} />
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={styles.postContent}
          />
        </article>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const session = await getSession({ req });
  const { slug } = params;
  
  const prismic = getPrismicClient(req);
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: { post },
  }
}
