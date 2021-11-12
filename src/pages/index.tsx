import { PageTitle } from '../components/PageTitle';
import styles from './home.module.scss';

export default function Home() {
  return (
    <>
      <PageTitle title="Home | ig.news" />
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for $9.98 month</span>
          </p>
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}
