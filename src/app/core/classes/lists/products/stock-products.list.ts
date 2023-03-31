import { DBList } from '../db-list';

export class StockProductsList extends DBList {
	constructor(title = 'Products') {
		super(title);
	}

	protected initialize() {
		this.COLLECTION = this.app.PATH_PRODUCTS;
		this.LIMIT = this.app.PAGER_LIMIT_PRODUCTS;
		this.firsts();
	}

	protected async firsts() {
		let ref = this.db.collection(this.COLLECTION).where('stock', '>', 0);
		ref = this.INFINITE ? ref.limit(this.LIMIT) : ref;
		this.REF = !this.QUERY
			? ref
			: ref.where('search', 'array-contains', this.QUERY);
		this.getInitialData();
	}
}
