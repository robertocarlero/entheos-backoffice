import { DBDoc } from './db-doc';
import { Image } from './image';
import firebase from 'firebase/app';
export interface User extends DBDoc {
	name: string;
	avatar: Image;
	email: string;
	dni: string;
	address: string;
	birthday: firebase.firestore.Timestamp;
	gender: 'male' | 'female' | 'other';
	active: boolean;
	phoneNumber: string;
	whatsappNumber: string;
}
