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
  data: any;
  pdfUrl: string | null = null;
  pdfShareUrl: string | null = null;
  pdfAoAUrl: string | null = null;
  currentUploadId: string | null = null;
  showUploadModal = false;
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
          this.data = data;
          console.log('Received payload:', this.data);
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

  getTotalSignedCount(): number {
    return (this.data?.directors?.length || 0) + 
           (this.data?.shareholders?.length || 0);
  }

  async generatePdf() {
    try {
      if (this.data) {
        console.log('Generating PDF with payload:', this.data);
        this.pdfUrl = await this.pdfService.fillPdf(this.data);
        this.pdfShareUrl = await this.pdfSharesService.fillPdf(this.data);
        const businessType = this.data.companyInfo[0]?.type_of_business;
        console.log('Business Type:', businessType);
        if (businessType === 'private') {
          console.log("its privateeeee");
          
        if(this.data.shareholders && this.data.shareholders.length <=1){
          this.pdfAoAUrl = await this.pdfAoAService.fillPdf(this.data);         
         
        }
        else{
          console.log('this.payload.shareholders.length',this.data.shareholders.length)
          
          this.pdfAoAUrl = await this.pdfAoABService.fillPdf(this.data);

          
        }
      }
      else{

        this.pdfAoAUrl=null
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

  openUploadModal(id: string): void {
    this.currentUploadId = id;
    this.showUploadModal = true;
  }

  closeUploadModal(): void {
    this.showUploadModal = false;
    this.currentUploadId = null;
  }

  uploadFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Here you would handle the file upload to your backend
      console.log(`Uploading file ${file.name} for ID: ${this.currentUploadId}`);
      
      // Mock successful upload
      setTimeout(() => {
        this.closeUploadModal();
        // You might want to refresh your data here
      }, 1000);
    }
  }

  previewDocument(documentUrl: string): void {
    window.open(documentUrl, '_blank');
  }

  // Helper method to generate the appropriate position label
  getPositionLabel(type: string, index: number): string {
    return `${type} ${index + 1}`;
  }

}