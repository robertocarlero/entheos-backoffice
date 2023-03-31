import { DevicesListFilters } from 'src/app/core/interfaces/devices-list-filters';
import { DBList } from './db-list';

import { DEVICES_LIST } from 'src/app/core/constants/lists-titles';

export class DevicesList extends DBList {
	constructor(
		title = DEVICES_LIST.DEFAULT.title,
		private filters?: DevicesListFilters
	) {
		super(title);
	}

	protected initialize() {
		this.COLLECTION = this.app.PATH_DEVICES;
		this.LIMIT = this.app.PAGER_LIMIT_DEVICES;
		this.firsts();
	}

	protected async firsts() {
		const {
			member_id,
			customer_id,
			statuses,
			date_from,
			date_to,
			order_by,
			order,
		} = this.filters || {};

		let ref = this.db
			.collection(this.COLLECTION)
			.orderBy(order_by || 'admission_date', order || 'asc');

		ref = member_id ? ref.where('member_id', '==', member_id) : ref;
		ref = customer_id ? ref.where('customer_id', '==', customer_id) : ref;
		ref = statuses?.length ? ref.where('status', 'in', statuses) : ref;
		ref = date_from ? ref.startAt(date_from) : ref;
		ref = date_to ? ref.endAt(date_to) : ref;

		ref = this.INFINITE ? ref.limit(this.LIMIT) : ref;

		this.REF = !this.QUERY
			? ref
			: ref.where('search', 'array-contains', this.QUERY);
		this.getInitialData();
	}
}
