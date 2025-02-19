import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { TreeSelectModule } from 'primeng/treeselect';
import { CompanyService } from '../../core/services/company.service';
import Swal from 'sweetalert2';
import { catchError, map, Observable, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

interface BuisnessNature {
  value: string;
  code: string;
}

@Component({
  selector: 'app-project-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TreeSelectModule,
    DropdownModule,
    ButtonModule,
    SelectModule,
],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {

  private companyService = inject(CompanyService)
  private route=inject(ActivatedRoute)

  companyId!:string
  tabs: any[] = ["Company Info", "Shares Info", "Directors", "Company Secretary"];
  shareCapitalList:any[]= []
  shareholders: any[] = [];
  activeTabIndex = 0;
  showForm:boolean = false;
  invateShareHolderForm:boolean = false
  imagePreview: string | null = null;
  imagePreviewDirectorsId: string | ArrayBuffer | null = null; 
  imagePreviewDirectorsAddressProof: string | ArrayBuffer | null = null;
  imagePreviewCompanySecretaryId: string | ArrayBuffer | null = null;
  imagePreviewCompanySecretaryAddressProof: string | ArrayBuffer | null = null;
  addressProofDirectors: string | ArrayBuffer | null = null;
  directorsInfoOpen:boolean = false
  directorInvateOpen:boolean = false
  addressProofPreview: string | null = null;
  idProofPreview: string | ArrayBuffer | null = null; 
  companyInfoForm!: FormGroup;
  addShareForm!: FormGroup;
  shareHoldersForm!:FormGroup;
  inviteShareholderForm!:FormGroup
  directorInformationForm!:FormGroup
  directorsInformation:any[]=[]
  InviteDirectorsForm!:FormGroup
  comapnySecretaryForm!:FormGroup
  selectedDirectorUserType: string = 'person';
  selectedNodes: string = "";
  selectedCountry = ""
  private router = inject(Router)
  countries: any[] = [
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
  ];

  buisnessNature = [{
    value: "Crop and animal production, hunting.",
    code: "001"
  }, {
    value: "Forestry activities",
    code: "002"
  }, {
    value: "Fishing and aquaculture",
    code: "003"
  }, {
    value: "Mining of coal and lignite",
    code: "005"
  }, {
    value: "Extraction of crude petroleum and natural gas",
    code: "006"
  }, {
    value: "Mining of metal ores",
    code: "007"
  }, {
    value: "Quarrying and other mining of non-metal ores",
    code: "008"
  }, {
    value: "Mining support service activities",
    code: "009"
  }, {
    value: "Manufacture of food products",
    code: "010"
  }, {
    value: "Manufacture of beverages",
    code: "011"
  }, {
    value: "Manufacture of tobacco products",
    code: "012"
  }, {
    value: "Manufacture of textiles",
    code: "013"
  }, {
    value: "Manufacture of wearing apparel",
    code: "014"
  }, {
    value: "Manufacture of leather and related products",
    code: "015"
  }, {
    value: "Manufacture of wood and of products of wood and cork, articles of straw and plaiting materials (except furniture and toys)",
    code: "016"
  }, {
    value: "Manufacture of paper and paper products",
    code: "017"
  }, {
    value: "Printing and reproduction of recorded media",
    code: "018"
  }, {
    value: "Manufacture of coke and refined petroleum products",
    code: "019"
  }, {
    value: "Manufacture of chemicals and chemical products",
    code: "020"
  }, {
    value: "Manufacture of pharmaceuticals, medicinal chemical and botanical products",
    code: "021"
  }, {
    value: "Manufacture of rubber and plastics products (except furniture, toys, sports goods and stationery)",
    code: "022"
  }, {
    value: "Manufacture of other non-metallic mineral products",
    code: "023"
  }, {
    value: "Manufacture of basic metals",
    code: "024"
  }, {
    value: "Manufacture of fabricated metal products (except machinery and equipment)",
    code: "025"
  }, {
    value: "Manufacture of computer, electronic and optical products",
    code: "026"
  }, {
    value: "Manufacture of electrical equipment",
    code: "027"
  }, {
    value: "Manufacture of machinery and equipment n.e.c.",
    code: "028"
  }, {
    value: "Body assembly of motor vehicles",
    code: "029"
  }, {
    value: "Manufacture of other transport equipment",
    code: "030"
  }, {
    value: "Manufacture of furniture",
    code: "031"
  }, {
    value: "Other manufacturing",
    code: "032"
  }, {
    value: "Repair and installation of machinery and equipment",
    code: "033"
  }, {
    value: "Electrcity and Gas Supply",
    code: "035"
  }, {
    value: "Water collection, treatment and supply",
    code: "036"
  }, {
    value: "Sewerage",
    code: "037"
  }, {
    value: "Waste collection, treatment and disposal activities; materials recovery",
    code: "038"
  }, {
    value: "Remediation activities and other waste management services",
    code: "039"
  }, {
    value: "Construction of buildings",
    code: "041"
  }, {
    value: "Civil engineering",
    code: "042"
  }, {
    value: "Specialised Construction Activities",
    code: "043"
  }, {
    value: "Import and export trade ",
    code: "045"
  }, {
    value: "Wholesale",
    code: "046"
  }, {
    value: "Retail Trade",
    code: "047"
  }, {
    value: "Land Transport",
    code: "049"
  }, {
    value: "Water Transport",
    code: "050"
  }, {
    value: "Air Transport",
    code: "051"
  }, {
    value: "Warehousing and support activities for transportation",
    code: "052"
  }, {
    value: "Postal and courier activities",
    code: "053"
  }, {
    value: "Short term accommodation activities",
    code: "055"
  }, {
    value: "Food and beverage service activities",
    code: "056"
  }, {
    value: "Publishing activities",
    code: "058"
  }, {
    value: "Motion picture, video and television programme production, sound recording and music publishing activities",
    code: "059"
  }, {
    value: "Programming and broadcasting activities",
    code: "060"
  }, {
    value: "Telecommunications",
    code: "061"
  }, {
    value: "Information technology service activities",
    code: "062"
  }, {
    value: "Information service activities",
    code: "063"
  }, {
    value: "Financial service activities, including investment and holding companies, and the activities of trusts, funds and similar financial entities.",
    code: "064"
  }, {
    value: "Insurance (including pension funding) ",
    code: "065"
  }, {
    value: "Activities auxiliary to financial service and insurance activities",
    code: "066"
  }, {
    value: "Real estate activities",
    code: "068"
  }, {
    value: "Legal and accounting activities",
    code: "069"
  }, {
    value: "Activities of head offices; management and management consultancy activities",
    code: "070"
  }, {
    value: "Architecture and engineering activities, technical testing and analysis",
    code: "071"
  }, {
    value: "Scientific research and development",
    code: "072"
  }, {
    value: "Veterinary activities",
    code: "073"
  }, {
    value: "Advertising and market research",
    code: "074"
  }, {
    value: "Other professional, scientific and technical activities",
    code: "075"
  }, {
    value: "Rental and leasing activities",
    code: "077"
  }, {
    value: "Employment activities",
    code: "078"
  }, {
    value: "Travel agency, reservation service and related activities",
    code: "079"
  }, {
    value: "Security and investigation activities ",
    code: "080"
  }, {
    value: "Services to buildings and landscape care activities",
    code: "081"
  }, {
    value: "Office administrative, office support and other business support activities",
    code: "082"
  }, {
    value: "Public administration",
    code: "084"
  }, {
    value: "Education",
    code: "085"
  }, {
    value: "Human health activities",
    code: "086"
  }, {
    value: "Residential care activities",
    code: "087"
  }, {
    value: "Social work activities without accommodation",
    code: "088"
  }, {
    value: "Creative and performing arts activities",
    code: "090"
  }, {
    value: "Libraries, archives, museums and other cultural activities",
    code: "091"
  }, {
    value: "Activities of amusement parks and theme parks",
    code: "092"
  }, {
    value: "Sports and other entertainment activities",
    code: "093"
  }, {
    value: "Activities of membership organisations",
    code: "094"
  }, {
    value: "Repair of motor vehicles, motorcycles, computers, personal and household goods",
    code: "095"
  }, {
    value: "Other personal service activities",
    code: "096"
  }, {
    value: "Activities of households as employers of domestic personnel",
    code: "097"
  }, {
    value: "Goods and services producing activities of private households for own use ",
    code: "098"
  }, {
    value: "Activities of extraterritorial organisations and bodies",
    code: "099"
  }]

  private fb = inject(FormBuilder)

  ngOnInit() {
    this.initializeCompanyInfoForm()
    this.initializeAddSharesForm()
    this.initializeSharesHoldersForm()
    this.initializeInvateSharesHoldersForm()
    this.initializeDirectorInfoForm()
    this.initializeInvateDirectorForm()
    this.initializeCompanySecretaryForm()

    this.route.queryParams.subscribe(params => {
      this.companyId = params['companyId']; 
      if (params['fromEmail']) {
        this.activeTabIndex = 2; 
        this.fetchDirectorsInfo();
      }
    });

    this.route.queryParams.subscribe(params => {
      this.companyId = params['companyId']; 
      if (params['fromShare']) {
        this.activeTabIndex = 1; 
        this.getShareCapitalList();
        this.getShareHoldersList();
      }
    });
    

    this.companyInfoForm.get('country_Address')?.disable();
    this.companyInfoForm.get('presentorReferance')?.disable();
  }

  initializeCompanyInfoForm(): void {
    this.companyInfoForm = this.fb.group({
      companyNameEN: new FormControl('', [Validators.required]),
      companyNameCN: new FormControl('', [Validators.required]),
      companyType: new FormControl('private', [Validators.required]),
      natureofCompany: new FormControl<BuisnessNature | null>(null),
      code: new FormControl('', [Validators.required]),
      Flat_Address: new FormControl('', [Validators.required]),
      Building_Address: new FormControl('', [Validators.required]),
      Street_Address: new FormControl('', [Validators.required]),
      District_Address: new FormControl('', [Validators.required]),
      country_Address: new FormControl('Hong Kong', [Validators.required]),
      company_Email: new FormControl('', [Validators.required, Validators.email]),
      company_Telphone: new FormControl('', [Validators.required]),
      company_Fax: new FormControl('', [Validators.required]),
      subscriptionDuration: new FormControl('1 year', [Validators.required]),
      presentorName: new FormControl('', [Validators.required]),
      presentorChiName: new FormControl('', [Validators.required]),
      presentorAddress: new FormControl('', [Validators.required]),
      presentorBuilding: new FormControl('', [Validators.required]),
      presentorStreet: new FormControl('', [Validators.required]),
      presentorDistrict: new FormControl('', [Validators.required]),
      presentorTel: new FormControl('', [Validators.required]),
      presentorFax: new FormControl('', [Validators.required]),
      presentorEmail: new FormControl('', [Validators.required, Validators.email]),
      presentorReferance: new FormControl('CompanyName-NNC1-06-03-2024', [Validators.required]),
      companyLogo: new FormControl('', [Validators.required]),
    });

    // Listen for changes on the `natureofCompany` field
    this.companyInfoForm.get('natureofCompany')?.valueChanges.subscribe((selectedNature: BuisnessNature | null) => {
      console.log(selectedNature);

      if (selectedNature) {
        this.companyInfoForm.get('code')?.setValue(selectedNature.code);
      } else {
        this.companyInfoForm.get('code')?.setValue('');
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.companyInfoForm.get(controlName);

    if (control?.touched || control?.dirty) { 
        if (control?.hasError('required')) {
            return `${controlName} is required.`;
        }
        if (control?.hasError('email')) {
            return `${controlName} must be a valid email address.`;
        }
    }
    return '';
}
  getErrorMessage1(controlName: string): string {
    const control = this.addShareForm.get(controlName);
  
    if (control?.touched || control?.dirty) { 
      if (control?.hasError('required')) {
        return `${controlName} is required.`;
      }
      if (control?.hasError('min')) {
        if (controlName === 'total_shares_proposed') {
          return 'At least 1 share must be proposed.';
        }
        if (controlName === 'unit_price') {
          return 'Unit price must be at least 0.';
        }
      }
    }
    return '';
  }

  getErrorMessage2(controlName: string): string {
    const control = this.shareHoldersForm.get(controlName);
  
    if (control?.touched || control?.dirty) { 
      if (control?.hasError('required')) {
        return `${controlName} is required.`;
      }
    }
    return '';
  }

  
  changeTab(index: number) {
    this.activeTabIndex = index;
  }  
  
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      // Create a FileReader to read the image file as base64
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        console.log('base64 converted image link',this.imagePreview);
        
        this.companyInfoForm.patchValue({
          companyLogo: this.imagePreview 
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSaveAndNext(): void {
    if (this.companyInfoForm.valid) {
      this.submitCompanyInfo().subscribe({
        next: () => {
          this.changeTab(this.activeTabIndex + 1);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Form submitted successfully.",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        },
        error: () => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Form submission failed.",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
          console.warn("Form submission failed, staying on the same tab.");
        },
      });
    } else {
      this.companyInfoForm.markAllAsTouched();
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Form is invalid. Please fix the errors.",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      console.warn("Form is invalid. Please fix the errors before proceeding.");
    }
  }
  
  
  submitCompanyInfo(): Observable<boolean> {
    const formValues = this.companyInfoForm.getRawValue();
    console.log("Submitted form dataAAAAAA", formValues);
  
    return this.companyService.submitCompanyInfo(formValues).pipe(
      tap((response) => {
        console.log("Form submitted successfully", response);
        Swal.fire({
          position: "top-end", 
          icon: "success",
          title: response.message, 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });
        this.companyId = response.companyId;
      }),
      catchError((error) => {
        console.error("Error submitting form", error);
        Swal.fire({
          position: "top-end", 
          icon: "error",
          title: error.message, 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });
        throw error;
      }),
      map(() => true)
    );
  }
  
  
  

  
  onNatureofCompany(event: Event) {
    console.log(event);
    // Optionally update your form value
    // this.companyInfoForm.patchValue({
    //   natureofCompany: event.value
    // });
  }

  initializeAddSharesForm(){
    this.addShareForm = this.fb.group({
      class_of_shares: ['', Validators.required],
      total_shares_proposed: ['', Validators.required],
      currency: ['HKD', Validators.required],
      unit_price: [null, [Validators.required, Validators.min(0)]],
      total_amount: [{ value: null, disabled: true }],
      total_capital_subscribed: ['', Validators.required],
      unpaid_amount: [{ value: 0, disabled: true }],
      particulars_of_rights: ['',[Validators.required]]
    })

    // Subscribe to changes in unit price and total shares to calculate total amount
    this.addShareForm.get('unit_price')?.valueChanges.subscribe(() => {
      this.calculateTotalAmount();
    });
  
    this.addShareForm.get('total_shares_proposed')?.valueChanges.subscribe(() => {
      this.calculateTotalAmount();
    });
  
    // Subscribe to changes in total amount and total capital subscribed to calculate unpaid amount
    this.addShareForm.get('total_amount')?.valueChanges.subscribe(() => {
      this.calculateUnpaidAmount();
    });
  
    this.addShareForm.get('total_capital_subscribed')?.valueChanges.subscribe(() => {
      this.calculateUnpaidAmount();
    });
  }

  calculateTotalAmount() {
    const unitPrice = this.addShareForm.get('unit_price')?.value;
    const totalShares = this.addShareForm.get('total_shares_proposed')?.value;

    if (unitPrice && totalShares) {
      const totalAmount = unitPrice * totalShares;
      this.addShareForm.get('total_amount')?.setValue(totalAmount.toFixed(2));
    }
  }

  calculateUnpaidAmount() {
    const totalAmount = parseFloat(this.addShareForm.get('total_amount')?.value) || 0;
    const totalCapitalSubscribed = parseFloat(this.addShareForm.get('total_capital_subscribed')?.value) || 0;
  
    const unpaidAmount = totalAmount - totalCapitalSubscribed;
    this.addShareForm.get('unpaid_amount')?.setValue(unpaidAmount >= 0 ? unpaidAmount.toFixed(2) : 0);
  }


  addSharesSubmit() {
    const userId = localStorage.getItem('userId');
  
    if (!userId) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "User ID not found. Please log in again.",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      return;
    }
  
    const shareData = {
      companyId: this.companyId,
      userid: userId,
      total_shares_proposed: this.addShareForm.get('total_shares_proposed')?.value,
      unit_price: this.addShareForm.get('unit_price')?.value,
      total_capital_subscribed: this.addShareForm.get('total_capital_subscribed')?.value,
      unpaid_amount: this.addShareForm.get('unpaid_amount')?.value,
      class_of_shares: this.addShareForm.get('class_of_shares')?.value,
      particulars_of_rights: this.addShareForm.get('particulars_of_rights')?.value,
    };
  
    this.companyService.shareCreation(shareData).subscribe({
      next: (response) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: response.message,
          toast: true,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        this.getShareCapitalList();
        this.resetAddShareForm();
      },
      error: (error) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error",
          text: error.message || "Failed to create share.",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      },
    });
  }
  

resetAddShareForm() {
    this.addShareForm.reset({
        class_of_shares: '',
        total_shares_proposed: '',
        currency: 'HKD',  
        unit_price: null,
        total_amount: { value: null, disabled: true },
        total_capital_subscribed: '',
        unpaid_amount: { value: 0, disabled: true },
        particulars_of_rights: ''
    });

    this.addShareForm.get('total_amount')?.enable();
    this.addShareForm.get('unpaid_amount')?.enable();

    this.initializeAddSharesForm();
}




toggleShareHoldersForm() {
  console.log(this.showForm);
  
  this.showForm = !this.showForm; 
}


initializeSharesHoldersForm(){
  this.shareHoldersForm = this.fb.group({
    surname: ['', Validators.required],
    name: ['', Validators.required],
    chineeseName: ['', Validators.required],
    idNo: ['', Validators.required],
    idProof: ['', Validators.required],
    userType: ['person', Validators.required], 
    address:['',Validators.required],
    building:['',Validators.required],
    district:['',Validators.required],
    street:['',Validators.required],
    addressProof:['',Validators.required],
    email:['',Validators.required],
    phone:['',Validators.required],
    shareDetailsNoOfShares:['',Validators.required],
    shareDetailsClassOfShares:['',Validators.required]
  });

  // Log the form value on changes to verify functionality
this.shareHoldersForm.get('userType')?.valueChanges.subscribe((value) => {
  console.log('Selected User Type:', value);
});
}

shareHoldersFormSubmit() {
  if (this.shareHoldersForm.invalid) {
    this.shareHoldersForm.markAllAsTouched(); 
    return; 
  }

  const userId = localStorage.getItem('userId');
  const companyId = this.companyId;

  const formData = {
    ...this.shareHoldersForm.value,
    userId: userId, 
    companyId: companyId
  };

  console.log(formData);
  
  this.companyService.shareHoldersCreation(formData).subscribe({
    next: (response) => {
      console.log('Share creation successful:', response.message);
      
      Swal.fire({
          position: "top-end", 
          icon: "success",
          title: response.message, 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });

      this.shareHoldersForm.reset();
      this.addressProofPreview = null;
      this.idProofPreview = null;
      this.getShareHoldersList()
    },
    error: (error) => {
      console.error('Error occurred during share creation:', error);

       Swal.fire({
          position: "top-end", 
          icon: "error",
          title: error.message, 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });
    }
  });
}


onImageSelectedAddress(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput?.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.addressProofPreview = reader.result as string; 
      console.log('Base64 address proof:', this.addressProofPreview);
      
      this.shareHoldersForm.patchValue({
        addressProof: this.addressProofPreview 
      });
    };
    reader.readAsDataURL(file);
  } else {
    this.addressProofPreview = null;
    this.shareHoldersForm.patchValue({ addressProof: null });
  }
}



onSelectIDProofImage(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput?.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.idProofPreview = reader.result as string;
      console.log('Base64 ID proof:', this.idProofPreview);
      
      this.shareHoldersForm.patchValue({
        idProof: this.idProofPreview 
      });
    };
    reader.readAsDataURL(file);
  } else {
    this.idProofPreview = null;
    this.shareHoldersForm.patchValue({ idProof: null });
  }
}



clearForm() {
  this.shareHoldersForm.reset();
}

getShareCapitalList() {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "User ID not found. Please log in again.",
      toast: true,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    return;
  }

  this.companyService.getShareCapitalList(this.companyId, userId).subscribe({
    next: (response) => {
      console.log("Share capital list fetched successfully:", response);
      this.shareCapitalList = response.data;
      console.log("Share Capital List:", this.shareCapitalList); 
    },
    error: (error) => {
      console.error("Error fetching share capital list:", error);

      Swal.fire({
        position: "top-end",
        icon: "error",
        title: error.error?.message || "Failed to fetch share capital list. Please try again later.",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    },
  });
}




editShareCapitalList(event:Event){
console.log(event);
}


deleteShareCapitalList(id: string) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      this.companyService.deleteShareCapital(id).subscribe({
        next: (response) => {
          console.log('Share capital deleted:', response.message);

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: response.message || 'Share capital deleted successfully!',
            toast: true,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });

          this.getShareCapitalList();
        },
        error: (error) => {
          console.error('Error deleting share capital:', error);

          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: error.message || 'Failed to delete share capital.',
            toast: true,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        },
      });
    }
  });
}




