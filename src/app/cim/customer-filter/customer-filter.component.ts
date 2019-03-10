import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CustomerType } from 'models/customer-type';
import { CustomerTypeService } from 'shared/services/customer-type.service';
import { NotifyService } from 'shared/utils/notify.service';
import { CUSTOMER_STATUSES } from 'constants/customer-status';
import { CustomerClassificationService } from 'shared/services/customer-classification.service';
import { CustomerClassification } from 'models/customer-classification';
import { DATEPICKER_CONFIG } from 'constants/datepicker-config';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { EMITTER_TYPE } from 'constants/emitter';
import { UploaderService } from 'shared/services/uploader.service';
import { Subscription } from 'rxjs/Subscription';
import { CustomerService } from 'shared/services/customer.service';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { CimService } from '../cim.service';
import { Helpers } from 'shared/utils/helpers';
import { RoleService } from 'app/role.service';
import { BranchService } from 'shared/services/branch.service';
import { Branch } from 'models/branch';

@Component({
  selector: 'app-customer-filter',
  templateUrl: './customer-filter.component.html',
  styleUrls: ['./customer-filter.component.scss'],
})
export class CustomerFilterComponent implements OnInit, OnDestroy {
  @ViewChild('FileUpload')
  private _fileUpload: ElementRef;

