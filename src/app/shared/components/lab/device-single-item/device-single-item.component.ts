import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Device } from 'src/app/core/interfaces/device';

@Component({
	selector: 'app-device-single-item',
	templateUrl: './device-single-item.component.html',
	styleUrls: ['./device-single-item.component.scss'],
})
export class DeviceSingleItemComponent {
	@Input() public line = false;
	@Input() public detail = false;
	@Input() public disabled = false;
	@Input() public button = true;
	@Input() public customIcon: string;

	@Input() public data: Device;

	@Output() private custom = new EventEmitter();

	constructor() {}

	public get image(): string {
		const image = this.data?.image;
		if (!image) return '';
		if (!image?.url_thumb) return image?.url || '';
		return image?.url_thumb;
	}

	public onCustomButtonClick($event: Event) {
		$event.stopImmediatePropagation();
		this.custom.emit();
	}
}