getShareHoldersList() {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: "User ID not found. Please log in again.",
      toast: true,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
    return;
  }

  this.companyService.getShareHoldersList(this.companyId, userId).subscribe({
    next: (response) => {
      this.shareholders = response.data;
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Shareholders list fetched successfully.",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    },
    error: (error) => {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        text: error.message || "Failed to fetch shareholders list.",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    },
  });
}


invateShareHoldersButton(){
  this.invateShareHolderForm=!this.invateShareHolderForm
}


initializeInvateSharesHoldersForm(){
  this.inviteShareholderForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    classOfShares: ['Ordinary', Validators.required],
    noOfShares: ['', Validators.required],
  });
}

invateShareHoldersSubmit() {
  if (this.inviteShareholderForm.invalid) {
    this.inviteShareholderForm.markAllAsTouched(); 
    return; 
  }

  const userId = localStorage.getItem('userId');
  const companyId = this.companyId;

  const formData = {
    ...this.inviteShareholderForm.value,
    userId: userId, 
    companyId: companyId
  };

  console.log(formData);
  
  this.companyService.InvateshareHoldersCreation(formData).subscribe({
    next: (response) => {
      console.log('Shareholder invitation successful:', response.message);
      
      Swal.fire({
        position: "top-end", 
        icon: 'success',
        title: 'Invitation Sent!',
        toast: true, 
        text: `The invitation to ${formData.name} has been sent successfully!`,
        showConfirmButton:false,
        timer: 2000, 
        timerProgressBar: true, 
      });

      this.inviteShareholderForm.reset();
      this.addressProofPreview = null;
      this.idProofPreview = null;
      this.getShareHoldersList();
    },
    error: (error) => {
      console.error('Error occurred during share creation:', error);

       Swal.fire({
          position: "top-end", 
          icon: "error",
          title: error.message, 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });
    }
  });
}


