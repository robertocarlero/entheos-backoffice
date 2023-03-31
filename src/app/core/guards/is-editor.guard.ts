import { Injectable } from '@angular/core';
import { CanLoad, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
	providedIn: 'root',
})
export class IsEditorGuard implements CanLoad, CanActivate {
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
				if (this.user?.isEditor) return resolve(true);
				this.router.navigate(['/home']);
				return resolve(false);
			};

			this.user.profile$.subscribe(() => {
				validate();
			});
		});
	}
}
