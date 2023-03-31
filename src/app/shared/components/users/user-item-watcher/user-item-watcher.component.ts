import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { Customer } from 'src/app/core/interfaces/customer';
import { User } from 'src/app/core/interfaces/user';
import { CustomersService } from 'src/app/core/services/customers.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
	selector: 'app-user-item-watcher',
	templateUrl: './user-item-watcher.component.html',
	styleUrls: ['./user-item-watcher.component.scss'],
})
export class UserItemWatcherComponent implements OnInit, OnChanges {
	@Input() public line = false;
	@Input() public detail = false;
	@Input() public disabled = false;
	@Input() public button = true;

	@Input() public uid: User['id'];

	public data: User;

	constructor(
		private users: UsersService,
		private customers: CustomersService
	) {}

	ngOnInit() {
		this.getData();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes?.uid?.firstChange) return;
		const uid = changes?.uid?.currentValue;
		if (!uid) return;
		this.getData();
	}

	private getData() {
		this.users.getOne(this.uid).subscribe((res: User) => {
			this.data = res;
			if (!!res) return;
			this.customers.getOne(this.uid).subscribe((_res: Customer) => {
				this.data = _res;
			});
		});
	}
}
