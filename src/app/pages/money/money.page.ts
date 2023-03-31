import { Component } from '@angular/core';

import { TransactionDetailModalComponent } from 'src/app/shared/components/modals/transaction-detail-modal/transaction-detail-modal.component';

import { UserService } from 'src/app/core/services/user.service';

import { TransactionsListFilters } from 'src/app/core/interfaces/transactions-list-filters';
import { Transaction } from 'src/app/core/interfaces/transaction';

import { ModalUtil } from 'src/app/core/utils/modal-util';

@Component({
	selector: 'app-money',
	templateUrl: './money.page.html',
	styleUrls: ['./money.page.scss'],
})
export class MoneyPage {
	public filters: TransactionsListFilters;

	constructor(public user: UserService, private modals: ModalUtil) {}

	ngOnInit() {
		this.initialize();
	}

	public get name(): string {
		const name = this.user?.profile?.name;
		if (!name) return '';
		if (typeof name !== 'string') return '';
		const value = name.split(' ')[0];
		return value;
	}

	public onFilterFormOutput(filters: TransactionsListFilters) {
		this.filters = {
			...filters,
			member_id: !this.user.isAdmin ? this.user?.profile?.id : undefined,
		};
	}

	public onTransactionsListOutput(data: Transaction) {
		this.modals.present(TransactionDetailModalComponent, { data });
	}

	private initialize() {
		this.user?.profile$?.subscribe(() => {
			this.filters = {
				...this.filters,
				member_id: !this.user.isAdmin
					? this.user?.profile?.id
					: undefined,
			};
		});
	}
}
