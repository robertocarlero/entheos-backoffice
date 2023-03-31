import { Component } from '@angular/core';
import { ModalComponent } from 'src/app/core/classes/modal-component';

@Component({
	selector: 'app-phone-form-modal',
	templateUrl: './phone-form-modal.component.html',
	styleUrls: ['./phone-form-modal.component.scss'],
})
export class PhoneFormModalComponent extends ModalComponent {
	constructor() {
		super();
	}
}
