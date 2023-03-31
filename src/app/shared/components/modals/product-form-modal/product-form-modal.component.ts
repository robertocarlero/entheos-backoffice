import { Component, Input } from '@angular/core';
import { ModalComponent } from '../../../../core/classes/modal-component';
import { Product } from 'src/app/core/interfaces/product';

@Component({
	selector: 'app-product-form-modal',
	templateUrl: './product-form-modal.component.html',
	styleUrls: ['./product-form-modal.component.css'],
})
export class ProductFormModalComponent extends ModalComponent {
	@Input() public data: Product;

	constructor() {
		super();
	}

	public onFormOutput(data: string) {
		this.closeModal(data);
	}
}
