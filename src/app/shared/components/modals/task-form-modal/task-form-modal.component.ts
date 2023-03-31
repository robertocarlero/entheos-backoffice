import { Component, Input } from '@angular/core';
import { ModalComponent } from 'src/app/core/classes/modal-component';
import { Customer } from 'src/app/core/interfaces/customer';
import { Task } from 'src/app/core/interfaces/task';
import { Device } from 'src/app/core/interfaces/device';

@Component({
	selector: 'app-task-form-modal',
	templateUrl: './task-form-modal.component.html',
	styleUrls: ['./task-form-modal.component.scss'],
})
export class TaskFormModalComponent extends ModalComponent {
	@Input() public data: Task;
	@Input() public customer: Customer['id'];
	@Input() public device: Device['id'];

	constructor() {
		super();
	}

	public onFormOutput(data: string) {
		this.closeModal(data);
	}
}
