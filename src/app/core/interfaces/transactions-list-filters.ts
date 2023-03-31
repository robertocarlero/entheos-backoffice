import { TransactionsTypes } from './../enums/transaction-types';
import { Transaction } from 'src/app/core/interfaces/transaction';

export interface TransactionsListFilters {
	type?: TransactionsTypes;
	member_id?: Transaction['member_id'];
	date_from?: Date;
	date_to?: Date;
}
