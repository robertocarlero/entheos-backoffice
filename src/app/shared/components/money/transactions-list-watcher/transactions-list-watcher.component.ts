import { Device } from './../../../../core/interfaces/device';
import { Customer } from './../../../../core/interfaces/customer';
import { TRANSACTIONS_LIST } from './../../../../core/constants/lists-titles';

import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';

import { TransactionsList } from 'src/app/core/classes/lists/transactions.list';

import { TransactionsListFilters } from 'src/app/core/interfaces/transactions-list-filters';
import { Transaction } from 'src/app/core/interfaces/transaction';
import { List } from 'src/app/core/interfaces/list';

@Component({
	selector: 'app-transactions-list-watcher',
	templateUrl: './transactions-list-watcher.component.html',
	styleUrls: ['./transactions-list-watcher.component.scss'],
})
export class TransactionsListWatcherComponent implements OnInit {
	@Input() public filters: TransactionsListFilters = {};

	@Input() public add = false;
	@Input() public color = 'light';
	@Input() public fixed = true;
	@Input() public customer: Customer['id'];
	@Input() public device: Device['id'];

	@Output() private output = new EventEmitter<Transaction>();

	public transactions_list: List;

	constructor() {}

	ngOnInit() {
		this.getInitialData(this.filters);
	}

	ngOnChanges(changes: SimpleChanges) {
		const { filters } = changes;

		if (filters?.currentValue === filters?.previousValue) return;

		this.getInitialData(filters?.currentValue);
	}

	public getInitialData(filters) {
		if (!filters) return;

		this.transactions_list = new TransactionsList(
			TRANSACTIONS_LIST.ALL.title,
			filters
		);
	}

	public onTransactionsListOutput(Transaction: Transaction) {
		this.output.emit(Transaction);
	}
}
