import {
	Component,
	OnInit,
	ViewChild,
	Input,
	Output,
	EventEmitter,
	SimpleChanges,
} from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { SalesService } from '../../../../core/services/sales.service';
import { Sale } from '../../../../core/interfaces/sale';
import { Utils } from '../../../../core/utils/index';
import { UserService } from '../../../../core/services/user.service';
import { SaleFormModalComponent } from '../../modals/sale-form-modal/sale-form-modal.component';
import { Customer } from 'src/app/core/interfaces/customer';
import { CustomersService } from 'src/app/core/services/customers.service';
import { OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-sale-item',
	templateUrl: './sale-item.component.html',
	styleUrls: ['./sale-item.component.scss'],
})
export class SaleItemComponent implements OnChanges {
	@ViewChild('item') private item: IonItemSliding;

	@Input() public data: Sale;
	@Output() private output = new EventEmitter();

	public customer: Customer;
	private unsubscribe: Subscription;

	constructor(
		private utils: Utils,
		private sales: SalesService,
		public user: UserService,
		private customers: CustomersService
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		const old_customer_id = changes?.data?.previousValue?.customer_id;
		const customer_id = changes?.data?.currentValue?.customer_id;
		if (old_customer_id === customer_id) return;
		this.unsubscribe?.unsubscribe();
		this.subscribeDataToChanges();
	}

	public get image(): string {
		const image = this.customer?.avatar;
		if (!image) return '';
		if (!image?.url_thumb) return image?.url || '';
		return image?.url_thumb;
	}

	public onClick() {
		this.output.emit();
	}

	public onOptionsButtonClick($event: Event) {
		$event.stopImmediatePropagation();
		this.item.open('end');
	}

	public onEraseOptionClick() {
		if (!this.user?.isAdmin) return;
		this.item.close();
		this.deleteSale(this.data);
	}

	public onEditOptionClick() {
		if (!this.user?.isEditor && !this.user?.isAdmin) return;
		this.item.close();
		this.presentSaleFormModal();
	}

	private async presentSaleFormModal() {
		const props = {
			data: this.data,
			edit: true,
		};
		this.utils.modal.present(SaleFormModalComponent, props);
	}

	private deleteSale(sale: Sale) {
		this.utils.confirm
			.present(
				'Are you sure you want to delete this sale?',
				sale?.sale_id?.toString()
			)
			.subscribe(async (confirm) => {
				if (!confirm) return false;
				try {
					const message = await this.sales.deleteOne(sale.id);
					this.utils.toast.present(message);
				} catch (message) {
					this.utils.toast.present(message);
				}
			});
	}

	private subscribeDataToChanges() {
		this.unsubscribe = this.customers
			.getOne(this.data?.customer_id)
			.subscribe((res: Customer) => {
				this.customer = res;
			});
	}
}
