import { Component, Input, OnInit } from '@angular/core';
import { ModalComponent } from 'src/app/core/classes/modal-component';
import { Device } from 'src/app/core/interfaces/device';
import { List } from 'src/app/core/interfaces/list';

@Component({
	selector: 'app-devices-single-list-modal',
	templateUrl: './devices-single-list-modal.component.html',
	styleUrls: ['./devices-single-list-modal.component.scss'],
})
export class DevicesSingleListModalComponent extends ModalComponent {
	@Input() public data: List;
	@Input() public selecter = true;

	constructor() {
		super();
	}

	public onListOutput(data: Device) {
		if (!this.selecter) return;
		this.closeModal(data);
	}
}
