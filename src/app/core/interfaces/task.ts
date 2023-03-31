import { DBDoc } from './db-doc';
import { Customer } from './customer';
import { Member } from './member';
import firebase from 'firebase/app';
import { Device } from './device';

export interface Task extends DBDoc {
	schedule: firebase.firestore.Timestamp;
	notify: boolean;
	completed: boolean;
	color: string;
	description: string;
	title: string;
	device_id: Device['id'];
	customer_id: Customer['id'];
	member_id: Member['id'];
}
