import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	SimpleChanges,
	OnChanges,
} from '@angular/core';
import { Sale } from '../../../../core/interfaces/sale';
import { SalesService } from '../../../../core/services/sales.service';
import { Utils } from '../../../../core/utils/index';
import { SaleFormModalComponent } from '../../modals/sale-form-modal/sale-form-modal.component';
import { Customer } from '../../../../core/interfaces/customer';
import { Subscription } from 'rxjs';
import { CustomersService } from '../../../../core/services/customers.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
	selector: 'app-sale-detail',
	templateUrl: './sale-detail.component.html',
	styleUrls: ['./sale-detail.component.scss'],
})
export class SaleDetailComponent implements OnInit, OnChanges {
	@Input() public data: Sale;

	@Output() private output = new EventEmitter();

	public customer: Customer;
	private unsubscribe: Subscription;

	constructor(
		private utils: Utils,
		private sales: SalesService,
		private customers: CustomersService,
		public user: UserService
	) {}

	ngOnInit() {
		this.subscribeDataToChanges();
	}

	ngOnChanges(changes: SimpleChanges): void {
		const old_customer_id = changes?.data?.previousValue?.customer_id;
		const customer_id = changes?.data?.currentValue?.customer_id;
		if (old_customer_id === customer_id) return;
		this.unsubscribe?.unsubscribe();
		this.subscribeDataToChanges();
	}

	public onEditButtonClick() {
		if (!this.user.isEditor && !this.user.isAdmin) return;
		this.presentSaleFormModal();
	}

	public onDeleteButtonClick() {
		if (!this.user.isAdmin) return;
		this.utils.confirm
			.present('Are you sure you want to delete this sale?')
			.subscribe(async (confirm) => {
				if (!confirm) return false;
				this.deleteSale();
			});
	}

	private async deleteSale() {
		const loading = await this.utils.loading.present();
		try {
			const message = await this.sales.deleteOne(this.data?.id);
			loading.dismiss();
			this.output.emit('deleted');
			this.utils.toast.present(message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}

	private presentSaleFormModal() {
		const props = {
			data: this.data,
			edit: true,
		};
		this.utils.modal.present(SaleFormModalComponent, props);
	}

	private subscribeDataToChanges() {
		this.sales.getOne(this.data.id).subscribe((res: Sale) => {
			if (!res) this.output.emit('no-exist');
			this.data = res;
		});
		this.unsubscribe = this.customers
			.getOne(this.data?.customer_id)
			.subscribe((res: Customer) => {
				this.customer = res;
			});
	}
}
