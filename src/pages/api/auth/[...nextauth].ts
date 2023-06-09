import NextAuth, { AuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { query as q } from 'faunadb';

import { fauna } from "../../../services/fauna";

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      // scope: 'read:user' // -> mão sei aonde colocar
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session }) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection(
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user?.email ?? ''),
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            )
          )
        )
  
        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch(err) {
        return {
          ...session,
          activeSubscription: null,
        }
      }
    },
    async signIn({ user, account, profile }) {
      const { email } = user;

      try {
        await fauna.query(
          q.If( // se
            q.Not( // não
              q.Exists( // existe
                q.Match( // igual
                  q.Index('user_by_email'), // index criada no faunadashboard
                  q.Casefold(user.email ?? '') // coloca as letras em minusculo
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email ?? '')
              )
            )
          )
        )
  
        return true;
      } catch {
        return false;
      }
    }
  }
}

export default NextAuth(authOptions)