clearInvateShareHoldersForm(){
  this.inviteShareholderForm.reset()
}

getErrorMessage3(controlName: string): string {
  const control = this.inviteShareholderForm.get(controlName);

  if (control?.touched || control?.dirty) { 
    if (control?.hasError('required')) {
      return `${controlName} is required.`;
    }
  }
  return '';
}

directorsInfoFormOpen(){
  this.directorsInfoOpen = !this.directorsInfoOpen
}



initializeDirectorInfoForm(){
 this.directorInformationForm = this.fb.group({
  type: ['person', Validators.required], 
  surname: ['', [Validators.required]],
  name: ['', [Validators.required]],
  chineeseName: ['', [Validators.required]],
  idNo: ['', Validators.required],
  idProof: [null, Validators.required],
  address: ['', Validators.required],
  street: ['', Validators.required],
  building: ['', Validators.required],
  district: ['', Validators.required],
  addressProof: [null, Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', [Validators.required]],
 })
}

getErrorMessage4(controlName: string): string {
  const control = this.directorInformationForm.get(controlName);

  if (control?.touched || control?.dirty) { 
      if (control?.hasError('required')) {
          return `${controlName} is required.`;
      }
      if (control?.hasError('email')) {
          return `${controlName} must be a valid email address.`;
      }
  }
  return '';
}

imagePreviewOnDirectorsIDProof(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      this.imagePreviewDirectorsId = e.target?.result as string | ArrayBuffer |null; 
    };

    reader.onloadend = () => {
      const result = reader.result; 
      if (typeof result === 'string') {
        this.directorInformationForm.patchValue({
          idProof: result, 
        });
        console.log('Base64 String:', result);
      } else {
        console.error('Result is not a string:', result); 
      }
    };

    reader.readAsDataURL(file);
  }
}