  private _mimeTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls',
    '.xlsx',
  ];

  public get accept_file(): string {
    return this._mimeTypes.toString();
  }

  public isLoading = false;

  public filterTerm: any = {
    txtSearch: '',
    customerType: null,
    typeOfInvestment: null,
    customerStatus: null,
    sort: 'desc',
    column: 'id',
    branchId: null,
  };

  // customer types
  public customerTypes: CustomerType[] = [];
  public isLoadingCustomerType = false;

  // customer status
  public CUSTOMER_STATUSES = CUSTOMER_STATUSES;

  // type of sale
  public typeOfSales: CustomerClassification[] = [];
  public isLoadingTypeOfSale = false;

  // type of investment
  public typeOfInvestments: CustomerClassification[] = [];
  public isLoadingTypeOfInvestment = false;

  // branches
  public branches: Branch[] = [];
  public isLoadingBranch = false;

  // datepicker config
  public DATEPICKER_CONFIG = DATEPICKER_CONFIG;

  public _subscriber: Subscription;

  get roleAccess(): boolean {
    return this.role.is_admin || this.role.is_sale_director;
  }
  constructor(
    private _customerTypeSv: CustomerTypeService,
    private _customerClassificationSv: CustomerClassificationService,
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _uploader: UploaderService,
    private _customerSv: CustomerService,
    public cimSv: CimService,
    public role: RoleService,
    private _branchSv: BranchService,
  ) {
    document.title = 'Mytel | filter customer';
  }

  ngOnInit() {
    this._getCustomerTypes();
    this._getTypeOfSales();
    this._getTypeOfInvestment();
    this._onEventEmitter();
    this._getBranchList();
  }

  ngOnDestroy() {
    this._subscriber.unsubscribe();
  }

  public downloadCustomer() {
    if (!this.cimSv.date) {
      return;
    }
    const params: any = {
      date: this.cimSv.date,
    };

    if (this.filterTerm.sort) {
      params.sort = this.filterTerm.sort;
    }
    if (this.filterTerm.column) {
      params.column = this.filterTerm.column;
    }
    if (this.filterTerm.date) {
      params.date = this.filterTerm.date;
    }
    if (this.filterTerm.txtSearch) {
      params.txtSearch = this.filterTerm.txtSearch.trim();
    }
    if (this.filterTerm.customerType) {
      params.customerTypeId = this.filterTerm.customerType.id;
    }
    if (this.filterTerm.typeOfInvestment) {
      params.typeOfInvestmentId = this.filterTerm.typeOfInvestment.id;
    }
    if (this.filterTerm.customerStatus !== null && this.filterTerm.customerStatus !== undefined) {
      params.customerStatus = this.filterTerm.customerStatus.toString();
    }
    // if (this.filterTerm.typeOfContact) {
    //   params.typeOfContactId = this.filterTerm.typeOfContact.id;
    // }

    this._customerSv.exportCustomer(params).subscribe(
      (res) => {
        saveAs(res, `Customers-${moment().unix()}.xlsx`);
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }

  private _onEventEmitter() {
    this._subscriber = this._emitter.caseNumber$.subscribe((data) => {});
  }

  public groupByFn = (item) => item.child.state;

  private _getBranchList() {
    if (this.roleAccess) {
      this.isLoadingBranch = true;
      this._branchSv.getBranchList().subscribe(
        (res) => {
          this.branches = res.branches;
          this.isLoadingBranch = false;
        },
        (errors) => {
          this.isLoadingBranch = false;
          this._notify.error(errors);
        },
      );
    }
  }

  private _getCustomerTypes() {
    this.isLoadingCustomerType = true;
    this._customerTypeSv.customerTypesRead().subscribe(
      (res) => {
        this.isLoadingCustomerType = false;
        this.customerTypes = res;
      },
      (errors) => {
        this.isLoadingCustomerType = false;
        this._notify.error(errors);
      },
    );
  }

  private _getTypeOfSales() {
    this.isLoadingTypeOfSale = true;

    const params = {
      type: 'sale',
    };
    this.typeOfSales = [];

    this._customerClassificationSv.getCustomerClassification(params).subscribe(
      (res) => {
        this.isLoadingTypeOfSale = false;
        this.typeOfSales = res.customerClassifications;
      },
      (errors) => {
        this.isLoadingTypeOfSale = false;
        this._notify.error(errors);
      },
    );
  }

  private _getTypeOfInvestment() {
    this.isLoadingTypeOfInvestment = true;

    const params = {
      type: 'investment',
    };
    this.typeOfInvestments = [];

    this._customerClassificationSv.getCustomerClassification(params).subscribe(
      (res) => {
        this.isLoadingTypeOfInvestment = false;
        this.typeOfInvestments = res.customerClassifications;
      },
      (errors) => {
        this.isLoadingTypeOfInvestment = false;
        this._notify.error(errors);
      },
    );
  }

  public filterCustomers() {
    const params: any = {};

    if (this.filterTerm.txtSearch) {
      params.txtSearch = this.filterTerm.txtSearch;
    }
    if (this.filterTerm.customerType) {
      params.customerTypeId = this.filterTerm.customerType.id;
    }
    if (this.filterTerm.typeOfInvestment) {
      params.typeOfInvestmentId = this.filterTerm.typeOfInvestment.id;
    }
    if (this.filterTerm.customerStatus !== null && this.filterTerm.customerStatus !== undefined) {
      params.customerStatus = this.filterTerm.customerStatus.toString();
    }
    if (this.filterTerm.typeOfContact) {
      params.typeOfContactId = this.filterTerm.typeOfContact.id;
    }
    if (this.filterTerm.branchId) {
      params.branchId = this.filterTerm.branchId;
    }
    this._emitter.publishData({
      type: EMITTER_TYPE.FILTER_CUSTOMER,
      params,
    });
  }

  // upload file
  public getFile() {
    const file = this._fileUpload.nativeElement.files[0];
    if (!file) {
      return;
    }

    // Validator File Type
    if (this._mimeTypes.indexOf(file.type) < 0) {
      this._notify.error('You can not upload files that are not in xls, xlsx format');
      return;
    }

    // Validator File Size
    if (file.size >= 10485760) {
      this._notify.error('You can not upload images larger than 10MB in size');
      return;
    }

    const data = [
      {
        key: 'file',
        value: file,
      },
    ];

    this.isLoading = true;

    this._uploader.store(`customers/import`, data).subscribe(
      (res) => {
        this.isLoading = false;
        if (res.data.done && res.data.done > 0) {
          this._notify.success(`import success ${res.data.done} rows`);
        }

        if (res.data.failed && res.data.failed > 0) {
          this._notify.error(`import failed ${res.data.failed} rows`);
        }

        if (res.data.duplicate && res.data.duplicate > 0) {
          this._notify.warning(`import duplicate ${res.data.duplicate} rows`);
        }

        this._emitter.publishData({
          type: EMITTER_TYPE.CREATE_CUSTOMER,
        });

        this._removeFile();
      },
      (errors) => {
        this.isLoading = false;
        this._notify.error(errors);
        this._removeFile();
      },
    );
  }

  private _removeFile() {
    this._fileUpload.nativeElement.value = null;
  }

  public downloadTemplate() {
    Helpers.downloadFileFromUri('/assets/Template_CIM_v2.xlsx', 'Template CIM.xlsx');
  }
}
