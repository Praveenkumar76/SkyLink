import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@lib/firebase/app';
import { MainContainer } from '@components/home/main-container';
import { MainHeader } from '@components/home/main-header';
import { SEO } from '@components/common/seo';
import { Tweet } from '@components/tweet/tweet';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { AsideTrends } from '@components/aside/aside-trends';

export default function Explore(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tweets, setTweets] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTrendingTweets() {
      try {
        const tweetsQuery = query(
          collection(db, 'tweets'),
          orderBy('likesCount', 'desc'),
          limit(30)
        );

        const snapshot = await getDocs(tweetsQuery);
        const trendingTweets = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setTweets(trendingTweets);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }

    void fetchTrendingTweets();
  }, []);

  if (loading) {
    return (
      <MainContainer>
        <SEO title='Explore / Twitter' />
        <MainHeader title='Explore' />
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

  return (
    <MainContainer>
      <SEO title='Explore / Twitter' />
      <MainHeader title='Explore' />
      <AsideTrends inTrendsPage />
      <div className='mt-4'>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </div>
    </MainContainer>
  );
}
