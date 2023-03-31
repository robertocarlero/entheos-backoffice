import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListComponent } from 'src/app/core/classes/lists/list-component';
import { Device } from 'src/app/core/interfaces/device';

@Component({
	selector: 'app-devices-single-list',
	templateUrl: './devices-single-list.component.html',
	styleUrls: ['./devices-single-list.component.scss'],
})
export class DevicesSingleListComponent extends ListComponent {
	@Input() public line = true;
	@Input() public detail = true;
	@Input() public button = true;

	@Output() private output = new EventEmitter<Device>();

	constructor() {
		super();
	}

	public onOneItemClick(device: Device) {
		this.output.emit(device);
	}
}
