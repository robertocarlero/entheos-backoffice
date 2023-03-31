import { Topic } from './topic';
import { Amount } from './amount';
import { User } from './user';
import { Roles } from '../enums/roles';
import { Occupations } from '../enums/occupations';
import firebase from 'firebase/app';
import { Image } from './image';

export interface Member extends User {
	member_id: string;
	role: Roles;
	banner: Image;
	firstname: string;
	lastname: string;
	start_date: firebase.firestore.Timestamp;
	occupation: Occupations;
	balance: Amount;
	devices: string[];
	topics: Topic['name'][];
}
