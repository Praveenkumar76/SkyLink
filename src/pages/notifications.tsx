import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@lib/firebase/app';
import { useAuth } from '@lib/context/auth-context';
import { MainContainer } from '@components/home/main-container';
import { MainHeader } from '@components/home/main-header';
import { SEO } from '@components/common/seo';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { UserAvatar } from '@components/user/user-avatar';
import { UserName } from '@components/user/user-name';
import { UserUsername } from '@components/user/user-username';
import { formatDate } from '@lib/date';

type Notification = {
  id: string;
  type: 'like' | 'retweet' | 'reply' | 'follow';
  fromUser: {
    id: string;
    name: string;
    username: string;
    photoURL: string;
  };
  tweetId?: string;
  timestamp: any;
  read: boolean;
};

export default function Notifications(): JSX.Element {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const notificationsQuery = query(
      collection(db, `users/${user.id}/notifications`),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const newNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Notification[];

        setNotifications(newNotifications);
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  if (loading) {
    return (
      <MainContainer>
        <SEO title='Notifications / Twitter' />
        <MainHeader title='Notifications' />
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
      <SEO title='Notifications / Twitter' />
      <MainHeader title='Notifications' />
      <div className='divide-y divide-light-border dark:divide-dark-border'>
        {notifications.length === 0 ? (
          <div className='p-8 text-center text-light-secondary dark:text-dark-secondary'>
            No notifications yet
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-center gap-4 p-4 transition-colors hover:bg-light-primary/5 dark:hover:bg-dark-primary/5
                ${
                  !notification.read
                    ? 'bg-light-primary/10 dark:bg-dark-primary/10'
                    : ''
                }`}
            >
              <UserAvatar src={notification.fromUser.photoURL} />
              <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-1'>
                  <UserName name={notification.fromUser.name} verified />
                  <UserUsername username={notification.fromUser.username} />
                </div>
                <p className='text-light-secondary dark:text-dark-secondary'>
                  {notification.type === 'like' && 'liked your tweet'}
                  {notification.type === 'retweet' && 'retweeted your tweet'}
                  {notification.type === 'reply' && 'replied to your tweet'}
                  {notification.type === 'follow' && 'followed you'}
                </p>
                <span className='text-sm text-light-secondary dark:text-dark-secondary'>
                  {formatDate(notification.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </MainContainer>
  );
}
