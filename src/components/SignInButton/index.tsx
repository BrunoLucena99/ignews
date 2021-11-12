import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import styles from './styles.module.scss';

export function SignInButton() {
  const isUserLoggedIn = false;

  if (!isUserLoggedIn) {
    return (
      <button
        type="button"
        className={styles.signInButton}
      >
        <FaGithub color="#eba417" />
        Sign in with Github
      </button>
    )
  }

  return (
    <button
      type="button"
      className={styles.signInButton}
    >
      <FaGithub color="#04b361" />
      Bruno Henrique
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  )
}