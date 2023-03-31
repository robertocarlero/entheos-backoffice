import { Component } from '@angular/core';
import { ModalComponent } from './../../../../core/classes/modal-component';

@Component({
	selector: 'app-notification-form-modal',
	templateUrl: './notification-form-modal.component.html',
	styleUrls: ['./notification-form-modal.component.scss'],
})
export class NotificationFormModalComponent extends ModalComponent {
	constructor() {
		super();
	}

	public onFormOutput(data: string) {
		this.closeModal(data);
	}
}
