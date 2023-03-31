import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListComponent } from '../../../../core/classes/lists/list-component';
import { Product } from 'src/app/core/interfaces/product';

@Component({
	selector: 'app-products-single-list',
	templateUrl: './products-single-list.component.html',
	styleUrls: ['./products-single-list.component.scss'],
})
export class ProductsSingleListComponent extends ListComponent {
	@Input() public line = true;
	@Input() public detail = true;
	@Input() public button = true;

	@Output() private output = new EventEmitter<Product>();

	constructor() {
		super();
	}

	public onOneItemClick(product: Product) {
		this.output.emit(product);
	}
}
