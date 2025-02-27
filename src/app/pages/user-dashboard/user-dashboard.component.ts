import { Component, inject } from '@angular/core';
import { CommonModule,DatePipe  } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { CompanyService } from '../../core/services/company.service';

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
  private companyService = inject(CompanyService);
  isDarkTheme = false;
  userId:any
  startedCount: number = 0;
  inProcessingCount: number = 0;
  completedCount: number = 0;
  companies: any[] = [];
  displayedCompanies: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  userData:any
  isRestrictedUser: boolean = false;
  ngOnInit(): void {
    this.getUserDatas()
    this.loadCompanyData()
    console.log(this.activeTab);
    this.applyTheme();
    this.themeService.isDarkTheme$.subscribe(
      isDark => this.isDarkTheme = isDark
    );
  }

  loadCompanyData(): void {
    this.companyService.getCompanyData().subscribe({
      next: (response) => {
        this.companies = response;
        this.updateDisplayedCompanies();
        this.updateStatusCounters();
      },
      error: (error) => {
        console.error('Error fetching company data:', error);
      },
    });
  }

  updateStatusCounters(): void {
    // Reset counters
    this.startedCount = 0;
    this.inProcessingCount = 0;
    this.completedCount = 0;
    
    // Count companies by status
    for (const company of this.companies) {
      switch(company.status.toLowerCase()) {
        case 'start':
        case 'started':
          this.startedCount++;
          break;
        case 'inprocessing':
        case 'in-processing':
          this.inProcessingCount++;
          break;
        case 'completed':
        case 'complete':
        case 'done':
          this.completedCount++;
          break;
        // Add more cases if you have other statuses
      }
    }
  }

  updateDisplayedCompanies() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedCompanies = this.companies.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedCompanies();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedCompanies();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.companies.length / this.itemsPerPage);
  }

  getUserDatas() {
    this.userId = localStorage.getItem('userId');
    console.log('userId:', this.userId);
  
    if (this.userId) {
      this.authService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.userData = user;
          const userRole = this.userData?.roles?.toLowerCase();
          console.log('userRole');
          
          if (userRole === 'shareholder' || userRole === 'director') {
            this.isRestrictedUser = true;
          } else {
            this.isRestrictedUser = false;
          }
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        }
      });
    } else {
      console.log('User is not logged in or userId is not available.');
    }
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
