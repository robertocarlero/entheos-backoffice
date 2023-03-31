import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/core/services/products.service';
import { ModalUtil } from 'src/app/core/utils/modal-util';
import { UserService } from '../../core/services/user.service';
import { Product } from '../../core/interfaces/product';
import { ProductDetailModalComponent } from '../../shared/components/modals/product-detail-modal/product-detail-modal.component';

@Component({
	selector: 'app-inventory',
	templateUrl: './inventory.page.html',
	styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage {
	constructor(
		public user: UserService,
		public products: ProductsService,
		private modals: ModalUtil
	) {}

	public get name(): string {
		const name = this.user?.profile?.name;
		if (!name) return '';
		if (typeof name !== 'string') return '';
		const value = name.split(' ')[0];
		return value;
	}

	public onProductsListOutput(data: Product): void {
		this.openProductDetailModal(data);
	}

	private openProductDetailModal(data: Product) {
		this.modals.present(ProductDetailModalComponent, { data });
	}
}
