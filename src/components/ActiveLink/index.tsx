import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

// interface ActiveLinkProps extends LinkProps {
//   activeClassName: string;
//   title: string
// }

// export function ActiveLink({ title, activeClassName, ...rest}: ActiveLinkProps) {
//   const { asPath } = useRouter();

//   const className = asPath === rest.href ? activeClassName : '';

//   return (
//     <Link {...rest} className={className}>{title}</Link>
//   )
// }

/*

*/
interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...rest}: ActiveLinkProps) {
  const { asPath } = useRouter();

  const className = asPath === rest.href ? activeClassName : '';

  return (
    <Link {...rest}>
      {cloneElement(children, { className })}
    </Link>
  )
}

