import { DeviceMoneyDetailModalComponent } from './../../modals/device-money-detail-modal/device-money-detail-modal.component';
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Device } from 'src/app/core/interfaces/device';
import { Member } from 'src/app/core/interfaces/member';
import { UsersService } from 'src/app/core/services/users.service';
import { UserService } from 'src/app/core/services/user.service';
import { DevicesService } from 'src/app/core/services/devices.service';
import { Utils } from 'src/app/core/utils';
import { DeviceStatuses } from 'src/app/core/enums/device-statuses';
import { DeviceFormModalComponent } from '../../modals/device-form-modal/device-form-modal.component';
import { ActionSheetController, IonDatetime } from '@ionic/angular';
import { UsersListModalComponent } from '../../modals/users-list-modal/users-list-modal.component';

@Component({
	selector: 'app-device-detail',
	templateUrl: './device-detail.component.html',
	styleUrls: ['./device-detail.component.scss'],
})
export class DeviceDetailComponent implements OnChanges {
	@ViewChild('datepicker') public datepicker: IonDatetime;
	@ViewChild('datepicker_') public datepicker_: IonDatetime;

	@Input() public data: Device;

	public member: Member;
	public today = new Date();

	constructor(
		public user: UserService,
		private users: UsersService,
		private utils: Utils,
		private actionSheetController: ActionSheetController,
		private devices: DevicesService
	) {}

	ngOnChanges() {
		this.getData();
	}

	public onDetailItemClick() {
		if (!this.data.details) return;
		this.utils.alert.present(this.data.details, 'Details');
	}

	public onDescriptionItemClick() {
		if (!this.data.description) return;
		this.utils.alert.present(this.data.description, 'Description');
	}

	public onFinishedDateChange(event: any) {
		const { value } = event?.detail;
		if (!value) return;

		const old_time = this.data?.finished_date?.toDate().getTime();
		const new_time = new Date(value).getTime();
		if (old_time === new_time) return;

		const is_delivered = this.data?.status === DeviceStatuses.DELIVERED;
		const is_finished = this.data?.status === DeviceStatuses.FINISHED;

		const data = { finished_date: new Date(value) };
		if (is_delivered || is_finished) return this.changeData(data);

		this.changeStatus(DeviceStatuses.FINISHED);
	}

	public onEgressDateChange(event: any) {
		const { value } = event?.detail;
		if (!value) return;

		const old_time = this.data?.egress_date?.toDate().getTime();
		const new_time = new Date(value).getTime();
		if (old_time === new_time) return;

		const is_delivered = this.data?.status === DeviceStatuses.DELIVERED;
		const data = { egress_date: new Date(value) };
		if (is_delivered) return this.changeData(data);

		this.changeStatus(DeviceStatuses.DELIVERED);
	}

	public onEditButtonClick() {
		if (!this.user?.isEditor && !this.user?.isAdmin) return;
		this.presentDeviceFormModal();
	}

	public onMoneyButtonClick() {
		if (!this.user?.isEditor && !this.user?.isAdmin) return;
		this.presentMoneyDetailModal();
	}

	public onStatusItemClick() {
		this.openChangeStatusSheet();
	}

	public onWorkerItemClick() {
		this.openWorkerSelecterList();
	}

	private async openWorkerSelecterList() {
		const result: Member = await this.utils.modal.getResult(
			UsersListModalComponent,
			{ data: this.users?.active }
		);
		if (!result) return;
		this.utils.confirm
			.present(
				'Are you shure to change the worker asigened?',
				result?.name
			)
			.subscribe((confirm) => {
				if (!confirm) return;
				this.changeData({ member_id: result?.id });
			});
	}

	private async presentDeviceFormModal() {
		const props = {
			data: this.data,
			customer: this.data?.customer_id,
		};
		this.utils.modal.present(DeviceFormModalComponent, props);
	}

	private async presentMoneyDetailModal() {
		const props = { data: this.data };
		this.utils.modal.present(DeviceMoneyDetailModalComponent, props);
	}

	private async openChangeStatusSheet() {
		const buttons = Object.keys(DeviceStatuses).map((key) => {
			const value: string = DeviceStatuses[key];
			return {
				text: value?.toUpperCase(),
				handler: () => {
					this.changeStatus(DeviceStatuses[key]);
				},
			};
		});
		const actionSheet = await this.actionSheetController.create({
			header: 'Change status to: ',
			buttons: [
				...buttons,
				{
					text: 'Cancel',
					icon: 'close',
					role: 'cancel',
				},
			],
		});
		await actionSheet.present();
	}

	private async changeStatus(status: DeviceStatuses) {
		if (status === this.data?.status) return;

		const is_delivered = status === DeviceStatuses.DELIVERED;
		const is_finished = status === DeviceStatuses.FINISHED;

		const egress_date = is_delivered ? new Date() : null;

		const date = this.data?.finished_date?.toDate() || new Date();
		const finished_date = is_delivered || is_finished ? date : null;

		const data = { status, egress_date, finished_date };
		this.utils.confirm
			.present(
				`Are you sure to mark the device as ${status?.toUpperCase()}?`
			)
			.subscribe((confirm) => {
				if (confirm) return this.changeData(data);
				this.datepicker.value = this.data?.finished_date
					?.toDate()
					?.toISOString();
				this.datepicker_.value = this.data?.egress_date
					?.toDate()
					?.toISOString();
			});
	}

	private getData() {
		this.users.getOne(this.data?.member_id).subscribe((res: Member) => {
			this.member = res;
		});
	}

	private async changeData(data: any) {
		const loading = await this.utils.loading.present();
		try {
			const res = await this.devices.setOne(
				data,
				undefined,
				this.data?.id
			);
			this.utils.toast.present(res?.message);
			loading.dismiss();
		} catch (message) {
			this.utils.toast.present(message);
			loading.dismiss();
		}
	}
}
