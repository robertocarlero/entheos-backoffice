import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/core/classes/my-error-state-matcher';
import { Product } from 'src/app/core/interfaces/product';
import { CustomersService } from 'src/app/core/services/customers.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { Utils } from 'src/app/core/utils';

@Component({
	selector: 'app-product-form',
	templateUrl: './product-form.component.html',
	styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
	public form = new FormGroup({
		name: new FormControl('', [Validators.required]),
		description: new FormControl(''),
		price: new FormGroup({
			coin: new FormControl('USD'),
			value: new FormControl(1, [
				Validators.required,
				Validators.min(0.1),
			]),
		}),
		stock: new FormControl(1, [Validators.required, Validators.min(0)]),
	});

	public img: any;
	public img_url: string;
	public matcher = new MyErrorStateMatcher();

	@Input() public data: Product;

	@Output() private output = new EventEmitter();

	constructor(
		private products: ProductsService,
		public customers: CustomersService,
		private utils: Utils
	) {}

	ngOnInit() {
		if (!this.data) return;
		this.form.patchValue(this.data);
		this.img_url = this.data?.image?.url_thumb || this.data?.image?.url;
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
				.present(
					'Are you sure to save the product information?',
					this.form?.value?.name
				)
				.subscribe((confirm) => {
					if (!confirm) return false;
					const data = {
						...this.data,
						...this.form.value,
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
			const res = await this.products.setOne(data, image, this.data?.id);
			loading.dismiss();
			this.output.emit('success');
			this.utils.toast.present(res.message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}
}
