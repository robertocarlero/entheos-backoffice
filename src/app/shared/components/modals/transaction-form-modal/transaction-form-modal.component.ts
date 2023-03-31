import { Component, Input } from '@angular/core';
import { ModalComponent } from 'src/app/core/classes/modal-component';
import { Customer } from 'src/app/core/interfaces/customer';
import { Transaction } from 'src/app/core/interfaces/transaction';
import { Device } from 'src/app/core/interfaces/device';

@Component({
	selector: 'app-transaction-form-modal',
	templateUrl: './transaction-form-modal.component.html',
	styleUrls: ['./transaction-form-modal.component.scss'],
})
export class TransactionFormModalComponent extends ModalComponent {
	@Input() public data: Transaction;
	@Input() public customer: Customer['id'];
	@Input() public device: Device['id'];

	constructor() {
		super();
	}

	public onFormOutput(data: string) {
		this.closeModal(data);
	}
}
