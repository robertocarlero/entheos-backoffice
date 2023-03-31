import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Product } from 'src/app/core/interfaces/product';

@Component({
	selector: 'app-product-single-item',
	templateUrl: './product-single-item.component.html',
	styleUrls: ['./product-single-item.component.scss'],
})
export class ProductSingleItemComponent {
	@Input() public line = false;
	@Input() public detail = false;
	@Input() public disabled = false;
	@Input() public button = true;
	@Input() public customIcon: string;

	@Input() public data: Product;

	@Output() private custom = new EventEmitter();

	constructor() {}

	public get image(): string {
		const image = this.data?.image;
		if (!image) return '';
		if (!image?.url_thumb) return image?.url || '';
		return image?.url_thumb;
	}

	public onCustomButtonClick($event: Event) {
		$event.stopImmediatePropagation();
		this.custom.emit();
	}
}
