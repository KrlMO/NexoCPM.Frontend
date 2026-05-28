import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Card } from '../../../../shared/ui/card/card';
import { MainInput } from '../../../../shared/ui/main-input/main-input';
import { TextareaInput } from '../../../../shared/ui/textarea-input/textarea-input';
import { PrimaryButton } from '../../../../shared/ui/button/primary-button/primary-button';
import { SecondaryButton } from '../../../../shared/ui/button/secondary-button/secondary-button';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../../../shared/ui/toast/toast.service';
import { GetMeResponse } from '../../models/profile.model';
import { ApiResponse } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-profile',
  imports: [
    Card,
    MainInput,
    TextareaInput,
    PrimaryButton,
    SecondaryButton,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private usersService = inject(UsersService);
  private toast = inject(ToastService);

  loading = true;

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
    this.toast.info('Guardando datos generales...');
    this.disableGeneralEdit();
  }

  saveExtra(): void {
    this.toast.info('Guardando datos extra...');
    this.disableExtraEdit();
  }

  savePrivate(): void {
    this.toast.info('Guardando datos privados...');
    this.disablePrivateEdit();
  }

  savePrivacy(): void {
    this.toast.info('Guardando configuración de privacidad...');
    this.disablePrivacyEdit();
  }
}
