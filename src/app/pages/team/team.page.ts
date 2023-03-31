import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/interfaces/user';
import { UserService } from 'src/app/core/services/user.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
	selector: 'app-team',
	templateUrl: './team.page.html',
	styleUrls: ['./team.page.scss'],
})
export class TeamPage {
	constructor(
		public user: UserService,
		public users: UsersService,
		private router: Router
	) {}

	public get name(): string {
		const name = this.user?.profile?.name;
		if (!name) return '';
		if (typeof name !== 'string') return '';
		const value = name.split(' ')[0];
		return value;
	}

	public onMembersListOutput(member: User) {
		this.router.navigate(['/team', member.id]);
	}
}
