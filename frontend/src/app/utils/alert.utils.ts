import Swal, { SweetAlertIcon } from 'sweetalert2';

const luxurySwal = Swal.mixin({
  background: '#121215',
  color: '#e5e5e7',
  confirmButtonColor: '#d4af37',
  cancelButtonColor: '#2a2a30',
  customClass: {
    popup: 'jhulki-swal-popup',
    title: 'jhulki-swal-title',
    htmlContainer: 'jhulki-swal-html',
    confirmButton: 'jhulki-swal-confirm-btn',
    cancelButton: 'jhulki-swal-cancel-btn',
    denyButton: 'jhulki-swal-deny-btn'
  },
  buttonsStyling: false
});

export class Alert {
  static success(title: string, text?: string) {
    return luxurySwal.fire({
      icon: 'success',
      title: title,
      text: text,
      iconColor: '#d4af37',
      confirmButtonText: 'CONTINUE'
    });
  }

  static error(title: string, text?: string) {
    return luxurySwal.fire({
      icon: 'error',
      title: title,
      text: text,
      iconColor: '#e63946',
      confirmButtonText: 'OK'
    });
  }

  static info(title: string, text?: string) {
    return luxurySwal.fire({
      icon: 'info',
      title: title,
      text: text,
      iconColor: '#d4af37',
      confirmButtonText: 'GOT IT'
    });
  }

  static warning(title: string, text?: string) {
    return luxurySwal.fire({
      icon: 'warning',
      title: title,
      text: text,
      iconColor: '#ffb703',
      confirmButtonText: 'UNDERSTOOD'
    });
  }

  static confirm(title: string, text?: string, confirmText: string = 'YES, CONFIRM'): Promise<boolean> {
    return luxurySwal.fire({
      icon: 'warning',
      title: title,
      text: text,
      iconColor: '#d4af37',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'CANCEL'
    }).then(result => result.isConfirmed);
  }

  static prompt(title: string, inputPlaceholder: string = 'Type address type...'): Promise<string | null> {
    return luxurySwal.fire({
      title: title,
      input: 'text',
      inputPlaceholder: inputPlaceholder,
      showCancelButton: true,
      confirmButtonText: 'SAVE TYPE',
      cancelButtonText: 'CANCEL',
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return 'Please enter a valid address type';
        }
        return null;
      }
    }).then(result => {
      if (result.isConfirmed && result.value) {
        return result.value.trim();
      }
      return null;
    });
  }
}
