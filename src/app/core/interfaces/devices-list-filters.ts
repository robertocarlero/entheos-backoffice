import { Device } from 'src/app/core/interfaces/device';

export interface DevicesListFilters {
	customer_id?: Device['customer_id'];
	member_id?: Device['member_id'];
	statuses?: Array<Device['status']>;
	date_from?: Date;
	date_to?: Date;
	order_by?: string;
	order?: 'asc' | 'desc';
}
