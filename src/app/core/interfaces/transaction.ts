import { User } from 'src/app/core/interfaces/user';
import { Device } from 'src/app/core/interfaces/device';
import firebase from 'firebase/app';

import { Amount } from './amount';
import { DBDoc } from './db-doc';
import { Image } from './image';

import { TransactionsTypes } from 'src/app/core/enums/transaction-types';

export interface Transaction extends DBDoc {
	amount: Amount;
	code: string;
	customer_id: string;
	member_id: string;
	device_id: Device['id'];
	type: TransactionsTypes;
	date: firebase.firestore.Timestamp;
	description: string;
	image: Image;
	color: string;
	entry_balance: User['id'];
	out_balance: User['id'];
}
