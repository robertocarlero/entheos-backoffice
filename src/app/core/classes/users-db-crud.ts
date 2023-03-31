import { DBCrud } from './db-crud';

export abstract class UsersDBCrud extends DBCrud {
	public emailIsAlreadyInUse(email: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await this.db
					.collection(this.PATH)
					.where('email', '==', email)
					.limit(1)
					.get();
				resolve(!res.empty);
			} catch (error) {
				console.log(error);
				reject(
					'An error occurred when validating that the email is not in use.'
				);
			}
		});
	}

	public dniIsAlreadyInUse(dni: string): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				const res = await this.db
					.collection(this.PATH)
					.where('dni', '==', dni)
					.limit(1)
					.get();
				resolve(!res.empty);
			} catch (error) {
				console.log(error);
				reject(
					'An error occurred when validating that the DNI is not in use.'
				);
			}
		});
	}
}
