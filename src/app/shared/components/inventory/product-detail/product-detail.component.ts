import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { IonToggle } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { Utils } from 'src/app/core/utils';
import { Product } from '../../../../core/interfaces/product';
import { ProductsService } from '../../../../core/services/products.service';
import { ProductFormModalComponent } from '../../modals/product-form-modal/product-form-modal.component';

@Component({
	selector: 'app-product-detail',
	templateUrl: './product-detail.component.html',
	styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
	@ViewChild('toggle') private toggle: IonToggle;

	@Input() public data: Product;

	@Output() private output = new EventEmitter();

	constructor(
		private utils: Utils,
		private products: ProductsService,
		public user: UserService
	) {}

	ngOnInit() {
		this.subscribeDataToChanges();
	}

	public onEditButtonClick() {
		if (!this.user?.isAdmin) return;
		this.presentProductFormModal();
	}

	public onDeleteButtonClick() {
		if (!this.user?.isAdmin) return;
		this.utils.confirm
			.present('Are you sure you want to delete this product?')
			.subscribe(async (confirm) => {
				if (!confirm) return false;
				this.deleteProduct();
			});
	}

	private async deleteProduct() {
		const loading = await this.utils.loading.present();
		try {
			const message = await this.products.deleteOne(this.data?.id);
			loading.dismiss();
			this.output.emit('deleted');
			this.utils.toast.present(message);
		} catch (message) {
			loading.dismiss();
			this.utils.toast.present(message);
		}
	}

	private presentProductFormModal() {
		const data = this.data;
		this.utils.modal.present(ProductFormModalComponent, { data });
	}

	private subscribeDataToChanges() {
		this.products.getOne(this.data.id).subscribe((res: Product) => {
			if (!res) this.output.emit('no-exist');
			this.data = res;
		});
	}
}
