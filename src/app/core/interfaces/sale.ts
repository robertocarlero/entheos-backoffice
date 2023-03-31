import { User } from './user';
import { Amount } from './amount';
import { DBDoc } from './db-doc';
import { ItemSelled } from './item-selled';
import { Customer } from './customer';
import { Image } from './image';

export interface Sale extends DBDoc {
	products: ItemSelled[];
	quantity: number;
	total: Amount;
	sale_id: number;
	customer_id: Customer['id'];
	image: Image;
	warranty: string;
	description: string;
	entry_balance: User['id'];
}