imagePreviewOnDirectorsAddressProof(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput?.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64AddressProof = reader.result as string;
      console.log('Base64 address proof:', base64AddressProof);


      this.addressProofDirectors = base64AddressProof; 
    };

    reader.readAsDataURL(file);
  } else {
    this.addressProofDirectors = null; 
  }
}



directorFormSubmission(){
  console.log(this.directorInformationForm.value);

  if (this.directorInformationForm.invalid) {
    this.directorInformationForm.markAllAsTouched(); 
    return; 
  }

  const userId = localStorage.getItem('userId');
  const companyId = this.companyId;

  const formData = {
    ...this.directorInformationForm.value,
    addressProof: this.addressProofDirectors,
    userId: userId, 
    companyId: companyId
  };

  console.log(formData);
  
  this.companyService.DirectorInfoCreation(formData).subscribe({
    next: (response) => {
      console.log('Share creation successful:', response.message);
      
      Swal.fire({
          position: "top-end", 
          icon: "success",
          title: response.message, 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });

      this.directorInformationForm.reset();
      this.fetchDirectorsInfo()
      this.imagePreviewDirectorsAddressProof = null;
      this.imagePreviewDirectorsId = null;
    },
    error: (error) => {
      console.error('Error occurred during director information creation:', error);

       Swal.fire({
          position: "top-end", 
          icon: "error",
          title: error.message, 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });
    }
  });
}

