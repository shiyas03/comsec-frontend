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
    });
  }
  generateSecurePassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';  // Excluding I and O to avoid confusion
    const lowercase = 'abcdefghijkmnpqrstuvwxyz';  // Excluding l and o to avoid confusion
    const numbers = '23456789';  // Excluding 0 and 1 to avoid confusion
    
    const allChars = uppercase + lowercase + numbers;
    let password = '';
    
    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    
    // Fill the rest of the password
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  InitializeEditEmailForm() {
    this.editEmailForm = this.fb.group({
      _id: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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
      const userData = {
        ...this.inviteUserForm.value,
        password: this.generateSecurePassword(12) // Add generated password to form data
      };

      console.log("gg password",userData);
      
  
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
        email: this.editEmailForm.get('email')?.value,
        password: this.generateSecurePassword(8) // Generate 8-character password
      };
  
      console.log("userdataforedit", userData);
      
      this.adminService.updateUser(userId, userData).subscribe({
        next: (response) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'User updated successfully',
            text: 'A new password has been generated',
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