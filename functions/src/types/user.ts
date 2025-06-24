import type { Theme, Accent } from './theme';
import { Timestamp, type FirestoreDataConverter } from 'firebase/firestore';

export type User = {
  id: string;
  bio: string | null;
  name: string;
  theme: Theme | null;
  accent: Accent | null;
  website: string | null;
  location: string | null;
  username: string;
  photoURL: string;
  verified: boolean;
  following: string[];
  followers: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
  totalTweets: number;
  totalPhotos: number;
  pinnedTweet: string | null;
  coverPhotoURL: string | null;
};

export type EditableData = Extract<
  keyof User,
  'bio' | 'name' | 'website' | 'photoURL' | 'location' | 'coverPhotoURL'
>;

export type EditableUserData = Pick<User, EditableData>;

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore(user: User) {
    if (!user.id || typeof user.name !== 'string') {
      throw new Error('Invalid user data');
    }

    return {
      ...user,
      updatedAt: user.updatedAt ?? Timestamp.now() // fallback if needed
    };
  },

  fromFirestore(snapshot, options): User {
    const data = snapshot.data(options);

    if (
      typeof data?.id !== 'string' ||
      typeof data?.name !== 'string' ||
      !(data?.createdAt instanceof Timestamp)
    ) {
      throw new Error('Invalid user document');
    }

    return {
      ...data,
      updatedAt: data.updatedAt ?? null
    } as User;
  }
};
