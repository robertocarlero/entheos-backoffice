import { AppService } from '../../services/app.service';
import { List } from '../../interfaces/list';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { Observable, Subject } from 'rxjs';

export abstract class DBList implements List {
	protected fauth = firebase.auth();
	protected db = firebase.firestore();
	protected app = new AppService();

	protected REF: firebase.firestore.Query<firebase.firestore.DocumentData>;
	protected LIMIT = this.app.PAGER_LIMIT;
	protected COLLECTION: string;
	protected QUERY: string;
	protected LAST: firebase.firestore.DocumentData;
	protected LOADING = false;
	protected CHANGE = new Subject<any[]>();

	protected INFINITE = true;

	protected ITEMS: Array<any> = [];

	constructor(public title: string) {
		setTimeout(() => {
			this.initialize();
			this.afterInit();
		}, 0);
	}

	public get onChange(): Observable<any[]> {
		return this.CHANGE.asObservable();
	}

	public get items(): Array<any> {
		return this.ITEMS;
	}

	public get size(): number {
		return this.items.length;
	}

	public get is_active(): boolean {
		return this.items.length > 0;
	}

	public get is_infinite(): boolean {
		return this.INFINITE;
	}

	public get is_loading(): boolean {
		return this.LOADING;
	}

	public next(): Promise<any> {
		return new Promise((resolve) => {
			if (!this.size) return resolve(null);
			if (!this.LAST) return resolve(null);
			this.LOADING = true;
			this.REF.startAfter(this.LAST).onSnapshot((res) => {
				this.LOADING = false;
				const cluster = Math.ceil(this.size / this.LIMIT);
				this.setData(res, cluster);
				resolve(null);
			});
		});
	}

	public search(query: string): Promise<any> {
		return new Promise((resolve) => {
			let value = `${query}`;
			value = value.toLowerCase();
			this.QUERY = value;
			this.firsts();
			return resolve(true);
		});
	}

	protected firsts() {
		this.LOADING = true;
		const ref = this.db
			.collection(this.COLLECTION)
			.orderBy('name')
			.limit(this.LIMIT);
		this.REF = !this.QUERY
			? ref
			: ref.where('search', 'array-contains', this.QUERY);
		this.getInitialData();
	}

	protected async getInitialData() {
		this.ITEMS = [];
		this.REF.onSnapshot((res) => {
			this.LOADING = false;
			this.setData(res);
		});
	}

	protected setData(
		data: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>,
		cluster: number = 0
	) {
		this.LAST = data.docs[data.size - 1];
		data.docChanges().forEach((change) => {
			const new_cluster =
				cluster * this.LIMIT > this.size ? cluster - 1 : cluster;
			const position = new_cluster * this.LIMIT + change.newIndex;
			this.setElement(change.doc, position, change.type === 'removed');
		});
	}

	protected setElement(
		doc: firebase.firestore.DocumentData,
		new_position: number,
		deleted: boolean
	) {
		const position = this.ITEMS.findIndex((item) => item.id === doc.id);
		if (position >= 0) this.ITEMS.splice(position, 1);

		const body = this.transformDoc(doc);
		if (!deleted) this.ITEMS.splice(new_position, 0, body);

		this.CHANGE.next(this.ITEMS);
	}

	protected transformDoc(doc: firebase.firestore.DocumentData): any {
		if (!doc.exists) return null;
		return {
			...doc.data(),
			id: doc.id,
		};
	}

	protected initialize() {}

	protected afterInit() {}
}
