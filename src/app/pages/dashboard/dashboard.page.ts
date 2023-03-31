import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { UserService } from 'src/app/core/services/user.service';

import { DevicesList } from 'src/app/core/classes/lists/devices.list';
import { OverdueTasksList } from 'src/app/core/classes/lists/tasks/overdue-tasks.list';
import { TodayTasksList } from 'src/app/core/classes/lists/tasks/today-tasks.list';

import { Device } from 'src/app/core/interfaces/device';
import { List } from 'src/app/core/interfaces/list';
import { Member } from 'src/app/core/interfaces/member';
import { Task } from 'src/app/core/interfaces/task';

import { ModalUtil } from 'src/app/core/utils/modal-util';

import { TaskDetailModalComponent } from 'src/app/shared/components/modals/task-detail-modal/task-detail-modal.component';

import { DEVICES_LIST } from 'src/app/core/constants/lists-titles';
import { WAITING_DEVICES_STATUSES } from './../../core/constants/devices-statuses-collections';
import { PENDING_DEVICES_STATUSES } from 'src/app/core/constants/devices-statuses-collections';

class CustomDevicesList {
	constructor(public name: string, public list: List) {}
}

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.page.html',
	styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
	public overdue_tasks = new OverdueTasksList();
	public tasks = new TodayTasksList();

	public devices_lists: CustomDevicesList[] = [];

	constructor(
		private modals: ModalUtil,
		private router: Router,
		private user: UserService
	) {}

	ngOnInit() {
		setTimeout(() => this.initialize(), 0);
	}

	public onDevicesListOutput(device: Device) {
		this.router.navigate(['/lab', device.id]);
	}

	public onOneTasksListOutput(data: Task) {
		this.openTaskDetailModal(data);
	}

	private openTaskDetailModal(data: Task) {
		this.modals.present(TaskDetailModalComponent, { data });
	}

	private initialize() {
		this.setDevicesList(this.user?.profile?.id);
		this.user?.profile$?.subscribe((user) => {
			this.setDevicesList(user.id);
		});
	}

	public setDevicesList(member_id: Member['id']) {
		if (!member_id) return (this.devices_lists = []);
		this.devices_lists = [
			new CustomDevicesList(
				'pending',
				new DevicesList(DEVICES_LIST.PENDING.title, {
					member_id,
					statuses: PENDING_DEVICES_STATUSES,
				})
			),
			new CustomDevicesList(
				'waiting',
				new DevicesList(DEVICES_LIST.WAITING.title, {
					member_id,
					statuses: WAITING_DEVICES_STATUSES,
				})
			),
			new CustomDevicesList(
				'all',
				new DevicesList(DEVICES_LIST.DEFAULT.title, { member_id })
			),
		];
	}
}
