import { TransactionsListFilters } from './../../../core/interfaces/transactions-list-filters';
import { UserService } from 'src/app/core/services/user.service';
import { MyErrorStateMatcher } from 'src/app/core/classes/my-error-state-matcher';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { TransactionsTypes } from 'src/app/core/enums/transaction-types';

@Component({
	selector: 'app-filter-form',
	templateUrl: './filter-form.component.html',
	styleUrls: ['./filter-form.component.scss'],
})
export class FilterFormComponent implements OnInit {
	@Output() private output = new EventEmitter<TransactionsListFilters>();

	public form = new FormGroup({
		date_from: new FormControl(''),
		date_to: new FormControl(''),
		type: new FormControl(''),
	});

	public types = Object.values(TransactionsTypes);
	public matcher = new MyErrorStateMatcher();

	constructor(public user: UserService) {}

	ngOnInit() {
		this.initialize();
	}

	private initialize() {
		this.form.valueChanges.subscribe((value) => {
			this.output.emit(value);
		});
	}
}
