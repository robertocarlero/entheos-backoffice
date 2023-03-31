import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/core/interfaces/product';
import { ModalComponent } from '../../../../core/classes/modal-component';

@Component({
	selector: 'app-product-detail-modal',
	templateUrl: './product-detail-modal.component.html',
	styleUrls: ['./product-detail-modal.component.css'],
})
export class ProductDetailModalComponent extends ModalComponent {
	@Input() public data: Product;

	constructor() {
		super();
	}

	public onComponentOutput(data: string) {
		this.closeModal(data);
	}
}
