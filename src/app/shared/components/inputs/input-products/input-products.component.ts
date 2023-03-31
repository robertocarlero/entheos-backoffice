import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { List } from '../../../../core/interfaces/list';
import { Utils } from '../../../../core/utils/index';
import { ProductsSingleListModalComponent } from '../../modals/products-single-list-modal/products-single-list-modal.component';
import { Product } from 'src/app/core/interfaces/product';
import { ItemSelled } from 'src/app/core/interfaces/item-selled';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

class Item implements ItemSelled {
	constructor(public product: Product, public quantity: number) {}
}
@Component({
	selector: 'app-input-products',
	templateUrl: './input-products.component.html',
	styleUrls: ['./input-products.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputProductsComponent),
			multi: true,
		},
	],
})
export class InputProductsComponent implements OnInit, ControlValueAccessor {
	@Input() public line = false;
	@Input() public detail = false;
	@Input() public disabled = false;
	@Input() public button = true;
	@Input() public list: List;

	public products: ItemSelled[] = [];

	constructor(private utils: Utils) {}

	ngOnInit() {}

	writeValue(value: any): void {
		this.products = value;
	}

	registerOnChange(method: any): void {
		this.onChange = method;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	registerOnTouched(method: any): void {
		return;
	}
	onChange(_: any) {}

	public onCleanButtonClick() {
		this.utils.confirm
			.present('Are you sure you want to clear all products?')
			.subscribe((result: boolean) => {
				if (!result) return;
				this.products = [];
				this.onChange(this.products);
			});
	}

	public onKeyUpEnter(container: HTMLDivElement, index: number): void {
		const counters: any = container.getElementsByClassName('counter');
		const new_index = index + 1;

		if (new_index >= counters.length) return counters[index].blur();

		counters[new_index].focus();
	}

	public onInputBlur(quantity: number, product: Product): void {
		const index = this.products.findIndex(
			(e) => e.product.id === product.id
		);
		if (quantity > product?.stock || quantity < 1) {
			const new_quantity = quantity < 1 ? 1 : product?.stock;
			const body = new Item(product, new_quantity);
			this.products.splice(index, 1, body);
		}
		this.onChange(this.products);
	}

	public onInputChange() {
		if (this.disabled) return;
		this.onChange(this.products);
	}

	public onAddButtonClick(product: Product): void {
		if (this.disabled) return;
		this.addProduct(product);
	}

	public onRemoveButtonClick(product: Product): void {
		if (this.disabled) return;
		this.removeProduct(product);
	}

	public onAddProductButtonClick() {
		if (this.disabled) return;
		this.openProductSelecterList();
	}

	private async openProductSelecterList() {
		const data = this.list;
		const result: Product = await this.utils.modal.getResult(
			ProductsSingleListModalComponent,
			{ data }
		);
		if (!result) return;
		this.addProduct(result);
	}

	private addProduct(product: Product): void {
		const index = this.products.findIndex(
			(e) => e.product.id === product.id
		);
		if (index >= 0) {
			const quantity = this.products[index]?.quantity + 1;
			if (quantity > product?.stock) return;
			if (quantity > 100) return;
			this.products[index].quantity = quantity;
		} else {
			const body = new Item(product, 1);
			this.products.push({ ...body });
		}
		this.onChange(this.products);
	}

	private removeProduct(product: Product) {
		const index = this.products.findIndex(
			(e) => e.product.id === product.id
		);
		const quantity = this.products[index]?.quantity - 1;
		if (quantity > 0) {
			this.products[index].quantity = quantity;
		} else {
			this.products.splice(index, 1);
		}
		this.onChange(this.products);
	}
}
