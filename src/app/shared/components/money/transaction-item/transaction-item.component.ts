import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { IonItemSliding } from '@ionic/angular';

import { UserService } from 'src/app/core/services/user.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';

import { Utils } from 'src/app/core/utils';
import { Transaction } from './../../../../core/interfaces/transaction';

import { TransactionFormModalComponent } from './../../modals/transaction-form-modal/transaction-form-modal.component';

@Component({
	selector: 'app-transaction-item',
	templateUrl: './transaction-item.component.html',
	styleUrls: ['./transaction-item.component.scss'],
})
export class TransactionItemComponent implements OnInit {
	@ViewChild('item') private item: IonItemSliding;

	@Input() public data: Transaction;
	@Output() private output = new EventEmitter<Transaction>();

	constructor(
		private utils: Utils,
		public user: UserService,
		public transactions: TransactionsService
	) {}

	ngOnInit() {}

	public onClick() {
		this.output.emit(this.data);
	}

	public onOptionsButtonClick($event: Event) {
		$event.stopImmediatePropagation();
		if (!this.user?.isAdmin) return;
		this.item.open('end');
	}

	public onEditOptionClick() {
		if (!this.user?.isAdmin) return;
		this.item.close();
		this.presentTransactionFormModal(this.data);
	}

	private async presentTransactionFormModal(data: any) {
		this.utils.modal.present(TransactionFormModalComponent, { data });
	}
}
