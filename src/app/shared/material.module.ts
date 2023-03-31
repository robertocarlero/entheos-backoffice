import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
	declarations: [],
	imports: [],
	exports: [
		CommonModule,
		MatInputModule,
		MatFormFieldModule,
		MatIconModule,
		MatRippleModule,
		MatSelectModule,
		MatBottomSheetModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatExpansionModule,
		MatDividerModule,
		MatChipsModule,
		MatAutocompleteModule,
	],
})
export class MaterialModule {}
