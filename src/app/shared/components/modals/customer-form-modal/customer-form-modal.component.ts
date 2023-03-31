import { Component, Input } from '@angular/core';
import { ModalComponent } from 'src/app/core/classes/modal-component';
import { Customer } from 'src/app/core/interfaces/customer';

@Component({
	selector: 'app-customer-form-modal',
	templateUrl: './customer-form-modal.component.html',
	styleUrls: ['./customer-form-modal.component.scss'],
})
export class CustomerFormModalComponent extends ModalComponent {
	@Input() public data: Customer;

	constructor() {
		super();
	}

	public onFormOutput(data: string) {
		this.closeModal(data);
	}
}
