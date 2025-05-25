import { getFirestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { app } from '../../firebaseConfig';

const db = getFirestore(app);
const FAVORITES_COLLECTION = 'favorites';
const USER_ID = 'demoUser';

export const getFavorites = async () => {
  try {
    const userFavsCol = collection(db, FAVORITES_COLLECTION, USER_ID, 'items');
    const querySnapshot = await getDocs(userFavsCol);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error('Error fetching favorites from Firebase:', err);
    return [];
  }
};

export const addFavorite = async (item) => {
  try {
    const itemRef = doc(db, FAVORITES_COLLECTION, USER_ID, 'items', item.id.toString());
    await setDoc(itemRef, item);
  } catch (err) {
    console.error('Error adding favorite to Firebase:', err);
  }
};

export const removeFavorite = async (itemId) => {
  try {
    const itemRef = doc(db, FAVORITES_COLLECTION, USER_ID, 'items', itemId.toString());
    await deleteDoc(itemRef);
  } catch (err) {
    console.error('Error removing favorite from Firebase:', err);
  }
};

export const isFavorited = async (itemId) => {
  try {
    const itemRef = doc(db, FAVORITES_COLLECTION, USER_ID, 'items', itemId.toString());
    const docSnap = await getDoc(itemRef);
    return docSnap.exists();
  } catch (err) {
    console.error('Error checking favorite in Firebase:', err);
    return false;
  }
};
