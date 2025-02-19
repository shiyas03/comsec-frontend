import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CompanyService } from '../../core/services/company.service';
import { PdfService } from '../../core/services/pdf.service';
import { CommonModule } from '@angular/common';
import { PdfSharedAgrementService } from '../../core/services/pdf-shared-agrement.service';
import { PdfAoAService } from '../../core/services/pdf-ao-a.service';
import { PdfAoBService } from '../../core/services/pdf-ao-b.service';

@Component({
  selector: 'app-document-status',
  imports: [CommonModule],
  templateUrl: './document-status.component.html',
  styleUrl: './document-status.component.css'
})
export class DocumentStatusComponent implements OnInit, OnDestroy {
  payload: any;
  pdfUrl: string | null = null;
  pdfShareUrl: string | null = null;
  pdfAoAUrl: string | null = null;
  private companyService = inject(CompanyService);
  private pdfService = inject(PdfService);
  private pdfSharesService = inject(PdfSharedAgrementService);
  private pdfAoAService = inject(PdfAoAService);
  private pdfAoABService = inject(PdfAoBService);

  ngOnInit(): void {
    // Wait for payload before generating PDF
    this.companyService.getPayload().subscribe({
      next: async (data: any) => {
        console.log("full data",data);
        
        if (data) {
          this.payload = data;
          console.log('Received payload:', this.payload);
          await this.generatePdf(); // Generate PDF after receiving payload
        } else {
          console.warn('No payload found.');
        }
      },
      error: (err: any) => {
        console.error('Error fetching payload:', err);
      },
    });
  }

  ngOnDestroy(): void {
    // Clean up URL object when component is destroyed
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl);
    }
  }

  async generatePdf() {
    try {
      if (this.payload) {
        console.log('Generating PDF with payload:', this.payload);
        this.pdfUrl = await this.pdfService.fillPdf(this.payload);
        this.pdfShareUrl = await this.pdfSharesService.fillPdf(this.payload);
        if(this.payload.shareholders && this.payload.shareholders.length < 0){
          
          this.pdfAoAUrl = await this.pdfAoAService.fillPdf(this.payload);
        }
        else{

          this.pdfAoAUrl = await this.pdfAoABService.fillPdf(this.payload);
        }
        console.log('PDF URL generated:', this.pdfAoAUrl);
        console.log('Documents generated:', {
          pdfUrl: this.pdfUrl,
          pdfShareUrl: this.pdfShareUrl
        });
        
        // Don't open the window automatically
        // window.open(this.pdfShareUrl, '_blank');
      } else {
        console.error('No payload available for PDF generation');
      }
    } catch (error) {
      console.error('Error in generatePdf:', error);
    }
  }
  
  // Add a new method to handle the download when requested
  downloadShareCertificate() {
    this.pdfSharesService.downloadGeneratedFile();
  }
}