import { TasksList } from './tasks.list';

export class UpcomingTasksList extends TasksList {
	constructor() {
		super('Upcoming tasks', new Date());
	}
}
