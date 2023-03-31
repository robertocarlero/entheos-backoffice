import {
	Component,
	EventEmitter,
	Input,
	Output,
	ViewChild,
} from '@angular/core';
import { IonCheckbox } from '@ionic/angular';
import { Task } from 'src/app/core/interfaces/task';
import { TasksService } from 'src/app/core/services/tasks.service';
import { Utils } from 'src/app/core/utils';

@Component({
	selector: 'app-task-item',
	templateUrl: './task-item.component.html',
	styleUrls: ['./task-item.component.scss'],
})
export class TaskItemComponent {
	@ViewChild('checkbox') private checkbox: IonCheckbox;

	@Input() public data: Task;
	@Input() public min_date: Date;
	@Output() private output = new EventEmitter<Task>();

	constructor(private utils: Utils, private tasks: TasksService) {}

	public onClick() {
		this.output.emit(this.data);
	}

	public async onCheckboxInputClick($event: Event) {
		$event.stopPropagation();
		this.checkbox.checked = !this.checkbox.checked;
		if (this.checkbox.disabled) return;
		const confirm = await this.confirmChangeStatus();
		if (!confirm) return;
		this.toggleTaskStatus();
	}

	private async toggleTaskStatus() {
		this.checkbox.disabled = true;
		try {
			const status = !this.data?.completed;
			await this.tasks.setCompletedState(status, this.data?.id);
			this.checkbox.disabled = false;
		} catch (message) {
			this.checkbox.disabled = false;
			this.utils.toast.present(message);
		}
	}

	private confirmChangeStatus() {
		return new Promise((resolve) => {
			if (!!this.min_date) return resolve(true);
			this.utils.confirm
				.present(
					'This task will probably be moved from the list, and it will disappear from the current list.'
				)
				.subscribe((result) => {
					resolve(!!result);
				});
		});
	}
}
