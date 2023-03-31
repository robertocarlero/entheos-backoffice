import { Component, Input } from '@angular/core';
import { ModalComponent } from '../../../../core/classes/modal-component';
import { Product } from 'src/app/core/interfaces/product';
import { Customer } from 'src/app/core/interfaces/customer';

@Component({
	selector: 'app-sale-form-modal',
	templateUrl: './sale-form-modal.component.html',
	styleUrls: ['./sale-form-modal.component.scss'],
})
export class SaleFormModalComponent extends ModalComponent {
	@Input() public data: Product;
	@Input() public edit = false;
	@Input() public customer: Customer['id'];

	constructor() {
		super();
	}

	public onFormOutput(data: string) {
		this.closeModal(data);
	}
}
