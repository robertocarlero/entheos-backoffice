import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/core/interfaces/customer';
import { CustomersService } from 'src/app/core/services/customers.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
	selector: 'app-customers',
	templateUrl: './customers.page.html',
	styleUrls: ['./customers.page.scss'],
})
export class CustomersPage {
	constructor(
		public user: UserService,
		public customers: CustomersService,
		private router: Router
	) {}

	public get name(): string {
		const name = this.user?.profile?.name;
		if (!name) return '';
		if (typeof name !== 'string') return '';
		const value = name.split(' ')[0];
		return value;
	}

	public onCustomersListOutput(customer: Customer) {
		this.router.navigate(['/customers', customer.id]);
	}
}
