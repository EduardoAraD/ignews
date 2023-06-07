import { SignInButton } from "../SignInButton";
import Image from "next/image"

import { ActiveLink } from "../ActiveLink";
import styles from './styles.module.scss';

export function Header () {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src="/images/logo.svg" alt="ig.news" width={110} height={31} />
        <nav>
          <ActiveLink
            href="/"
            activeClassName={styles.active}
            legacyBehavior
          >
            <a>Home</a>
          </ActiveLink>
          <ActiveLink
            href="/posts"
            activeClassName={styles.active}
            legacyBehavior
          >
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}