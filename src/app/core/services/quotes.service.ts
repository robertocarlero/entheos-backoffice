import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Quote } from '../interfaces/quote';

@Injectable({
	providedIn: 'root',
})
export class QuotesService {
	private API_URL = 'https://frasedeldia.azurewebsites.net/api/phrase';

	constructor(private http: HttpClient) {}

	public getOne(): Promise<Quote> {
		return new Promise(async (resolve, reject) => {
			this.http.get(this.API_URL).subscribe((res: any) => {
				resolve(res);
			});
		});
	}
}
