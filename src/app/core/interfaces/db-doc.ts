import firebase from 'firebase/app';

export interface DBDoc {
	id: string;
	search?: string[];
	changed_by: string;
	created_by: string;
	last_changed_date: firebase.firestore.Timestamp;
	created_date: firebase.firestore.Timestamp;
}
