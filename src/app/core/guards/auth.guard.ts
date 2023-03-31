import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanLoad,
	Route,
	Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivate {
	constructor(public authService: AuthService, private router: Router) {}

	public canLoad(
		route: Route
	): Observable<boolean> | Promise<boolean> | boolean {
		return this.checkLogin(route.path);
	}

	public canActivate(
		route: ActivatedRouteSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		return this.checkLogin(route.routeConfig.path);
	}

	public async checkLogin(path: string) {
		const state = await this.authService.state;
		if (path === 'auth') {
			if (!state) return true;
			this.router.navigate(['/home']);
			return false;
		}
		if (!!state) return true;
		this.router.navigate(['/auth']);
		return false;
	}
}
