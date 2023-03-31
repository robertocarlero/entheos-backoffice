import { FormControl, FormGroup } from '@angular/forms';

export class FormValidators {
	static checkAreSame(control_name: string, second_control_name: string) {
		return (group: FormGroup) => {
			const control = group.get(control_name) as FormControl;
			const second_control = group.get(
				second_control_name
			) as FormControl;
			if (control.value !== second_control.value) {
				second_control.setErrors({ notSame: true });
			} else {
				second_control.setErrors(null);
			}
		};
	}
}
