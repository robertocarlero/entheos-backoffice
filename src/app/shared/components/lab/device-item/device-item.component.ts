import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { Device } from 'src/app/core/interfaces/device';
import { DevicesService } from 'src/app/core/services/devices.service';
import { UserService } from 'src/app/core/services/user.service';
import { Utils } from 'src/app/core/utils';
import { DeviceFormModalComponent } from '../../modals/device-form-modal/device-form-modal.component';

@Component({
	selector: 'app-device-item',
	templateUrl: './device-item.component.html',
	styleUrls: ['./device-item.component.scss'],
})
export class DeviceItemComponent implements OnInit {
	@ViewChild('item') private item: IonItemSliding;

	@Input() public data: Device;
	@Output() private output = new EventEmitter();

	constructor(
		private utils: Utils,
		private modalController: ModalController,
		private devices: DevicesService,
		public user: UserService
	) {}

	ngOnInit() {}

	public get image(): string {
		const image = this.data?.image;
		if (!image) return '';
		if (!image?.url_thumb) return image?.url || '';
		return image?.url_thumb;
	}

	public onClick() {
		this.output.emit();
	}

	public onOptionsButtonClick($event: Event) {
		$event.stopImmediatePropagation();
		this.item.open('end');
	}

	public onEraseOptionClick() {
		if (!this?.user?.isAdmin) return;
		this.item.close();
		this.deleteDevice(this.data);
	}

	public onEditOptionClick() {
		if (!this?.user?.isEditor && !this?.user?.isAdmin) return;
		this.item.close();
		this.presentDeviceFormModal();
	}

	private async presentDeviceFormModal() {
		const props = {
			data: this.data,
		};
		this.utils.modal.present(DeviceFormModalComponent, props);
	}

	private deleteDevice(device: Device) {
		this.utils.confirm
			.present(
				'Are you sure you want to delete this device?',
				device.code
			)
			.subscribe(async (confirm) => {
				if (!confirm) return false;
				try {
					const message = await this.devices.deleteOne(device.id);
					this.utils.toast.present(message);
				} catch (message) {
					this.utils.toast.present(message);
				}
			});
	}
}
