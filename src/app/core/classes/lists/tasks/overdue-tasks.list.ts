import { TasksList } from './tasks.list';

export class OverdueTasksList extends TasksList {
	protected INFINITE = false;

	constructor() {
		super('Overdue tasks', null, new Date());
	}

	public next(): Promise<any> {
		return new Promise(async (resolve) => {
			resolve(null);
		});
	}

	protected async firsts() {
		this.fauth.onAuthStateChanged((user) => {
			if (!user) return (this.ITEMS = []);
			let ref = this.db
				.collection(this.COLLECTION)
				.orderBy('schedule')
				.where('member_id', '==', user?.uid)
				.where('completed', '==', false);

			ref = this.INFINITE ? ref.limit(this.LIMIT) : ref;
			ref = this.MIN_DATE
				? ref.where('schedule', '>=', this.MIN_DATE)
				: ref;
			ref = this.MAX_DATE
				? ref.where('schedule', '<', this.MAX_DATE)
				: ref;

			this.REF = !this.QUERY
				? ref
				: ref.where('search', 'array-contains', this.QUERY);

			this.getInitialData();
		});
	}
}