fetchDirectorsInfo(): void {
  const userId = localStorage.getItem('userId');
  const companyId = this.companyId;

  if (!userId) {
    console.error('Error: User ID is not found in localStorage');
    return;
  }

  this.companyService.getDirectorsInfo(companyId, userId).subscribe({
    next: (response) => {
      this.directorsInformation = response.data;
    },
    error: (err) => {
      console.error('Error fetching directors info:', err.message);
    },
  });
}

OnDeleteDirectorInfo(directorId: string): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      this.companyService.deleteDirector(directorId).subscribe({
        next: (response) => {
          console.log('Director deleted successfully:', response);
          this.directorsInformation = this.directorsInformation.filter(
            (director) => director._id !== directorId
          );

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'The director has been deleted.',
            toast: true,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        },
        error: (error) => {
          console.error('Error deleting director:', error.message);

          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Failed to delete the director. Please try again.',
            toast: true,
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        },
      });
    }
  });
}


openDirectorInvateForm(){
  this.directorInvateOpen = !this.directorInvateOpen
}


initializeInvateDirectorForm(){
  this.InviteDirectorsForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    classOfShares: ['', Validators.required],
    noOfShares: ['', [Validators.required, Validators.min(1)]],
  });
}

getErrorMessage5(controlName: string): string {
  const control = this.InviteDirectorsForm.get(controlName);
  if (control && (control.touched || control.dirty)) {
  if (control?.hasError('required')) {
    return `${controlName} is required`;
  }
  if (control?.hasError('email')) {
    return 'Enter a valid email address';
  }
  if (control?.hasError('minlength')) {
    return `Minimum length is 3 characters`;
  }
  if (control?.hasError('min')) {
    return `Value must be greater than 0`;
  }
}
  return '';
}

