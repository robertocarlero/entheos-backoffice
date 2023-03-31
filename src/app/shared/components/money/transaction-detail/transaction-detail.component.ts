import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { IonToggle } from '@ionic/angular';
import { Customer } from 'src/app/core/interfaces/customer';
import { Device } from 'src/app/core/interfaces/device';
import { Member } from 'src/app/core/interfaces/member';
import { Transaction } from 'src/app/core/interfaces/transaction';
import { CustomersService } from 'src/app/core/services/customers.service';
import { DevicesService } from 'src/app/core/services/devices.service';
import { TransactionsService } from 'src/app/core/services/transactions.service';
import { UsersService } from 'src/app/core/services/users.service';
import { Utils } from 'src/app/core/utils';
import { TransactionFormModalComponent } from '../../modals/transaction-form-modal/transaction-form-modal.component';
import { UserService } from '../../../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-transaction-detail',
	templateUrl: './transaction-detail.component.html',
	styleUrls: ['./transaction-detail.component.scss'],
})
export class TransactionDetailComponent implements OnInit {
	@Input() public data: Transaction;

	@Output() private output = new EventEmitter();

	public customer: Customer;
	public device: Device;

	constructor(
		private utils: Utils,
		private transactions: TransactionsService,
		private users: UsersService,
		private customers: CustomersService,
		private devices: DevicesService,
		public user: UserService,
		private router: Router
	) {}

	ngOnInit() {
		this.subscribeDataToChanges();
	}

	public onCustomerItemClick() {
		this.output.emit('closed');
		this.router.navigate(['/customers', this.customer.id]);
	}

	public onDeviceItemClick() {
		this.output.emit('closed');
		this.router.navigate(['/lab', this.device.id]);
	}

	public onEditButtonClick() {
		if (!this.user?.isAdmin) return;
		this.presentTransactionFormModal();
	}

	public onDeleteButtonClick() {
		if (!this.user?.isAdmin) return;
		this.utils.confirm
			.present('Are you sure you want to delete this transaction?')
			.subscribe(async (confirm) => {
				if (!confirm) return false;
				this.deleteTransaction();
			});
	}

	private async deleteTransaction() {
		const loading = await this.utils.loading.present();
		try {
			const message = await this.transactions.deleteOne(this.data?.id);
			loading.dismiss();
			this.output.emit('deleted');
			this.utils.toast.present(message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}

	private presentTransactionFormModal() {
		const data = this.data;
		this.utils.modal.present(TransactionFormModalComponent, { data });
	}

	private subscribeDataToChanges() {
		this.transactions.getOne(this.data.id).subscribe((res: Transaction) => {
			if (!res) this.output.emit('no-exist');
			this.data = res;
			if (!res?.customer_id) return (this.customer = null);
			this.customers
				.getOne(res?.customer_id)
				.subscribe((customer: Customer) => {
					this.customer = customer;
				});
			if (!res?.device_id) return (this.device = null);
			this.devices.getOne(res?.device_id).subscribe((device: Device) => {
				this.device = device;
			});
		});
	}
}
