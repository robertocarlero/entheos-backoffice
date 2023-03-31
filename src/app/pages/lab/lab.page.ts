import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'src/app/core/services/user.service';

import { DevicesList } from 'src/app/core/classes/lists/devices.list';

import { Device } from 'src/app/core/interfaces/device';
import { List } from 'src/app/core/interfaces/list';

import { DEVICES_LIST } from 'src/app/core/constants/lists-titles';
import { PENDING_DEVICES_STATUSES } from 'src/app/core/constants/devices-statuses-collections';
import { WAITING_DEVICES_STATUSES } from 'src/app/core/constants/devices-statuses-collections';
class CustomDevicesList {
	constructor(public name: string, public list: List) {}
}
@Component({
	selector: 'app-lab',
	templateUrl: './lab.page.html',
	styleUrls: ['./lab.page.scss'],
})
export class LabPage {
	public devices_lists: CustomDevicesList[] = [
		new CustomDevicesList(
			'pending',
			new DevicesList(DEVICES_LIST.PENDING.title, {
				statuses: PENDING_DEVICES_STATUSES,
			})
		),
		new CustomDevicesList(
			'waiting',
			new DevicesList(DEVICES_LIST.WAITING.title, {
				statuses: WAITING_DEVICES_STATUSES,
			})
		),
		new CustomDevicesList('all', new DevicesList()),
	];

	constructor(public user: UserService, private router: Router) {}

	public get name(): string {
		const name = this.user?.profile?.name;
		if (!name) return '';
		if (typeof name !== 'string') return '';
		const value = name.split(' ')[0];
		return value;
	}

	public onDevicesListOutput(device: Device) {
		this.router.navigate(['/lab', device.id]);
	}
}
