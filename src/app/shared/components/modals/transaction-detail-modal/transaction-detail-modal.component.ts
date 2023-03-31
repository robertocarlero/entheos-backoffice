import { Component, Input, OnInit } from '@angular/core';
import { ModalComponent } from 'src/app/core/classes/modal-component';
import { Transaction } from 'src/app/core/interfaces/transaction';

@Component({
	selector: 'app-transaction-detail-modal',
	templateUrl: './transaction-detail-modal.component.html',
	styleUrls: ['./transaction-detail-modal.component.scss'],
})
export class TransactionDetailModalComponent extends ModalComponent {
	@Input() public data: Transaction;

	constructor() {
		super();
	}

	public onComponentOutput(data: string) {
		this.closeModal(data);
	}
}
