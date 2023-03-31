import { AlertUtil } from './alert-util';
import { ConfirmUtil } from './confirm-util';
import { GenerateId } from './generate-id';
import { LoadingUtil } from './loading-util';
import { ObjectUtil } from './object-util';
import { ToastUtil } from './toast-util';
import { ModalUtil } from './modal-util';
import { StorageUtil } from './storage-util';

export class Utils {
	public alert = new AlertUtil();
	public confirm = new ConfirmUtil();
	public loading = new LoadingUtil();
	public modal = new ModalUtil();
	public object = new ObjectUtil();
	public storage = new StorageUtil();
	public toast = new ToastUtil();

	public generateId = GenerateId;
}
