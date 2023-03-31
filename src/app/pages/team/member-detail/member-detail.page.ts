import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { UsersService } from 'src/app/core/services/users.service';

import { Member } from 'src/app/core/interfaces/member';
import { List } from 'src/app/core/interfaces/list';
import { DevicesListFilters } from 'src/app/core/interfaces/devices-list-filters';
import { Device } from 'src/app/core/interfaces/device';

class CustomDevicesList {
	constructor(public name: string, public list: List) {}
}

@Component({
	selector: 'app-member-detail',
	templateUrl: './member-detail.page.html',
	styleUrls: ['./member-detail.page.scss'],
})
export class MemberDetailPage implements OnInit {
	public devices_lists: CustomDevicesList[] = [];
	public data: Member;
	public filters: DevicesListFilters;

	constructor(
		private route: ActivatedRoute,
		private users: UsersService,
		private router: Router
	) {}

	ngOnInit() {
		this.initialize();
	}

	public onFilterFormOutput(filters: DevicesListFilters) {
		const { member_id } = this.route.snapshot.params;

		this.filters = {
			...filters,
			member_id,
		};
	}

	public onDevicesListOutput(device: Device) {
		this.router.navigate(['/lab', device.id]);
	}

	private initialize() {
		const { member_id } = this.route.snapshot.params;
		this.filters = {
			...this.filters,
			member_id,
		};
		this.subscribeToDataChange(member_id);
	}

	private subscribeToDataChange(member_id: Member['id']) {
		this.users.getOne(member_id).subscribe((res: Member) => {
			this.data = res;
		});
	}
}
