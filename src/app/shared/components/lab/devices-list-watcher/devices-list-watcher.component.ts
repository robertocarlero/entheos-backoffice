import { DEVICES_LIST } from 'src/app/core/constants/lists-titles';
import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';

import { DevicesList } from 'src/app/core/classes/lists/devices.list';

import { DevicesListFilters } from 'src/app/core/interfaces/devices-list-filters';
import { Device } from 'src/app/core/interfaces/device';
import { List } from 'src/app/core/interfaces/list';

@Component({
	selector: 'app-devices-list-watcher',
	templateUrl: './devices-list-watcher.component.html',
	styleUrls: ['./devices-list-watcher.component.scss'],
})
export class DevicesListWatcherComponent implements OnInit {
	@Input() public filters: DevicesListFilters = {};

	@Output() private output = new EventEmitter<Device>();

	public devices_list: List;

	constructor() {}

	ngOnInit() {
		this.getInitialData(this.filters);
	}

	ngOnChanges(changes: SimpleChanges) {
		const { filters } = changes;

		if (filters.currentValue === filters.previousValue) return;

		this.getInitialData(filters.currentValue);
	}

	public getInitialData(filters) {
		if (!filters) return;

		this.devices_list = new DevicesList(DEVICES_LIST.ALL.title, filters);
	}

	public onDevicesListOutput(device: Device) {
		this.output.emit(device);
	}
}
