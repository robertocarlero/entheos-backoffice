import { Component, Input } from '@angular/core';
import { ModalComponent } from '../../../../core/classes/modal-component';
import { Sale } from '../../../../core/interfaces/sale';

@Component({
	selector: 'app-sale-detail-modal',
	templateUrl: './sale-detail-modal.component.html',
	styleUrls: ['./sale-detail-modal.component.scss'],
})
export class SaleDetailModalComponent extends ModalComponent {
	@Input() public data: Sale;

	constructor() {
		super();
	}

	public onComponentOutput(data: string) {
		this.closeModal(data);
	}
}
