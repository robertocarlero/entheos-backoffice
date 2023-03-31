import { TasksList } from './tasks.list';

export class TomorrowTasksList extends TasksList {
	protected INFINITE = false;

	constructor() {
		super(`Tomorrow's tasks`);

		const now = new Date();
		const today = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate()
		);

		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		const day_after_tomorrow = new Date(tomorrow);
		day_after_tomorrow.setDate(tomorrow.getDate() + 1);

		this.MIN_DATE = tomorrow;
		this.MAX_DATE = day_after_tomorrow;
	}

	public next(): Promise<any> {
		return new Promise(async (resolve) => {
			resolve(null);
		});
	}
}
