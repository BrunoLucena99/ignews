import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/client';

import styles from './styles.module.scss';

export function SignInButton() {
  const [session] = useSession();

  const handleSignIn = () => signIn('github');
  const handleSignOut = () => signOut();

  if (!session) {
    return (
      <button
        type="button"
        className={styles.signInButton}
        onClick={handleSignIn}
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
      onClick={handleSignOut}
    >
      <FaGithub color="#04b361" />
      Bruno Henrique
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  )
}