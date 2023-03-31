import { Component, Input } from '@angular/core';
import { List } from '../../../../core/interfaces/list';
import { Product } from 'src/app/core/interfaces/product';
import { ModalComponent } from '../../../../core/classes/modal-component';

@Component({
	selector: 'app-products-single-list-modal',
	templateUrl: './products-single-list-modal.component.html',
	styleUrls: ['./products-single-list-modal.component.scss'],
})
export class ProductsSingleListModalComponent extends ModalComponent {
	@Input() public data: List;
	@Input() public selecter = true;

	constructor() {
		super();
	}

	public onListOutput(data: Product) {
		if (!this.selecter) return;
		this.closeModal(data);
	}
}
