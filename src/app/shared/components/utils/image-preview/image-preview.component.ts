import { Component, Inject, OnInit } from '@angular/core';
import {
	MatBottomSheet,
	MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';

@Component({
	selector: 'app-image-preview',
	templateUrl: './image-preview.component.html',
	styleUrls: ['./image-preview.component.scss'],
})
export class ImagePreviewComponent implements OnInit {
	constructor(
		@Inject(MAT_BOTTOM_SHEET_DATA) public data: { url: string },
		private bottomSheetController: MatBottomSheet
	) {}

	ngOnInit() {}

	public onCancelButtonClick() {
		this.closeActionSheet(null);
	}

	public onAcceptButtonClick() {
		this.closeActionSheet(true);
	}

	private closeActionSheet(data) {
		this.bottomSheetController.dismiss(data);
	}
}
