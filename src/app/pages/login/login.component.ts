import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  private fb = inject(FormBuilder);
  private cdrf = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage: string = '';
  emailError: string = '';
  passwordError: string = '';
  show2FA: boolean = false;
  loginEmail: string = '';
  showResend: boolean = false;
  timer: number = 0;
  interval: any;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      otp: new FormControl({ value: '', disabled: true }, [Validators.required]),
    });
  }

  onlogin() {
    if (this.show2FA) {
      this.verify2FA();
      return;
    }

    if (this.loginForm.valid) {
      this.resetErrors();
      this.loginEmail = this.loginForm.value.email;

      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('login response:', res);
          if (res.requiresOtp) {
            this.show2FA = true;
            this.loginForm.get('otp')?.enable();
            this.cdrf.detectChanges();
            this.startTimer();
          } else {
            localStorage.setItem('token', res.token);
            localStorage.setItem('userId', res.user.id);
              Swal.fire({
                position: "top-end",
                icon: 'success',
                title: 'Login Successful',
                text: 'Welcome back!',
                toast: true,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              });
            this.router.navigate(['/user-dashboard']);
          }
        },
        error: (err) => {
          console.error('Error response:', err);
          console.log('Full error object:', JSON.stringify(err, null, 2));

          Swal.fire({
            position: "top-end",
            icon: 'error',
            title: 'Login Failed',
            text: err.message || 'An error occurred. Please try again.',
            toast: true,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        }

      });
    } else {
      this.loginForm.markAllAsTouched();
      Swal.fire({
        position: "top-end",
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill out all required fields correctly.',
        toast: true,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  }



  verify2FA() {
    const otpValue = this.loginForm.value.otp;
    const emailValue = this.loginEmail;

    if (this.loginForm.get('otp')?.valid) {
      this.authService.verifyOtp({ email: emailValue, twoFactorCode: otpValue }).subscribe({
        next: (res) => {
          console.log('OTP verification successful:', res);
          // Set necessary auth data
          localStorage.setItem('token', res.token);  // Add this
          localStorage.setItem('userId', res.user.id);  // Add this
          
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Verification Successful',
            text: 'Your OTP has been verified successfully!',
            toast: true,
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.router.navigate(['/user-dashboard'])
              .then(() => console.log('Navigation successful'))
              .catch(err => console.error('Navigation error:', err));
          });
        },
        error: (err) => {
          console.error('OTP verification failed:', err);
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Verification Failed',
            text: err.error?.message || 'Please check your OTP and try again.',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        },
      });
    } else {
      this.loginForm.get('otp')?.markAsTouched();
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Invalid OTP',
        text: 'Please enter a valid OTP.',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  }


  resetErrors() {
    this.emailError = '';
    this.passwordError = '';
  }

  startTimer() {
    this.showResend = false;
    this.timer = 60;
    this.interval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.interval);
        this.showResend = true;
      }
    }, 1000);
  }

  resendCode() {
    this.authService.resendCode({ email: this.loginEmail }).subscribe({
      next: (res) => {
        console.log('OTP resent:', res);
        Swal.fire({
          icon: 'success',
          title: 'Code Resent',
          text: 'A new OTP has been sent to your email.',
        });
        this.startTimer();
      },
      error: (err) => {
        console.error('Resend failed:', err);
        Swal.fire({
          icon: 'error',
          title: 'Resend Failed',
          text: err.error.message || 'Unable to resend OTP. Please try again later.',
        });
      },
    });
  }
}

