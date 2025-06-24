import {
  FirestoreDataConverter,
  Timestamp,
  QueryDocumentSnapshot
} from 'firebase-admin/firestore';

export type Bookmark = {
  id: string;
  createdAt: Timestamp;
};

export const bookmarkConverter: FirestoreDataConverter<Bookmark> = {
  // Called when writing to Firestore
  toFirestore(bookmark: Bookmark) {
    if (!bookmark.id || !(bookmark.createdAt instanceof Timestamp)) {
      throw new Error('Invalid Bookmark data for Firestore');
    }

    return {
      id: bookmark.id,
      createdAt: bookmark.createdAt
    };
  },

  // Called when reading from Firestore
  fromFirestore(snapshot: QueryDocumentSnapshot): Bookmark {
    const data = snapshot.data();

    if (typeof data.id !== 'string') {
      throw new Error("Bookmark document missing or has invalid 'id'");
    }

    if (!(data.createdAt instanceof Timestamp)) {
      throw new Error("Bookmark document has invalid 'createdAt'");
    }

    return {
      id: data.id,
      createdAt: data.createdAt
    };
  }
};