invateDirectorSubmit(): void {
  if (this.InviteDirectorsForm.valid) {
    const userId = localStorage.getItem("userId");
    const companyId = this.companyId;
    const formData = this.InviteDirectorsForm.value;

    const data = {
      ...formData,
      userId: userId,
      companyId: companyId,
    };

    this.companyService.directorInviteCreation(data).subscribe({
      next: (response) => {
        console.log('director creation created',response);
        
        Swal.fire({
          position: "top-end", 
          icon: "success",
          title: "Invitation Sent!",
          toast: true, 
          text: `The invitation to ${formData.name} has been sent successfully!`,
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true,
        });

        this.InviteDirectorsForm.reset();
      },
      error: (error) => {
        Swal.fire({
          position: "top-end", 
          icon: "error",
          title: error.message || "Failed to send invitation email.", 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });
      },
    });
  } else {
    console.log("Form is invalid");
  }
}


initializeCompanySecretaryForm() {
  this.comapnySecretaryForm = this.fb.group({
    tcspLicenseNo: ['', [Validators.required]],
    tcspReason: ['', [Validators.required]],
    type: ['person', Validators.required],
    surname: ['', [Validators.required]],
    name: ['', [Validators.required]],
    chineeseName: ['', [Validators.required]],
    idProof: ['', [Validators.required]],
    address: ['', [Validators.required]],
    street: ['', [Validators.required]],
    building: ['', [Validators.required]],
    district: ['', [Validators.required]],
    addressProof: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
  });
}


