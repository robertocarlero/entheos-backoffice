import { Observable } from 'rxjs';

export interface List {
	title: string;
	is_active: boolean;
	is_infinite: boolean;
	items: Array<any>;
	next(): Promise<any>;
	search(query: string): Promise<any>;
}
