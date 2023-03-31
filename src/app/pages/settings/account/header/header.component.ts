import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { Utils } from 'src/app/core/utils';

@Component({
	selector: 'app-account-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
	constructor(
		public user: UserService,
		public auth: AuthService,
		private utils: Utils
	) {}

	ngOnInit() {}

	public get banner(): string {
		const banner = this.user?.profile?.banner;
		if (!banner) return '';
		if (!banner?.url_thumb) return banner?.url || '';
		return banner?.url_thumb;
	}

	public get avatar(): string {
		const avatar = this.user?.profile?.avatar;
		if (!avatar) return '';
		if (!avatar?.url_thumb) return avatar?.url || '';
		return avatar?.url_thumb;
	}

	public onAvatarOutputImage(image: File) {
		this.confirmChangeImage(image, 'avatar');
	}

	public onBannerOutputImage(image: File) {
		this.confirmChangeImage(image, 'banner');
	}

	private confirmChangeImage(image: File, type: 'banner' | 'avatar') {
		this.utils.confirm
			.present(
				'Are you sure you want to change this image?',
				`Change ${type}`
			)
			.subscribe((result) => {
				if (!result) return;
				this.changeImage(image, type);
			});
	}

	private async changeImage(image: File, type: 'banner' | 'avatar') {
		const loading = await this.utils.loading.present();
		try {
			const message = await this.user.updateImage(image, type);
			loading.dismiss();
			this.utils.toast.present(message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}
}
