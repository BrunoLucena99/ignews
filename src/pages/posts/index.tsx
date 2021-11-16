import { PageTitle } from '../../components/PageTitle';
import styles from './styles.module.scss';

export default function Posts() {
  return (
    <>
      <PageTitle title="Posts | ig.news" />
      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>16 de Novembro de 2021</time>
            <strong>Titulo do Post</strong>
            <p>Um breve paragrafo do Post</p>
          </a>
          <a href="#">
            <time>16 de Novembro de 2021</time>
            <strong>Titulo do Post</strong>
            <p>Um breve paragrafo do Post</p>
          </a>
          <a href="#">
            <time>16 de Novembro de 2021</time>
            <strong>Titulo do Post</strong>
            <p>Um breve paragrafo do Post</p>
          </a>
        </div>
      </main>
    </>
  )

}