import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-small-button',
	templateUrl: './small-button.component.html',
	styleUrls: ['./small-button.component.scss'],
})
export class SmallButtonComponent implements OnInit {
	@Input() public size = 'big';
	@Input() public color = 'primary';
	@Input() public icon = '';
	@Input() public srcIcon = '';
	@Input() public elevation = 2;
	@Input() public disabled = false;

	constructor() {}

	ngOnInit() {}
}
