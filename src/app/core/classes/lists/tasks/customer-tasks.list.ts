import { TasksList } from './tasks.list';

export class CustomerTasksList extends TasksList {
	protected INFINITE = false;

	constructor(private customer_id: string) {
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
			.where('customer_id', '==', this.customer_id);
		this.REF = ref;
		this.getInitialData();
	}
}
