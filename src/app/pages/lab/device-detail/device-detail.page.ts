import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Customer } from 'src/app/core/interfaces/customer';
import { CustomersService } from 'src/app/core/services/customers.service';
import { List } from 'src/app/core/interfaces/list';
import { ModalUtil } from 'src/app/core/utils/modal-util';
import { Task } from 'src/app/core/interfaces/task';
import { TaskDetailModalComponent } from 'src/app/shared/components/modals/task-detail-modal/task-detail-modal.component';
import { DevicesService } from 'src/app/core/services/devices.service';
import { Device } from 'src/app/core/interfaces/device';
import { DeviceTasksList } from 'src/app/core/classes/lists/tasks/device-tasks.list';

@Component({
	selector: 'app-device-detail-page',
	templateUrl: './device-detail.page.html',
	styleUrls: ['./device-detail.page.scss'],
})
export class DeviceDetailPage implements OnInit {
	public data: Device;
	public tasks: List;
	public customer: Customer;

	constructor(
		private route: ActivatedRoute,
		private customers: CustomersService,
		private devices: DevicesService,
		private modals: ModalUtil
	) {}

	ngOnInit() {
		this.initialize();
	}

	public onOneTasksListOutput(data: Task) {
		this.openTaskDetailModal(data);
	}

	private openTaskDetailModal(data: Task) {
		this.modals.present(TaskDetailModalComponent, { data });
	}

	private initialize() {
		const { device_id } = this.route.snapshot.params;
		this.subscribeToCustomerDataChange(device_id);
	}

	private subscribeToCustomerDataChange(device_id: string) {
		this.devices.getOne(device_id).subscribe((device: Device) => {
			this.data = device;
			this.tasks = !device ? null : new DeviceTasksList(device?.id);
			this.customers
				.getOne(device?.customer_id)
				.subscribe((customer: Customer) => {
					this.customer = customer;
				});
		});
	}
}
