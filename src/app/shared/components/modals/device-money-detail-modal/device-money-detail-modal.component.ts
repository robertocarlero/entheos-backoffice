import { ModalComponent } from './../../../../core/classes/modal-component';
import { Component, Input } from '@angular/core';

import { Device } from 'src/app/core/interfaces/device';

@Component({
	selector: 'app-device-money-detail-modal',
	templateUrl: './device-money-detail-modal.component.html',
	styleUrls: ['./device-money-detail-modal.component.scss'],
})
export class DeviceMoneyDetailModalComponent extends ModalComponent {
	@Input() public data: Device;

	constructor() {
		super();
	}

	public onFormOutput(data: string) {
		this.closeModal(data);
	}
}
