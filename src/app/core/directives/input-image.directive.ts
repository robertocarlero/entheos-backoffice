import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ImagePreviewComponent } from 'src/app/shared/components/utils/image-preview/image-preview.component';

@Directive({
	selector: '[inputImage]',
})
export class InputImageDirective {
	@Output() outputImage = new EventEmitter<File>();

	constructor(private bottomSheetController: MatBottomSheet) {}

	@HostListener('click') onClick() {
		this.createButton();
	}

	private createButton(): void {
		const element = document.createElement('input');
		element.setAttribute('type', 'file');
		element.style.display = 'none';
		element.addEventListener('change', (event) => {
			this.onInput(event);
		});
		document.body.appendChild(element);
		element.click();
	}

	private onInput(event: any): void {
		const files = event.target.files;
		this.openPreviewImage(files[0]);
	}

	private openPreviewImage(image: any) {
		const url = URL.createObjectURL(image);
		const bottomSheet = this.bottomSheetController.open(
			ImagePreviewComponent,
			{
				data: { url },
			}
		);
		bottomSheet.afterDismissed().subscribe((result: boolean) => {
			if (!result) return false;
			this.outputImage.emit(image);
		});
	}
}
