import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { InvitedUser } from '../../types/user';


@Component({
  selector: 'app-admin-dashboard',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  inviteUserForm!: FormGroup;
  editEmailForm!: FormGroup;
  invitedUsers: InvitedUser[] = [];
  isEditModalOpen: boolean = false;
  selectedUser: any | null = null;
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);

  ngOnInit(): void {
    this.InitializeAdminInvationUser();
    this.InitializeEditEmailForm();
    this.loadInvitedUsers();
  }

  InitializeAdminInvationUser() {
    this.inviteUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  InitializeEditEmailForm() {
    this.editEmailForm = this.fb.group({
      _id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''] // Optional for updates
    });
  }

  loadInvitedUsers() {
    this.adminService.getInvitedUsers().subscribe({
      next: (users) => {
        this.invitedUsers = users;
      },
      error: (error) => {
        console.error('Error loading invited users:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to load invited users. Please try again.',
          showConfirmButton: true,
        });
      }
    });
  }

  onSubmit() {
    if (this.inviteUserForm.valid) {
      const userData = this.inviteUserForm.value;
      this.adminService.inviteUser(userData).pipe(
        catchError((error) => {
          console.error('Error during user invitation:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'User invitation failed. Please try again.',
            showConfirmButton: true,
          });
          return throwError(() => new Error('Invitation failed.'));
        })
      ).subscribe((response) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: response.message,
          toast: true,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        this.inviteUserForm.reset();
        this.loadInvitedUsers(); 
      });
    }
  }


  updateUser(user: InvitedUser) {
    this.selectedUser = user;
    this.editEmailForm.patchValue({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '' // Empty password field for new input
    });
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.selectedUser = null;
    this.editEmailForm.reset();
  }

  onSubmitEditEmail() {
    if (this.editEmailForm.valid && this.selectedUser) {
      const userId = this.selectedUser._id;
      const userData = {
        firstName: this.editEmailForm.get('firstName')?.value,
        lastName: this.editEmailForm.get('lastName')?.value,
        email: this.editEmailForm.get('email')?.value
      };

      
      // Only include password if it's provided
      const password = this.editEmailForm.get('password')?.value;
      if (password) {
        Object.assign(userData, { password });
      }
      console.log("userdataforedit",userData);
      
      this.adminService.updateUser(userId, userData).subscribe({
        next: (response) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'User updated successfully',
            toast: true,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
          this.loadInvitedUsers();
          this.closeEditModal();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to update user. Please try again.',
            showConfirmButton: true,
          });
        }
      });
    }
  }

  deleteUser(userId: string) {
    // Implement delete logic
    this.adminService.deleteInvitedUser(userId).subscribe({
      next: (response) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'User deleted successfully',
          toast: true,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        this.loadInvitedUsers();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete user. Please try again.',
          showConfirmButton: true,
        });
      }
    });
  }
}