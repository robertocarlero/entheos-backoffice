import { Component, OnInit } from '@angular/core';
import { OverdueTasksList } from 'src/app/core/classes/lists/tasks/overdue-tasks.list';
import { TodayTasksList } from 'src/app/core/classes/lists/tasks/today-tasks.list';
import { TomorrowTasksList } from 'src/app/core/classes/lists/tasks/tomorrow-tasks.list';
import { UpcomingTasksList } from 'src/app/core/classes/lists/tasks/upcoming-tasks-list';
import { List } from 'src/app/core/interfaces/list';
import { Task } from 'src/app/core/interfaces/task';
import { UserService } from 'src/app/core/services/user.service';
import { ModalUtil } from 'src/app/core/utils/modal-util';
import { TaskDetailModalComponent } from 'src/app/shared/components/modals/task-detail-modal/task-detail-modal.component';

class CustomTasksList {
	constructor(public name: string, public list: List) {}
}

@Component({
	selector: 'app-tasks',
	templateUrl: './tasks.page.html',
	styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {
	public today = new Date();

	public overdue_tasks = new OverdueTasksList();

	public tasks_lists: CustomTasksList[] = [
		new CustomTasksList('upcoming', new UpcomingTasksList()),
		new CustomTasksList('today', new TodayTasksList()),
		new CustomTasksList('tomorrow', new TomorrowTasksList()),
	];

	constructor(public user: UserService, private modals: ModalUtil) {}

	ngOnInit() {
		this.subscribeTime();
	}

	public get name(): string {
		const name = this.user?.profile?.name;
		if (!name) return '';
		if (typeof name !== 'string') return '';
		const value = name.split(' ')[0];
		return value;
	}

	public onOneTasksListOutput(data: Task) {
		this.openTaskDetailModal(data);
	}

	private openTaskDetailModal(data: Task) {
		this.modals.present(TaskDetailModalComponent, { data });
	}

	private subscribeTime() {
		setInterval(() => {
			this.today = new Date();
		}, 1000);
	}
}
