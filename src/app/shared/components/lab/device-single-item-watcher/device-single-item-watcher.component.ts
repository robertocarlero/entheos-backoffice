import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { Device } from 'src/app/core/interfaces/device';
import { DevicesService } from 'src/app/core/services/devices.service';

@Component({
	selector: 'app-device-single-item-watcher',
	templateUrl: './device-single-item-watcher.component.html',
	styleUrls: ['./device-single-item-watcher.component.scss'],
})
export class DeviceSingleItemWatcherComponent implements OnInit, OnChanges {
	@Input() public line = false;
	@Input() public detail = false;
	@Input() public disabled = false;
	@Input() public button = true;
	@Input() public customIcon: string;

	@Input() public id: Device['id'];

	@Output() private custom = new EventEmitter();

	public data: Device;

	constructor(private devices: DevicesService) {}

	ngOnInit() {
		this.getData();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes?.id?.firstChange) return;
		const id = changes?.id?.currentValue;
		if (!id) return;
		this.getData();
	}

	public onCustomActionEmit() {
		this.custom.emit();
	}

	private getData() {
		this.devices.getOne(this.id).subscribe((res) => {
			this.data = res;
		});
	}
}
