import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { IonToggle } from '@ionic/angular';
import { Customer } from 'src/app/core/interfaces/customer';
import { Device } from 'src/app/core/interfaces/device';
import { Member } from 'src/app/core/interfaces/member';
import { Task } from 'src/app/core/interfaces/task';
import { CustomersService } from 'src/app/core/services/customers.service';
import { DevicesService } from 'src/app/core/services/devices.service';
import { TasksService } from 'src/app/core/services/tasks.service';
import { UsersService } from 'src/app/core/services/users.service';
import { Utils } from 'src/app/core/utils';
import { TaskFormModalComponent } from '../../modals/task-form-modal/task-form-modal.component';
import { UserService } from '../../../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-task-detail',
	templateUrl: './task-detail.component.html',
	styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent implements OnInit {
	@ViewChild('toggle') private toggle: IonToggle;

	@Input() public data: Task;

	@Output() private output = new EventEmitter();

	public member: Member;
	public customer: Customer;
	public device: Device;

	constructor(
		private utils: Utils,
		private tasks: TasksService,
		private users: UsersService,
		private customers: CustomersService,
		private devices: DevicesService,
		public user: UserService,
		private router: Router
	) {}

	ngOnInit() {
		this.subscribeDataToChanges();
	}

	public get is_own(): boolean {
		return this.user?.profile?.id === this.data?.member_id;
	}

	public onMemberItemClick() {
		if (!this.user.isAdmin) return;
		this.output.emit('closed');
		this.router.navigate(['/team', this.member.id]);
	}

	public onCustomerItemClick() {
		this.output.emit('closed');
		this.router.navigate(['/customers', this.customer.id]);
	}

	public onDeviceItemClick() {
		this.output.emit('closed');
		this.router.navigate(['/lab', this.device.id]);
	}

	public onEditButtonClick() {
		if (!this.user?.isEditor && !this.user?.isAdmin && !this.is_own) return;
		this.presentTaskFormModal();
	}

	public onToggleInputClick($event: Event) {
		$event.stopImmediatePropagation();
		this.toggleTaskStatus();
	}

	public onDeleteButtonClick() {
		if (!this.user?.isAdmin && !this.is_own) return;
		this.utils.confirm
			.present('Are you sure you want to delete this task?')
			.subscribe(async (confirm) => {
				if (!confirm) return false;
				this.deleteTask();
			});
	}

	private async deleteTask() {
		const loading = await this.utils.loading.present();
		try {
			const message = await this.tasks.deleteOne(this.data?.id);
			loading.dismiss();
			this.output.emit('deleted');
			this.utils.toast.present(message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}

	private async toggleTaskStatus() {
		this.toggle.disabled = true;
		try {
			const status = !this.data?.completed;
			await this.tasks.setCompletedState(status, this.data?.id);
			this.toggle.disabled = false;
		} catch (message) {
			this.toggle.disabled = false;
			this.utils.toast.present(message);
		}
	}

	private presentTaskFormModal() {
		const data = this.data;
		this.utils.modal.present(TaskFormModalComponent, { data });
	}

	private subscribeDataToChanges() {
		this.tasks.getOne(this.data.id).subscribe((res: Task) => {
			if (!res) this.output.emit('no-exist');
			this.data = res;
			this.users.getOne(res?.member_id).subscribe((member: Member) => {
				this.member = member;
			});
			if (!res?.customer_id) return (this.customer = null);
			this.customers
				.getOne(res?.customer_id)
				.subscribe((customer: Customer) => {
					this.customer = customer;
				});
			if (!res?.device_id) return (this.device = null);
			this.devices.getOne(res?.device_id).subscribe((device: Device) => {
				this.device = device;
			});
		});
	}
}
