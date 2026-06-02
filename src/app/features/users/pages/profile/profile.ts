import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Card } from '../../../../shared/ui/card/card';
import { MainInput } from '../../../../shared/ui/main-input/main-input';
import { TextareaInput } from '../../../../shared/ui/textarea-input/textarea-input';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';
import { GeneralModal } from '../../../../shared/ui/modal/general-modal/general-modal';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { Auth } from '../../../auth/services/auth.service';
import {
  GetMeResponse,
  UpdateGeneralUserDataRequest,
  UpdateGeneralUserDataResponse,
  UpdatePrivateUserDataRequest,
  UpdatePrivateUserDataResponse,
  UpdateExtraUserDataRequest,
  UpdateExtraUserDataResponse,
  UpdatePrivacyUserConfigurationRequest,
  UpdatePrivacyUserConfigurationResponse,
  DeactivateAccountResponse,
  DeleteAccountResponse,
} from '../../models/profile.model';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { ChangePasswordRequest } from '../../../auth/models/auth-requests.model';
import { ChangePasswordResponse } from '../../../auth/models/auth-responses.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [
    Card,
    MainInput,
    TextareaInput,
    PrimaryButton,
    SecondaryButton,
    GeneralModal,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private usersService = inject(UsersService);
  private authService = inject(Auth);
  private toast = inject(ToastService);
  private router = inject(Router);

  loading = true;
  showChangePasswordModal = false;

  generalEditing = false;
  extraEditing = false;
  privateEditing = false;
  privacyEditing = false;

  profileForm = new FormGroup({
    firstName: new FormControl({ value: '', disabled: true }),
    lastName: new FormControl({ value: '', disabled: true }),
    userName: new FormControl({ value: '', disabled: true }),
    email: new FormControl({ value: '', disabled: true }),
    code: new FormControl({ value: '', disabled: true }),
    bio: new FormControl({ value: '', disabled: true }),
    linkedInProfile: new FormControl({ value: '', disabled: true }),
    dateOfBirth: new FormControl({ value: '', disabled: true }),
    phoneNumber: new FormControl({ value: '', disabled: true }),
    isPublic: new FormControl({ value: true, disabled: true }),
    avatarUrl: new FormControl({ value: '', disabled: true }),
  });

  changePasswordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading = true;
    this.usersService.getMe().subscribe({
      next: (res: ApiResponse<GetMeResponse>) => {
        if (res.success && res.data) {
          this.profileForm.patchValue({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            userName: res.data.userName,
            email: res.data.email,
            code: res.data.code,
            bio: res.data.bio ?? '',
            linkedInProfile: res.data.linkedInProfile ?? '',
            dateOfBirth: this.toDateInputValue(res.data.dateOfBirth),
            phoneNumber: res.data.phoneNumber ?? '',
            isPublic: res.data.isPublic,
            avatarUrl: res.data.avatarUrl ?? '',
          });
        } else {
          this.toast.error(res.message || 'Error al cargar el perfil.');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.toast.error(err.error?.message || 'Error al cargar el perfil.');
        this.loading = false;
      },
    });
  }

  private toDateInputValue(date?: string): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  }

  private toApiDate(date: string): string {
    return date;
  }

  enableGeneralEdit(): void {
    this.generalEditing = true;
    this.setControls(['firstName', 'lastName', 'userName'], true);
  }

  disableGeneralEdit(): void {
    this.generalEditing = false;
    this.setControls(['firstName', 'lastName', 'userName'], false);
  }

  enableExtraEdit(): void {
    this.extraEditing = true;
    this.setControls(['bio', 'linkedInProfile'], true);
  }

  disableExtraEdit(): void {
    this.extraEditing = false;
    this.setControls(['bio', 'linkedInProfile'], false);
  }

  enablePrivateEdit(): void {
    this.privateEditing = true;
    this.setControls(['dateOfBirth', 'phoneNumber'], true);
  }

  disablePrivateEdit(): void {
    this.privateEditing = false;
    this.setControls(['dateOfBirth', 'phoneNumber'], false);
  }

  enablePrivacyEdit(): void {
    this.privacyEditing = true;
    this.setControls(['isPublic'], true);
  }

  disablePrivacyEdit(): void {
    this.privacyEditing = false;
    this.setControls(['isPublic'], false);
  }

  notifyInfo(msg: string): void {
    this.toast.info(msg);
  }

  private setControls(names: string[], enabled: boolean): void {
    names.forEach((name) => {
      const control = this.profileForm.get(name);
      if (enabled) {
        control?.enable();
      } else {
        control?.disable();
      }
    });
  }

  saveGeneral(): void {
    const data: UpdateGeneralUserDataRequest = {
      firstName: this.profileForm.value.firstName ?? undefined,
      lastName: this.profileForm.value.lastName ?? undefined,
      userName: this.profileForm.value.userName ?? undefined,
    };

    this.usersService.updateGeneralUserData(data).subscribe({
      next: (res: ApiResponse<UpdateGeneralUserDataResponse>) => {
        this.toast.success(res.message || 'Datos generales actualizados correctamente');
        if (res.data) {
          this.profileForm.patchValue({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            userName: res.data.userName,
          });
        }
        this.disableGeneralEdit();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al actualizar datos generales');
      },
    });
  }

  saveExtra(): void {
    const data: UpdateExtraUserDataRequest = {
      bio: this.profileForm.value.bio ?? undefined,
      linkedInUrl: this.profileForm.value.linkedInProfile ?? undefined,
    };

    this.usersService.updateExtraUserData(data).subscribe({
      next: (res: ApiResponse<UpdateExtraUserDataResponse>) => {
        this.toast.success(res.message || 'Datos extra actualizados correctamente');
        if (res.data) {
          this.profileForm.patchValue({
            bio: res.data.bio ?? '',
            linkedInProfile: res.data.linkedInProfile ?? '',
          });
        }
        this.disableExtraEdit();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al actualizar datos extra');
      },
    });
  }

  savePrivate(): void {
    const data: UpdatePrivateUserDataRequest = {
      dateOfBirth: this.profileForm.value.dateOfBirth ? this.toApiDate(this.profileForm.value.dateOfBirth) : undefined,
      phoneNumber: this.profileForm.value.phoneNumber ?? undefined,
    };

    this.usersService.updatePrivateUserData(data).subscribe({
      next: (res: ApiResponse<UpdatePrivateUserDataResponse>) => {
        this.toast.success(res.message || 'Datos privados actualizados correctamente');
        if (res.data) {
          this.profileForm.patchValue({
            dateOfBirth: this.toDateInputValue(res.data.dateOfBirth),
            phoneNumber: res.data.phoneNumber ?? '',
          });
        }
        this.disablePrivateEdit();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al actualizar datos privados');
      },
    });
  }

  savePrivacy(): void {
    const data: UpdatePrivacyUserConfigurationRequest = {
      isPublic: this.profileForm.value.isPublic ?? undefined,
    };

    this.usersService.updatePrivacyUserConfiguration(data).subscribe({
      next: (res: ApiResponse<UpdatePrivacyUserConfigurationResponse>) => {
        this.toast.success(res.message || 'Configuración de privacidad actualizada correctamente');
        if (res.data) {
          this.profileForm.patchValue({ isPublic: res.data.isPublic });
        }
        this.disablePrivacyEdit();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al actualizar configuración de privacidad');
      },
    });
  }

  showConfirmDeactivateModal = false;
  showConfirmDeleteModal = false;

  confirmDeactivate(): void {
    this.showConfirmDeactivateModal = true;
  }

  confirmDelete(): void {
    this.showConfirmDeleteModal = true;
  }

  cancelAccountAction(): void {
    this.showConfirmDeactivateModal = false;
    this.showConfirmDeleteModal = false;
  }

  deactivateAccount(): void {
    this.showConfirmDeactivateModal = false;
    this.usersService.deactivateAccount().subscribe({
      next: (res: ApiResponse<DeactivateAccountResponse>) => {
        this.toast.success(res.data?.message || 'Cuenta desactivada correctamente');
        this.authService.logout().subscribe();
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al desactivar la cuenta');
      },
    });
  }

  deleteAccount(): void {
    this.showConfirmDeleteModal = false;
    this.usersService.deleteAccount().subscribe({
      next: (res: ApiResponse<DeleteAccountResponse>) => {
        this.toast.success(res.data?.message || 'Cuenta eliminada correctamente');
        this.authService.logout().subscribe();
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al eliminar la cuenta');
      },
    });
  }

  get currentPasswordControl() { return this.changePasswordForm.get('currentPassword') as FormControl; }
  get newPasswordControl() { return this.changePasswordForm.get('newPassword') as FormControl; }
  get confirmPasswordControl() { return this.changePasswordForm.get('confirmPassword') as FormControl; }

  openChangePasswordModal(): void {
    this.showChangePasswordModal = true;
    this.changePasswordForm.reset();
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal = false;
    this.changePasswordForm.reset();
  }

  onChangePassword(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.changePasswordForm.value;

    if (newPassword !== confirmPassword) {
      this.toast.error('Las contraseñas nuevas no coinciden.');
      return;
    }

    const data: ChangePasswordRequest = {
      currentPassword: currentPassword!,
      newPassword: newPassword!,
    };

    this.usersService.changePassword(data).subscribe({
      next: (res: ApiResponse<ChangePasswordResponse>) => {
        this.toast.success(res.message || 'Contraseña cambiada exitosamente.');
        this.closeChangePasswordModal();
        this.authService.logout().subscribe();
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || err.error?.Message || 'Error al cambiar la contraseña.';
        this.toast.error(errorMessage);
      },
    });
  }
}
