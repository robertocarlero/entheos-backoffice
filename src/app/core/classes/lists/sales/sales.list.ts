import { DBList } from '../db-list';

export class SalesList extends DBList {
	constructor(title = 'Sales') {
		super(title);
	}

	protected initialize() {
		this.COLLECTION = this.app.PATH_SALES;
		this.LIMIT = this.app.PAGER_LIMIT_SALES;
		this.firsts();
	}

	protected async firsts() {
		let ref = this.db
			.collection(this.COLLECTION)
			.orderBy('sale_id', 'desc');
		ref = this.INFINITE ? ref.limit(this.LIMIT) : ref;
		this.REF = !this.QUERY
			? ref
			: ref.where('search', 'array-contains', this.QUERY);
		this.getInitialData();
	}
}
