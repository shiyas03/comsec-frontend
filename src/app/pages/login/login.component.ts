  import { CommonModule } from '@angular/common';
  import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
  import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { ButtonModule } from 'primeng/button';
  import { InputTextModule } from 'primeng/inputtext';
  import { AuthService } from '../../core/services/auth.service';
  import { errorMessages } from '../../constant';
  import { Router, RouterLink } from '@angular/router';
  import Swal from 'sweetalert2';

  @Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
  })
  export class LoginComponent implements OnInit, OnDestroy {
    loginForm!: FormGroup;
    private fb = inject(FormBuilder);
    private cdRef = inject(ChangeDetectorRef);
    private authService = inject(AuthService);
    private router = inject(Router);

    emailError: string = '';
    passwordError: string = '';
    show2FA: boolean = false;
    showResend: boolean = false;
    timer: number = 0;
    interval: any;
    isLoading: boolean = false;
    loginEmail: string = '';

    ngOnInit() {
      this.initForm();
    }

    ngOnDestroy() {
      if (this.interval) {
        clearInterval(this.interval);
      }
    }

    private initForm() {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        otp: [{ value: '', disabled: true }]
      });
    }

    onSubmit() {
      if (this.show2FA) {
        this.verifyOTP();
      } else {
        this.initiateLogin();
      }
    }

    private initiateLogin() {
      if (this.loginForm.get('email')?.invalid || this.loginForm.get('password')?.invalid) {
        this.showValidationToast();
        return;
      }

      this.isLoading = true;
      this.loginEmail = this.loginForm.get('email')?.value;

      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.requiresOtp) {
            this.handle2FARequired();
          } else {
            this.handleLoginSuccess(res);
          }
        },
        error: (err) => this.handleLoginError(err),
        complete: () => this.isLoading = false
      });
    }

    private verifyOTP() {
      if (this.loginForm.get('otp')?.invalid) {
        this.showToast('warning', 'Invalid OTP', 'Please enter a valid OTP');
        return;
      }

      this.isLoading = true;
      const otpData = {
        email: this.loginEmail,
        twoFactorCode: this.loginForm.get('otp')?.value
      };

      this.authService.verifyOtp(otpData).subscribe({
        next: (res) => this.handleOTPSuccess(res),
        error: (err) => this.handleOTPError(err),
        complete: () => this.isLoading = false
      });
    }

    private handle2FARequired() {
      this.show2FA = true;
      this.loginForm.get('otp')?.enable();
      this.startTimer();
      this.showToast('info', 'OTP Sent', 'Please check your email for the verification code');
      this.cdRef.detectChanges();
    }

    private handleLoginSuccess(res: any) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', res.user.id);
      this.showToast('success', 'Login Successful', 'Welcome back!');
      this.router.navigate(['/user-dashboard']);
    }

    private handleOTPSuccess(res: any) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('userId', res.user.id);
      this.showToast('success', 'Verification Successful', 'Logging you in...');
      this.router.navigate(['/user-dashboard']);
    }

    private showToast(icon: 'success' | 'error' | 'warning' | 'info', title: string, text: string) {
      Swal.fire({
        position: 'top-end',
        icon,
        title,
        text,
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
        // Add these properties to fix the clicking issue:
        allowOutsideClick: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        backdrop: false // This is the key fix - removes the invisible overlay
      });
    }
    
    // Also modify your error handling methods to ensure they don't block the UI:
    private handleLoginError(err: any) {
      console.error('Login error:', err);
      this.isLoading = false; // Make sure to reset loading state
      this.showToast('error', 'Login Failed', err.message || 'An error occurred');
      this.cdRef.detectChanges(); // Force update the view
    }
    
    private handleOTPError(err: any) {
      console.error('OTP verification error:', err);
      this.isLoading = false; // Make sure to reset loading state
      this.showToast('error', 'Verification Failed', err.message || 'Invalid OTP');
      this.cdRef.detectChanges(); // Force update the view
    }
    
    private showValidationToast() {
      this.isLoading = false; // Make sure loading state is reset
      this.showToast('warning', 'Invalid Form', 'Please fill out all required fields correctly');
      this.cdRef.detectChanges(); // Force update the view
    }
    startTimer() {
      this.showResend = false;
      this.timer = 60;
      
      if (this.interval) {
        clearInterval(this.interval);
      }

      this.interval = setInterval(() => {
        this.timer--;
        if (this.timer <= 0) {
          clearInterval(this.interval);
          this.showResend = true;
          this.cdRef.detectChanges();
        }
      }, 1000);
    }

    resendCode() {
      this.isLoading = true;
      this.authService.resendCode({ email: this.loginEmail }).subscribe({
        next: () => {
          this.showToast('success', 'Code Resent', 'A new OTP has been sent to your email');
          this.startTimer();
        },
        error: (err) => {
          this.showToast('error', 'Resend Failed', err.message || 'Unable to resend OTP');
        },
        complete: () => this.isLoading = false
      });
    }
  }
