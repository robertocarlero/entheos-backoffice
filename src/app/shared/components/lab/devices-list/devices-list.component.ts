import { EventEmitter, Input, Output } from '@angular/core';
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ListComponent } from 'src/app/core/classes/lists/list-component';
import { Customer } from 'src/app/core/interfaces/customer';
import { Device } from 'src/app/core/interfaces/device';
import { UserService } from 'src/app/core/services/user.service';
import { ModalUtil } from 'src/app/core/utils/modal-util';
import { DeviceFormModalComponent } from '../../modals/device-form-modal/device-form-modal.component';

@Component({
	selector: 'app-devices-list',
	templateUrl: './devices-list.component.html',
	styleUrls: ['./devices-list.component.scss'],
})
export class DevicesListComponent extends ListComponent {
	@Input() public color = 'light';
	@Input() public fixed = false;
	@Input() public add = true;
	@Input() public customer: Customer['id'];

	@Output() private output = new EventEmitter<Device>();

	constructor(private modals: ModalUtil, public user: UserService) {
		super();
	}

	public onOneItemOutput(device: Device) {
		this.output.emit(device);
	}

	public onAddButtonClick() {
		this.presentFormModal();
	}

	private async presentFormModal() {
		const props = {
			customer: this.customer,
		};
		this.modals.present(DeviceFormModalComponent, props);
	}
}
