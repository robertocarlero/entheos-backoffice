import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { QuotesService } from 'src/app/core/services/quotes.service';
import { UserService } from 'src/app/core/services/user.service';

import { DevicesList } from 'src/app/core/classes/lists/devices.list';

import { Device } from 'src/app/core/interfaces/device';
import { Quote } from 'src/app/core/interfaces/quote';

import { List } from 'src/app/core/interfaces/list';

import { DEVICES_LIST } from 'src/app/core/constants/lists-titles';
import { PENDING_DEVICES_STATUSES } from 'src/app/core/constants/devices-statuses-collections';

@Component({
	selector: 'app-home',
	templateUrl: './home.page.html',
	styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
	public devices: List;
	public quote: Quote = {
		author: 'Anónimo.',
		phrase: 'Nunca pares, nunca te conformes, hasta que lo bueno sea mejor y lo mejor excelente.',
	};

	constructor(
		public user: UserService,
		private router: Router,
		private quotes: QuotesService
	) {}

	ngOnInit() {
		// this.getQuotes();
		this.subscribeDataToChanges();
	}

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

	private async getQuotes() {
		this.quote = await this.quotes.getOne();
	}

	private subscribeDataToChanges() {
		this.user.profile$.subscribe((user) => {
			this.devices = user
				? new DevicesList(DEVICES_LIST.PENDING.title, {
						member_id: user?.id,
						statuses: PENDING_DEVICES_STATUSES,
				  })
				: null;
		});
	}
}
