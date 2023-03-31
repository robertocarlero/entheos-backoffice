import { Amount } from 'src/app/core/interfaces/amount';
import { DeviceStatuses } from '../enums/device-statuses';
import { DeviceTypes } from '../enums/device-types';
import { DBDoc } from './db-doc';
import { Image } from './image';
import firebase from 'firebase/app';

export interface Device extends DBDoc {
	model: string;
	brand: string;
	code: string;
	total_amount: Amount;
	serial: string;
	customer_id: string;
	member_id: string;
	type: DeviceTypes;
	status: DeviceStatuses;
	admission_date: firebase.firestore.Timestamp;
	egress_date: firebase.firestore.Timestamp;
	finished_date: firebase.firestore.Timestamp;
	description: string;
	image: Image;
	color: string;
	details?: string;
}
