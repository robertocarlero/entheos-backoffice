import { MessagingService } from './messaging.service';
import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import firebase from 'firebase/app';
import { Observable, Subject } from 'rxjs';
import { DBCrud } from 'src/app/core/classes/db-crud';
import { Router } from '@angular/router';
import {
	LoadingController,
	ModalController,
	PopoverController,
	ToastController,
} from '@ionic/angular';

@Injectable({
	providedIn: 'root',
})
export class AuthService extends DBCrud {
	protected PATH = this.app.PATH_USERS;
	private USER: firebase.User;
	private result: firebase.auth.ConfirmationResult;

	constructor(
		private app: AppService,
		private router: Router,
		private modals: ModalController,
		private popovers: PopoverController,
		private loadings: LoadingController,
		private toasts: ToastController,
		private messagin: MessagingService
	) {
		super();
	}

	public get user$(): Observable<firebase.User> {
		const response = new Subject<firebase.User>();
		this.fauth.onAuthStateChanged((user) => {
			response.next(user);
		});
		return response.asObservable();
	}

	public get authenticated(): boolean {
		return this.USER !== null; // True or False
	}

	public get currentUser(): firebase.User {
		return this.USER;
	}

	public get state(): Promise<firebase.User> {
		return new Promise((resolve, reject) => {
			this.fauth.onAuthStateChanged(
				(state) => {
					resolve(state);
				},
				(error) => {
					reject(error);
				}
			);
		});
	}

	public signInWithEmail(email: string, password: string): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				const { user } = await this.fauth.signInWithEmailAndPassword(
					email,
					password
				);
				await this.validateAsAdmin(user.uid);
				resolve('Successful login.');
			} catch (error) {
				this.signOut();
				console.log(error);
				if (typeof error === 'string') return reject(error);
				reject(error.message);
			}
		});
	}

	public signInWithFacebook(): Promise<string> {
		const provider = new firebase.auth.FacebookAuthProvider();
		return this.signInWithPopup(provider);
	}

	public signInWithGoogle(): Promise<string> {
		const provider = new firebase.auth.GoogleAuthProvider();
		return this.signInWithPopup(provider);
	}

	public signOut(): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.messagin.deleteToken();
				await this.fauth.signOut();
				this.modals.dismiss();
				this.loadings.dismiss();
				this.toasts.dismiss();
				this.popovers.dismiss();
				this.router.navigate(['/auth']);
				resolve('The session was closed successfully.');
			} catch (error) {
				reject('There was an error logging out.');
			}
		});
	}

	public updatePassword(password: string): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				const user = await this.getCurrentUser();
				await user.updatePassword(password);
				resolve('The password has been changed successfully.');
			} catch (error) {
				console.log(error);
				if (typeof error === 'string') return reject(error);
				reject(error.message);
			}
		});
	}

	public recoverPassword(email: string): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.fauth.sendPasswordResetEmail(email);
				resolve('Email to change password has been sent.');
			} catch (error) {
				console.log(error);
				if (typeof error === 'string') return reject(error);
				reject(error.message);
			}
		});
	}

	public sendEmailVerification(): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				const user = this.fauth.currentUser;
				await user.sendEmailVerification();
				resolve(
					`An email has been sent to ${user.email} to verify the email.`
				);
			} catch (error) {
				console.log(error);
				reject('There was an error trying to verify your email.');
			}
		});
	}

	public updateEmail(email: string): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				const user: any = await this.getCurrentUser();
				await user.updateEmail(email);
				await this.set({ email }, user.uid);
				resolve('The email address has been changed successfully.');
			} catch (error) {
				console.log(error);
				if (typeof error === 'string') return reject(error);
				reject(error.message);
			}
		});
	}

	public sendPhoneVerification(phoneNumber: string): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const appVerifier = new firebase.auth.RecaptchaVerifier(
				'recaptcha-container',
				{
					size: 'invisible',
				}
			);
			try {
				const user = this.fauth.currentUser;
				this.result = await user.linkWithPhoneNumber(
					phoneNumber,
					appVerifier
				);
				await this.set({ phoneNumber }, user.uid);
				appVerifier.clear();
				resolve('The verification code has been sent successfully.');
			} catch (error) {
				console.log(error);
				appVerifier.clear();
				if (typeof error === 'string') return reject(error);
				reject(error.message);
			}
		});
	}

	public comfirmPhoneNumber(code: string): Promise<string> {
		return new Promise(async (resolve, reject) => {
			try {
				await this.result.confirm(code);
				resolve('The phone number was successfully verified.');
			} catch (error) {
				console.log(error);
				if (typeof error === 'string') return reject(error);
				reject(error.message);
			}
		});
	}

	public reload() {
		const user = this.fauth.currentUser;
		user.reload();
	}

	protected initialize() {
		this.subscribeUser();
	}

	private signInWithPopup(
		provider: firebase.auth.AuthProvider
	): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				const { user } = await this.fauth.signInWithPopup(provider);
				await this.validateAsAdmin(user.uid);
				resolve('Successful login.');
			} catch (error) {
				this.signOut();
				console.log(error);
				if (typeof error === 'string') return reject(error);
				reject(error.message);
			}
		});
	}

	private subscribeUser() {
		this.fauth.onAuthStateChanged(async (user) => {
			if (user) this.messagin.setToken();
			this.USER = user;
			if (!user) return this.signOut();
			this.db.doc(`${this.PATH}/${user?.uid}`).onSnapshot((res) => {
				if (!res?.data()?.active) this.signOut();
			});
		});
	}

	private validateAsAdmin(uid: string): Promise<any> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!uid) throw null;
				const res = await this.db.doc(`${this.PATH}/${uid}`).get();
				if (!res?.exists)
					throw 'You are not an authorized administrator.';
				if (!res.data()?.active)
					throw 'You are not an active administrator.';
				resolve('You are an authorized administrator.');
			} catch (error) {
				console.log(error);
				if (typeof error === 'string') return reject(error);
				reject('We could not validate that you are an active member.');
			}
		});
	}
}
