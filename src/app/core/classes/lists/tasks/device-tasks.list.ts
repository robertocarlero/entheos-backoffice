import { TasksList } from './tasks.list';

export class DeviceTasksList extends TasksList {
	protected INFINITE = false;

	constructor(private device_id: string) {
		super('All Tasks');
	}

	public next(): Promise<any> {
		return new Promise(async (resolve) => {
			resolve(null);
		});
	}

	protected async firsts() {
		const ref = this.db
			.collection(this.COLLECTION)
			.orderBy('schedule')
			.where('device_id', '==', this.device_id);
		this.REF = ref;
		this.getInitialData();
	}
}
