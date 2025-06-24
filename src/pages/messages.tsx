import { useState, useEffect, useRef } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@lib/firebase/app';
import { useAuth } from '@lib/context/auth-context';
import { MainContainer } from '@components/home/main-container';
import { MainHeader } from '@components/home/main-header';
import { SEO } from '@components/common/seo';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { UserAvatar } from '@components/user/user-avatar';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';

type Message = {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: any;
  read: boolean;
};

type Chat = {
  userId: string;
  username: string;
  name: string;
  photoURL: string;
  lastMessage?: string;
  timestamp?: any;
};

export default function Messages(): JSX.Element {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.id) return;

    const chatsQuery = query(
      collection(db, `users/${user.id}/chats`),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      chatsQuery,
      (snapshot) => {
        const newChats = snapshot.docs.map((doc) => ({
          userId: doc.id,
          ...doc.data()
        })) as Chat[];

        setChats(newChats);
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !selectedChat) return;

    const messagesQuery = query(
      collection(db, 'messages'),
      where('senderId', 'in', [user.id, selectedChat.userId]),
      where('receiverId', 'in', [user.id, selectedChat.userId]),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];

      setMessages(newMessages);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    return () => unsubscribe();
  }, [user?.id, selectedChat]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !selectedChat) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        senderId: user.id,
        receiverId: selectedChat.userId,
        timestamp: serverTimestamp(),
        read: false
      });

      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (loading) {
    return (
      <MainContainer>
        <SEO title='Messages / Twitter' />
        <MainHeader title='Messages' />
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
      <SEO title='Messages / Twitter' />
      <MainHeader title='Messages' />
      <div className='flex h-[calc(100vh-4rem)] divide-x divide-light-border dark:divide-dark-border'>
        <div className='w-1/3 overflow-y-auto'>
          {chats.length === 0 ? (
            <div className='p-8 text-center text-light-secondary dark:text-dark-secondary'>
              No messages yet
            </div>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.userId}
                className={`flex w-full items-center gap-4 p-4 transition-colors hover:bg-light-primary/5 dark:hover:bg-dark-primary/5
                  ${
                    selectedChat?.userId === chat.userId
                      ? 'bg-light-primary/10 dark:bg-dark-primary/10'
                      : ''
                  }`}
                onClick={() => setSelectedChat(chat)}
              >
                <UserAvatar src={chat.photoURL} />
                <div className='flex flex-col items-start gap-1'>
                  <span className='font-bold'>{chat.name}</span>
                  <span className='text-sm text-light-secondary dark:text-dark-secondary'>
                    @{chat.username}
                  </span>
                  {chat.lastMessage && (
                    <p className='text-sm text-light-secondary dark:text-dark-secondary'>
                      {chat.lastMessage}
                    </p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
        <div className='flex w-2/3 flex-col'>
          {selectedChat ? (
            <>
              <div className='flex-1 overflow-y-auto p-4'>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${
                      message.senderId === user?.id
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.senderId === user?.id
                          ? 'bg-accent-blue text-white'
                          : 'bg-light-primary/10 dark:bg-dark-primary/10'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className='border-t border-light-border p-4 dark:border-dark-border'>
                <div className='flex gap-4'>
                  <input
                    type='text'
                    placeholder='Start a new message'
                    className='flex-1 rounded-full bg-light-primary/10 px-4 py-2 outline-none
                             focus:ring-2 focus:ring-accent-blue dark:bg-dark-primary/10'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button
                    className='rounded-full bg-accent-blue p-2 text-white transition-opacity
                             hover:opacity-70 disabled:opacity-50'
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <HeroIcon
                      className='h-5 w-5'
                      iconName='PaperAirplaneIcon'
                    />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className='flex h-full items-center justify-center text-light-secondary dark:text-dark-secondary'>
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>
    </MainContainer>
  );
}
