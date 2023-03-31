import { Component } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { SalesService } from '../../core/services/sales.service';
import { ModalUtil } from '../../core/utils/modal-util';
import { SaleDetailModalComponent } from '../../shared/components/modals/sale-detail-modal/sale-detail-modal.component';
import { Sale } from '../../core/interfaces/sale';

@Component({
	selector: 'app-sales',
	templateUrl: './sales.page.html',
	styleUrls: ['./sales.page.scss'],
})
export class SalesPage {
	constructor(
		public user: UserService,
		public sales: SalesService,
		private modals: ModalUtil
	) {}

	public get name(): string {
		const name = this.user?.profile?.name;
		if (!name) return '';
		if (typeof name !== 'string') return '';
		const value = name.split(' ')[0];
		return value;
	}

	public onSalesListOutput(data: Sale): void {
		this.openSaleDetailModal(data);
	}

	private openSaleDetailModal(data: Sale) {
		this.modals.present(SaleDetailModalComponent, { data });
	}
}
