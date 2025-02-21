import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { catchError, Observable, throwError } from 'rxjs';
import { InvitedUser } from '../../types/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }

    private http = inject(HttpClient);
    private baseUrl: string = environment.baseURL;

    inviteUser(data: any): Observable<any> {
      return this.http.post(`${this.baseUrl}user/inviteUser`, data).pipe(
        catchError((error) => {
          console.error('Error during user invitation:', error);
          return throwError(() => new Error('User invitation failed. Please try again.'));
        })
      );
    }

    forgotPassword(email: string): Observable<any> {
      return this.http.post(`${this.baseUrl}user/forgot-password`, { email }).pipe(
        catchError((error) => {
          console.error('Error in forgot password:', error);
          return throwError(() => new Error('Failed to process password reset'));
        })
      );
    }
    

    getInvitedUsers(): Observable<any> {
      return this.http.get(`${this.baseUrl}user/getInvitedUsers`).pipe(
        catchError((error) => {
          console.error('Error fetching invited users:', error);
          return throwError(() => new Error('Failed to fetch invited users. Please try again.'));
        })
      );
    }

    deleteInvitedUser(userId: string): Observable<any> {
      return this.http.delete(`${this.baseUrl}user/deleteInvitedUser/${userId}`).pipe(
        catchError((error) => {
          console.error('Error deleting invited user:', error);
          return throwError(() => new Error('Failed to delete user. Please try again.'));
        })
      );
    }

    updateUser(userId: string, userData: Partial<InvitedUser>): Observable<any> {
      return this.http.patch(`${this.baseUrl}user/update/${userId}`, userData).pipe(
        catchError((error) => {
          console.error('Error updating user:', error);
          return throwError(() => new Error('Failed to update user. Please try again.'));
        })
      );
    }


}
