import { DBList } from '../db-list';

export class MembersList extends DBList {
	constructor(private active_status?: boolean) {
		super('Members');
	}

	protected initialize() {
		this.COLLECTION = this.app.PATH_USERS;
		this.LIMIT = this.app.PAGER_LIMIT_USERS;
		this.firsts();
	}

	protected async firsts() {
		let ref = this.db
			.collection(this.COLLECTION)
			.orderBy('created_date', 'desc');
		ref =
			typeof this.active_status === 'boolean'
				? ref.where('active', '==', this.active_status)
				: ref;
		ref = this.INFINITE ? ref.limit(this.LIMIT) : ref;
		this.REF = !this.QUERY
			? ref
			: ref.where('search', 'array-contains', this.QUERY);
		this.getInitialData();
	}
}
