import { TransactionsListFilters } from 'src/app/core/interfaces/transactions-list-filters';

import { DBList } from './db-list';

import { TRANSACTIONS_LIST } from 'src/app/core/constants/lists-titles';

export class TransactionsList extends DBList {
	constructor(
		title = TRANSACTIONS_LIST.DEFAULT.title,
		private filters?: TransactionsListFilters
	) {
		super(title);
	}

	protected initialize() {
		this.COLLECTION = this.app.PATH_MONEY;
		this.LIMIT = this.app.PAGER_LIMIT_MONEY;
		this.firsts();
	}

	protected async firsts() {
		const { member_id, type, date_from, date_to } = this.filters || {};

		let ref = this.db.collection(this.COLLECTION).orderBy('date', 'desc');

		ref = member_id ? ref.where('users', 'array-contains', member_id) : ref;
		ref = type ? ref.where('type', '==', type) : ref;
		ref = date_from ? ref.startAt(date_from) : ref;
		ref = date_to ? ref.endAt(date_to) : ref;

		ref = this.INFINITE ? ref.limit(this.LIMIT) : ref;

		this.REF = !this.QUERY
			? ref
			: ref.where('search', 'array-contains', this.QUERY);
		this.getInitialData();
	}
}
