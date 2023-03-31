import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListComponent } from 'src/app/core/classes/lists/list-component';
import { TasksList } from 'src/app/core/classes/lists/tasks/tasks.list';
import { Customer } from 'src/app/core/interfaces/customer';
import { Task } from 'src/app/core/interfaces/task';
import { Device } from 'src/app/core/interfaces/device';
import { ModalUtil } from 'src/app/core/utils/modal-util';
import { TaskFormModalComponent } from '../../modals/task-form-modal/task-form-modal.component';

@Component({
	selector: 'app-tasks-list',
	templateUrl: './tasks-list.component.html',
	styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent extends ListComponent {
	@Input() public data: TasksList;
	@Input() public fixed = false;
	@Input() public add = true;
	@Input() public customer: Customer['id'];
	@Input() public device: Device['id'];

	@Output() private output = new EventEmitter<Task>();

	constructor(private modals: ModalUtil) {
		super();
	}

	public onOneItemOutput(data: Task) {
		this.output.emit(data);
	}

	public onAddButtonClick() {
		this.presentFormModal();
	}

	private async presentFormModal() {
		const props = {
			customer: this.customer,
			device: this.device,
		};
		this.modals.present(TaskFormModalComponent, props);
	}
}
