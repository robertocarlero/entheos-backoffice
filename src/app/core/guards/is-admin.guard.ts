import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
	providedIn: 'root',
})
export class IsAdminGuard implements CanLoad, CanActivate {
	constructor(public user: UserService, private router: Router) {}

	public canLoad(): Observable<boolean> | Promise<boolean> | boolean {
		return this.checkRole();
	}

	public canActivate(): Observable<boolean> | Promise<boolean> | boolean {
		return this.checkRole();
	}

	public async checkRole() {
		return new Promise<boolean>((resolve) => {
			const validate = () => {
				if (this.user?.isAdmin) return resolve(true);
				this.router.navigate(['/home']);
				return resolve(false);
			};

			this.user.profile$.subscribe(() => {
				validate();
			});
		});
	}
}
