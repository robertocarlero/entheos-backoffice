import { Component, Input } from '@angular/core';
import { ModalComponent } from 'src/app/core/classes/modal-component';
import { Customer } from 'src/app/core/interfaces/customer';
import { Device } from 'src/app/core/interfaces/device';
@Component({
	selector: 'app-device-form-modal',
	templateUrl: './device-form-modal.component.html',
	styleUrls: ['./device-form-modal.component.scss'],
})
export class DeviceFormModalComponent extends ModalComponent {
	@Input() public data: Device;
	@Input() public customer: Customer['id'];

	constructor() {
		super();
	}

	public onFormOutput(data: string) {
		this.closeModal(data);
	}
}
