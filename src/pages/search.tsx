import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { query, where, orderBy, collection, getDocs } from 'firebase/firestore';
import { db } from '@lib/firebase/app';
import { MainContainer } from '@components/home/main-container';
import { MainHeader } from '@components/home/main-header';
import { SEO } from '@components/common/seo';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { UserCard } from '@components/user/user-card';
import { Tweet } from '@components/tweet/tweet';
import { useInfiniteScroll } from '@lib/hooks/useInfiniteScroll';

type SearchResult = {
  users: any[];
  tweets: any[];
};

export default function Search(): JSX.Element {
  const { query: urlQuery } = useRouter();
  const searchQuery = urlQuery.q as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<SearchResult>({
    users: [],
    tweets: []
  });

  useEffect(() => {
    async function performSearch() {
      if (!searchQuery) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Search users
        const usersQuery = query(
          collection(db, 'users'),
          where('username', '>=', searchQuery.toLowerCase()),
          where('username', '<=', searchQuery.toLowerCase() + '\uf8ff'),
          orderBy('username')
        );

        // Search tweets
        const tweetsQuery = query(
          collection(db, 'tweets'),
          where('text', '>=', searchQuery.toLowerCase()),
          where('text', '<=', searchQuery.toLowerCase() + '\uf8ff'),
          orderBy('text'),
          orderBy('createdAt', 'desc')
        );

        const [usersSnapshot, tweetsSnapshot] = await Promise.all([
          getDocs(usersQuery),
          getDocs(tweetsQuery)
        ]);

        setResults({
          users: usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          })),
          tweets: tweetsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    void performSearch();
  }, [searchQuery]);

  if (loading) {
    return (
      <MainContainer>
        <SEO title={`${searchQuery ?? ''} - Search / Twitter`} />
        <MainHeader title='Search' />
        <Loading />
      </MainContainer>
    );
  }

  if (error) {
    return (
      <MainContainer>
        <SEO title='Error - Twitter' />
        <Error message='Something went wrong' />
      </MainContainer>
    );
  }

  const { users, tweets } = results;
  const hasResults = users.length > 0 || tweets.length > 0;

  return (
    <MainContainer>
      <SEO title={`${searchQuery ?? ''} - Search / Twitter`} />
      <MainHeader title='Search' />

      {!searchQuery ? (
        <div className='p-8 text-center text-light-secondary dark:text-dark-secondary'>
          Try searching for people, topics, or keywords
        </div>
      ) : !hasResults ? (
        <div className='p-8 text-center text-light-secondary dark:text-dark-secondary'>
          No results for "{searchQuery}"
        </div>
      ) : (
        <>
          {users.length > 0 && (
            <div className='border-b border-light-border dark:border-dark-border'>
              <h2 className='p-4 text-xl font-bold'>People</h2>
              {users.map((user) => (
                <UserCard key={user.id} {...user} />
              ))}
            </div>
          )}
          {tweets.length > 0 && (
            <div>
              <h2 className='p-4 text-xl font-bold'>Tweets</h2>
              {tweets.map((tweet) => (
                <Tweet key={tweet.id} {...tweet} />
              ))}
            </div>
          )}
        </>
      )}
    </MainContainer>
  );
}