comapnySecretarySubmission(){
  console.log(this.comapnySecretaryForm.value);

  if (this.comapnySecretaryForm.invalid) {
    this.comapnySecretaryForm.markAllAsTouched(); 
    return; 
  }

  const userId = localStorage.getItem('userId');
  const companyId = this.companyId;

  const formData = {
    ...this.comapnySecretaryForm.value,
    addressProof:this.imagePreviewCompanySecretaryAddressProof,
    userId: userId, 
    companyId: companyId
  };

  console.log(formData);
  
  this.companyService.companySecretaryCreation(formData).subscribe({
    next: (response) => {
      console.log('Company Secretary information successfully added:', response.message);
      
      Swal.fire({
          position: "top-end", 
          icon: "success",
          title: response.message, 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });

      this.comapnySecretaryForm.reset();
      this.router.navigate(['/summary', companyId]); 
      this.imagePreviewCompanySecretaryAddressProof = null;
      this.imagePreviewCompanySecretaryId = null;
    },
    error: (error) => {
      console.error('Error occurred during company Secretary information creation:', error);

       Swal.fire({
          position: "top-end", 
          icon: "error",
          title: error.message, 
          toast: true, 
          showConfirmButton: false, 
          timer: 2000, 
          timerProgressBar: true, 
        });
    }
  });
}


