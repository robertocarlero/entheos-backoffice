import { Component, Input, OnInit } from '@angular/core';
import { ModalComponent } from 'src/app/core/classes/modal-component';
import { Task } from 'src/app/core/interfaces/task';

@Component({
	selector: 'app-task-detail-modal',
	templateUrl: './task-detail-modal.component.html',
	styleUrls: ['./task-detail-modal.component.scss'],
})
export class TaskDetailModalComponent extends ModalComponent {
	@Input() public data: Task;

	constructor() {
		super();
	}

	public onComponentOutput(data: string) {
		this.closeModal(data);
	}
}
