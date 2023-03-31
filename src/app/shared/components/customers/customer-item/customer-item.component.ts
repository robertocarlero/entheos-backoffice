import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
	ViewRef,
} from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { Customer } from 'src/app/core/interfaces/customer';
import { CustomersService } from 'src/app/core/services/customers.service';
import { UserService } from 'src/app/core/services/user.service';
import { Utils } from 'src/app/core/utils';
import { CustomerFormModalComponent } from '../../modals/customer-form-modal/customer-form-modal.component';

@Component({
	selector: 'app-customer-item',
	templateUrl: './customer-item.component.html',
	styleUrls: ['./customer-item.component.scss'],
})
export class CustomerItemComponent implements OnInit {
	@ViewChild('item') private item: IonItemSliding;

	@Input() public data: Customer;
	@Output() private output = new EventEmitter();

	constructor(
		private utils: Utils,
		private modalController: ModalController,
		private customers: CustomersService,
		public user: UserService
	) {}

	ngOnInit() {}

	public get image(): string {
		const avatar = this.data?.avatar;
		if (!avatar) return '';
		if (!avatar?.url_thumb) return avatar?.url || '';
		return avatar?.url_thumb;
	}

	public onClick() {
		this.output.emit();
	}

	public onOptionsButtonClick($event: Event) {
		$event.stopImmediatePropagation();
		this.item.open('end');
	}

	public onEraseOptionClick() {
		this.item.close();
		this.deleteCustomer(this.data);
	}

	public onEditOptionClick() {
		this.item.close();
		this.presentCustomerFormModal(this.data);
	}

	private async presentCustomerFormModal(data: any) {
		const modal = await this.modalController.create({
			component: CustomerFormModalComponent,
			componentProps: { data },
		});

		await modal.present();
	}

	private deleteCustomer(customer: Customer) {
		this.utils.confirm
			.present(
				'Are you sure you want to delete this customer?',
				customer.name
			)
			.subscribe(async (confirm) => {
				if (!confirm) return false;
				try {
					const message = await this.customers.deleteOne(customer.id);
					this.utils.toast.present(message);
				} catch (message) {
					this.utils.toast.present(message);
				}
			});
	}
}
