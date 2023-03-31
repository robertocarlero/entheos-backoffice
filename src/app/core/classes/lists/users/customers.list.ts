import { DBList } from '../db-list';

export class CustomersList extends DBList {
	constructor() {
		super('Customers');
	}

	protected initialize() {
		this.COLLECTION = this.app.PATH_CUSTOMERS;
		this.LIMIT = this.app.PAGER_LIMIT_CUSTOMERS;
		this.firsts();
	}

	protected async firsts() {
		let ref = this.db
			.collection(this.COLLECTION)
			.orderBy('customer_id', 'desc');
		ref = this.INFINITE ? ref.limit(this.LIMIT) : ref;
		this.REF = !this.QUERY
			? ref
			: ref.where('search', 'array-contains', this.QUERY);
		this.getInitialData();
	}
}
