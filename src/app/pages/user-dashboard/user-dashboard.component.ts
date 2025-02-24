import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent {
  activeTab: any = 'project';
  private router=inject(Router)
  private themeService = inject(ThemeService);
  private authService = inject(AuthService);
  isDarkTheme = false;
  ngOnInit(): void {
    console.log(this.activeTab);
    this.applyTheme();
    this.themeService.isDarkTheme$.subscribe(
      isDark => this.isDarkTheme = isDark
    );
  }

  onHandleTabChange(tabName: any) {
    this.activeTab = tabName;
    console.log(this.activeTab);
  }

  private applyTheme() {
    if (this.isDarkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }


  navigateToProjectForm() {
    this.router.navigate(['/project-form']); 
  }
}
