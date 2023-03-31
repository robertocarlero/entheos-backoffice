import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomersService } from 'src/app/core/services/customers.service';

import { DevicesList } from 'src/app/core/classes/lists/devices.list';
import { CustomerTasksList } from 'src/app/core/classes/lists/tasks/customer-tasks.list';

import { Customer } from 'src/app/core/interfaces/customer';
import { List } from 'src/app/core/interfaces/list';
import { Task } from 'src/app/core/interfaces/task';
import { Device } from 'src/app/core/interfaces/device';

import { ModalUtil } from 'src/app/core/utils/modal-util';

import { TaskDetailModalComponent } from 'src/app/shared/components/modals/task-detail-modal/task-detail-modal.component';

@Component({
	selector: 'app-customer-detail',
	templateUrl: './customer-detail.page.html',
	styleUrls: ['./customer-detail.page.scss'],
})
export class CustomerDetailPage implements OnInit {
	public data: Customer;
	public devices: List;
	public tasks: List;

	constructor(
		private route: ActivatedRoute,
		private customers: CustomersService,
		private modals: ModalUtil,
		private router: Router
	) {}

	ngOnInit() {
		this.initialize();
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
		const { customer_id } = this.route.snapshot.params;
		this.subscribeToCustomerDataChange(customer_id);
	}

	private subscribeToCustomerDataChange(customer_id: string) {
		this.customers.getOne(customer_id).subscribe((res: Customer) => {
			this.data = res;
			this.devices = !res
				? null
				: new DevicesList(undefined, {
						customer_id: res?.id,
						order: 'desc',
				  });
			this.tasks = !res ? null : new CustomerTasksList(res?.id);
		});
	}
}
