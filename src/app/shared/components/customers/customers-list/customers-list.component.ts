import { Component, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ListComponent } from 'src/app/core/classes/lists/list-component';
import { Customer } from 'src/app/core/interfaces/customer';
import { CustomerFormModalComponent } from '../../modals/customer-form-modal/customer-form-modal.component';

@Component({
	selector: 'app-customers-list',
	templateUrl: './customers-list.component.html',
	styleUrls: ['./customers-list.component.scss'],
})
export class CustomersListComponent extends ListComponent {
	@Output() private output = new EventEmitter<Customer>();

	constructor(private modalController: ModalController) {
		super();
	}

	public onOneItemOutput(customer: Customer) {
		this.output.emit(customer);
	}

	public onAddButtonClick() {
		this.presentFormModal();
	}

	private async presentFormModal() {
		const modal = await this.modalController.create({
			component: CustomerFormModalComponent,
		});
		await modal.present();
	}
}
