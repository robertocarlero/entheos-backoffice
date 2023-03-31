import { TransactionFormModalComponent } from './../../modals/transaction-form-modal/transaction-form-modal.component';
import { ModalUtil } from 'src/app/core/utils/modal-util';
import { Transaction } from './../../../../core/interfaces/transaction';
import { Device } from 'src/app/core/interfaces/device';
import { Customer } from 'src/app/core/interfaces/customer';
import { TransactionsList } from './../../../../core/classes/lists/transactions.list';
import { ListComponent } from 'src/app/core/classes/lists/list-component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-transactions-list',
	templateUrl: './transactions-list.component.html',
	styleUrls: ['./transactions-list.component.scss'],
})
export class TransactionsListComponent extends ListComponent {
	@Input() public color = 'light';
	@Input() public data: TransactionsList;
	@Input() public fixed = true;
	@Input() public add = true;
	@Input() public customer: Customer['id'];
	@Input() public device: Device['id'];

	@Output() private output = new EventEmitter<Transaction>();

	constructor(private modals: ModalUtil) {
		super();
	}

	public onOneItemOutput(data: Transaction) {
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
		this.modals.present(TransactionFormModalComponent, props);
	}
}