imagePreviewOnCompanySecretaryIDProof(event:Event){
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      this.imagePreviewCompanySecretaryId = e.target?.result as string | ArrayBuffer |null; 
    };

    reader.onloadend = () => {
      const result = reader.result; 
      if (typeof result === 'string') {
        this.comapnySecretaryForm.patchValue({
          idProof: result, 
        });
        console.log('Base64 String:', result);
      } else {
        console.error('Result is not a string:', result); 
      }
    };

    reader.readAsDataURL(file);
  }
}

getErrorMessage6(controlName: string): string {
  const control = this.comapnySecretaryForm.get(controlName);

  const fieldNames: { [key: string]: string } = {
    tcspLicenseNo: 'TCSP License Number',
    tcspReason: 'TCSP Reason',
    surname: 'Surname',
    idProof: 'ID Proof',
    address: 'Address',
    street: 'street',
    building: 'building',
    district: 'district',
    addressProof: 'Address Proof',
    email: 'Email',
    phone: 'Phone',
  };

  if (control && (control.touched || control.dirty)) {
    if (control.hasError('required')) {
      return `${fieldNames[controlName]} is required`;
    }
    if (control.hasError('email')) {
      return 'Enter a valid email address';
    }
  }
  return '';
}


imagePreviewOnCompanySecretaryAddressProof(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput?.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64AddressProof = reader.result as string;
      console.log('Base64 address proof:', base64AddressProof);


      this.imagePreviewCompanySecretaryAddressProof = base64AddressProof; 
    };

    reader.readAsDataURL(file);
  } else {
    this.imagePreviewCompanySecretaryAddressProof = null; 
  }
}

}

