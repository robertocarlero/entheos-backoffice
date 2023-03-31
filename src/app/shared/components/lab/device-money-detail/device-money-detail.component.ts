import { TransactionsTypes } from './../../../../core/enums/transaction-types';
import { TransactionDetailModalComponent } from './../../modals/transaction-detail-modal/transaction-detail-modal.component';
import { Transaction } from './../../../../core/interfaces/transaction';
import { TransactionFormModalComponent } from './../../modals/transaction-form-modal/transaction-form-modal.component';
import { DevicesService } from 'src/app/core/services/devices.service';
import { Amount } from 'src/app/core/interfaces/amount';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

import { UserService } from 'src/app/core/services/user.service';

import { Device } from 'src/app/core/interfaces/device';

import { MyErrorStateMatcher } from 'src/app/core/classes/my-error-state-matcher';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { Utils } from 'src/app/core/utils';

@Component({
	selector: 'app-device-money-detail',
	templateUrl: './device-money-detail.component.html',
	styleUrls: ['./device-money-detail.component.scss'],
})
export class DeviceMoneyDetailComponent implements OnInit {
	@Input() public data: Device;

	public totalAmountForm = new FormGroup({
		value: new FormControl('', [Validators.required]),
		coin: new FormControl('USD'),
	});
	public matcher = new MyErrorStateMatcher();

	public transactions: Transaction[] = [];

	constructor(
		public user: UserService,
		public utils: Utils,
		private devices: DevicesService,
		private Transactions: TransactionsService
	) {}

	ngOnInit() {
		this.initialize();
	}

	public get totalPayed() {
		const value = this.transactions
			.filter(({ type }) => type === TransactionsTypes.ENTRY)
			.reduce((sum, item) => sum + item.amount.value, 0);

		return value;
	}

	public get totalSpent() {
		const value = this.transactions
			.filter(({ type }) => type === TransactionsTypes.SPENT)
			.reduce((sum, item) => sum + item.amount.value, 0);

		return value;
	}

	public get debt() {
		const value = this.data?.total_amount?.value - this.totalPayed;

		return value;
	}

	public onTransactionClick(data) {
		this.utils.modal.present(TransactionDetailModalComponent, { data });
	}

	public onAddButtonClick() {
		if (!this.user.isAdmin) return;
		this.presentTransactionFormModal();
	}

	public onTotalAmountSaveButtonClick() {
		if (
			this.totalAmountForm?.value?.value ===
			this.data?.total_amount?.value
		)
			return;
		if (!this.user.isAdmin) return;
		this.sendForm();
	}

	private sendForm() {
		try {
			if (this.totalAmountForm.invalid) throw 'Invalid form!';
			const amount = this.totalAmountForm.value;
			this.utils.confirm
				.present(
					'Are you sure to save the amount?',
					`${amount.value} ${amount.coin}`
				)
				.subscribe((confirm) => {
					if (!confirm) return false;
					this.saveTotalAmount(amount);
				});
		} catch (error) {
			this.utils.toast.present(error);
		}
	}

	private async saveTotalAmount(amount: Amount) {
		const loading = await this.utils.loading.present();
		try {
			const res = await this.devices.setOne(
				{ total_amount: amount },
				undefined,
				this.data?.id
			);
			loading.dismiss();
			this.utils.toast.present(res.message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}

	private presentTransactionFormModal() {
		const data = {
			device: this.data?.id,
			customer: this.data?.customer_id,
		};

		this.utils.modal.present(TransactionFormModalComponent, data);
	}

	private initialize() {
		this.getTransactions();

		this.devices.getOne(this.data?.id).subscribe((data) => {
			this.data = data;
			this.totalAmountForm.patchValue(this.data?.total_amount || {});
		});

		this.user.profile$.subscribe(() => {
			const control = this.totalAmountForm.get('value') as FormControl;
			if (this.user.isAdmin) control.enable();
			else control.disable();
		});
	}

	private getTransactions(): void {
		this.Transactions.getAllByDevice(this.data?.id).subscribe((res) => {
			this.transactions = res;
		});
	}
}
