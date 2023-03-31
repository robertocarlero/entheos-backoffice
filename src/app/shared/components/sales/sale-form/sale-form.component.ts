import { UsersService } from './../../../../core/services/users.service';
import {
	Component,
	OnInit,
	Input,
	EventEmitter,
	Output,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MyErrorStateMatcher } from '../../../../core/classes/my-error-state-matcher';
import { Sale } from '../../../../core/interfaces/sale';
import { SalesService } from '../../../../core/services/sales.service';
import { CustomersService } from '../../../../core/services/customers.service';
import { Utils } from '../../../../core/utils/index';
import { StockProductsList } from 'src/app/core/classes/lists/products/stock-products.list';
import { ItemSelled } from 'src/app/core/interfaces/item-selled';
import { Amount } from 'src/app/core/interfaces/amount';

@Component({
	selector: 'app-sale-form',
	templateUrl: './sale-form.component.html',
	styleUrls: ['./sale-form.component.scss'],
})
export class SaleFormComponent implements OnInit, OnChanges {
	public form = new FormGroup({
		description: new FormControl(''),
		warranty: new FormControl(''),
		customer_id: new FormControl('', [Validators.required]),
		entry_balance: new FormControl('', [Validators.required]),
		products: new FormControl([], [Validators.required]),
	});

	public img: any;
	public img_url: string;
	public matcher = new MyErrorStateMatcher();
	public products = new StockProductsList();
	public total: Amount = { coin: 'USD', value: 0 };
	public quantity: number;

	@Input() public data: Sale;
	@Input() public edit = false;

	@Output() private output = new EventEmitter();

	constructor(
		private sales: SalesService,
		public customers: CustomersService,
		public users: UsersService,
		private utils: Utils
	) {}

	ngOnInit() {
		this.subscribeControlToChanges();
		if (!this.data) return;
		this.form.patchValue(this.data);
		this.img_url = this.data?.image?.url_thumb || this.data?.image?.url;
	}

	ngOnChanges(changes: SimpleChanges) {
		const customer = changes?.customer?.currentValue;
		if (!customer) return;
		const control = this.form.get('customer_id') as FormControl;
		control.setValue(customer);
	}

	public onInputImageOutput(file: File) {
		this.img = file;
		this.img_url = URL.createObjectURL(file);
	}

	public onFormSubmit() {
		this.sendForm();
	}

	public onSaveButtonClick() {
		this.form.markAllAsTouched();
		this.sendForm();
	}

	private sendForm() {
		try {
			if (this.form.invalid) throw 'Invalid form!';
			this.utils.confirm
				.present('Are you sure to save the sale information?')
				.subscribe((confirm) => {
					if (!confirm) return false;
					let data = this.utils.object.clean(this.form.value);
					data = {
						...data,
						total: this.total,
						quantity: this.quantity,
					};
					this.saveData(data, this.img);
				});
		} catch (error) {
			this.utils.toast.present(error);
		}
	}

	private async saveData(data: any, image: File) {
		const loading = await this.utils.loading.present();
		try {
			const res = await this.sales.setOne(data, image, this.data?.id);
			loading.dismiss();
			this.output.emit('success');
			this.utils.toast.present(res.message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}

	private subscribeControlToChanges() {
		const control = this.form.get('products') as FormControl;
		control.valueChanges.subscribe((items: ItemSelled[]) => {
			const { total, quantity } = items.reduce(
				(currentValue, item) => {
					const newValue = currentValue;
					newValue.quantity += item.quantity;
					newValue.total.value +=
						item?.product?.price?.value * item.quantity;
					return newValue;
				},
				{ total: { coin: 'USD', value: 0 }, quantity: 0 }
			);

			this.total = total;
			this.quantity = quantity;
		});
	}
}
