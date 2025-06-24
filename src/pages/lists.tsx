import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '@lib/firebase/app';
import { useAuth } from '@lib/context/auth-context';
import { MainContainer } from '@components/home/main-container';
import { MainHeader } from '@components/home/main-header';
import { SEO } from '@components/common/seo';
import { Loading } from '@components/ui/loading';
import { Error } from '@components/ui/error';
import { Button } from '@components/ui/button';
import { HeroIcon } from '@components/ui/hero-icon';
import { Modal } from '@components/modal/modal';
import { useModal } from '@lib/hooks/useModal';

type List = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
  createdBy: string;
  createdAt: any;
};

export default function Lists(): JSX.Element {
  const { user } = useAuth();
  const { open, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchLists() {
      try {
        const listsQuery = query(
          collection(db, 'lists'),
          where('createdBy', '==', user.id),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(listsQuery);
        const userLists = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as List[];

        setLists(userLists);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }

    void fetchLists();
  }, [user?.id]);

  const createList = async () => {
    if (!newListName.trim() || !user?.id) return;

    try {
      await addDoc(collection(db, 'lists'), {
        name: newListName,
        description: newListDescription,
        isPrivate,
        memberCount: 0,
        createdBy: user.id,
        createdAt: new Date().toISOString()
      });

      setNewListName('');
      setNewListDescription('');
      setIsPrivate(false);
      closeModal();
    } catch (err) {
      console.error('Error creating list:', err);
    }
  };

  const deleteList = async (listId: string) => {
    try {
      await deleteDoc(doc(db, 'lists', listId));
      setLists(lists.filter((list) => list.id !== listId));
    } catch (err) {
      console.error('Error deleting list:', err);
    }
  };

  if (loading) {
    return (
      <MainContainer>
        <SEO title='Lists / Twitter' />
        <MainHeader title='Lists' />
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
      <SEO title='Lists / Twitter' />
      <MainHeader title='Lists'>
        <Button
          className='ml-auto rounded-full bg-accent-blue px-4 py-2 text-white transition-opacity
                   hover:opacity-70'
          onClick={openModal}
        >
          Create List
        </Button>
      </MainHeader>

      <Modal
        modalClassName='max-w-lg bg-main-background w-full p-8 rounded-2xl'
        open={open}
        closeModal={closeModal}
      >
        <h2 className='mb-8 text-2xl font-bold'>Create a new List</h2>
        <div className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium'>Name</label>
            <input
              type='text'
              className='w-full rounded-md border border-light-border bg-main-background p-2
                       focus:border-accent-blue focus:outline-none dark:border-dark-border'
              placeholder='List name'
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              maxLength={25}
            />
          </div>
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Description
            </label>
            <textarea
              className='w-full rounded-md border border-light-border bg-main-background p-2
                       focus:border-accent-blue focus:outline-none dark:border-dark-border'
              placeholder='List description (optional)'
              value={newListDescription}
              onChange={(e) => setNewListDescription(e.target.value)}
              maxLength={100}
              rows={3}
            />
          </div>
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='private'
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <label htmlFor='private'>Make private</label>
          </div>
          <Button
            className='w-full rounded-full bg-accent-blue py-2 text-white transition-opacity
                     hover:opacity-70 disabled:opacity-50'
            onClick={createList}
            disabled={!newListName.trim()}
          >
            Create
          </Button>
        </div>
      </Modal>

      <div className='divide-y divide-light-border dark:divide-dark-border'>
        {lists.length === 0 ? (
          <div className='p-8 text-center text-light-secondary dark:text-dark-secondary'>
            You haven't created any lists yet
          </div>
        ) : (
          lists.map((list) => (
            <div
              key={list.id}
              className='flex items-center justify-between p-4 transition-colors
                       hover:bg-light-primary/5 dark:hover:bg-dark-primary/5'
            >
              <div>
                <h3 className='font-bold'>{list.name}</h3>
                {list.description && (
                  <p className='text-light-secondary dark:text-dark-secondary'>
                    {list.description}
                  </p>
                )}
                <div className='mt-1 flex items-center gap-2 text-sm text-light-secondary dark:text-dark-secondary'>
                  <span>{list.memberCount} members</span>
                  {list.isPrivate && (
                    <span className='flex items-center gap-1'>
                      <HeroIcon className='h-4 w-4' iconName='LockClosedIcon' />
                      Private
                    </span>
                  )}
                </div>
              </div>
              <Button
                className='text-red-500 transition-colors hover:text-red-700'
                onClick={() => deleteList(list.id)}
              >
                <HeroIcon className='h-5 w-5' iconName='TrashIcon' />
              </Button>
            </div>
          ))
        )}
      </div>
    </MainContainer>
  );
}
