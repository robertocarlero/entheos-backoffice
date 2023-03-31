import { DBList } from '../db-list';

export class TasksList extends DBList {
	protected MIN_DATE?: Date;
	protected MAX_DATE?: Date;

	constructor(title = 'Tasks', min_date?: Date, max_date?: Date) {
		super(title);
		this.MIN_DATE = min_date;
		this.MAX_DATE = max_date;
	}

	public get min_date(): Date {
		return this.MIN_DATE;
	}

	public get max_date(): Date {
		return this.MAX_DATE;
	}

	protected initialize() {
		this.COLLECTION = this.app.PATH_TASKS;
		this.LIMIT = this.app.PAGER_LIMIT_TASKS;
		this.firsts();
	}

	protected async firsts() {
		this.fauth.onAuthStateChanged((user) => {
			if (!user) return (this.ITEMS = []);
			let ref = this.db
				.collection(this.COLLECTION)
				.orderBy('schedule')
				.where('member_id', '==', user?.uid);
			ref = this.INFINITE ? ref.limit(this.LIMIT) : ref;
			ref = this.MIN_DATE
				? ref.where('schedule', '>=', this.MIN_DATE)
				: ref;
			ref = this.MAX_DATE
				? ref.where('schedule', '<', this.MAX_DATE)
				: ref;
			this.REF = ref;
			this.getInitialData();
		});
	}
}
