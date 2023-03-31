import { TasksList } from './tasks.list';

export class TodayTasksList extends TasksList {
	protected INFINITE = false;

	constructor() {
		super(`Today's tasks`);

		const now = new Date();
		const today = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate()
		);

		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		this.MIN_DATE = today;
		this.MAX_DATE = tomorrow;
	}

	public next(): Promise<any> {
		return new Promise(async (resolve) => {
			resolve(null);
		});
	}
}
