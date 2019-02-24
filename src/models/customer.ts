import { BaseModel } from './base';
import { CustomerType } from './customer-type';
import { TypeOfInvestment } from './type-of-investment';
import { CustomerClassification } from './customer-classification';
import * as moment from 'moment';
import { Marker } from 'interfaces/maker';
import { User } from './user';

export class Customer extends BaseModel {
  private _customerName: string;
  public get customerName(): string {
    return this._customerName;
  }
  public set customerName(v: string) {
    this._customerName = v;
  }

  private _address: string;
  public get address(): string {
    return this._address;
  }
  public set address(v: string) {
    this._address = (v || '').split(';')[0];
  }

  public get has_address(): boolean {
    return !!this.address && !!this.latitude && !!this.longitude;
  }

  private _catalog: CustomerClassification;
  public get catalog(): CustomerClassification {
    return this._catalog;
  }
  public set catalog(v: CustomerClassification) {
    this._catalog = v;
  }
  public get catalogName(): string {
    return this.catalog ? this.catalog.name : null;
  }

  private _contactName: string;
  public get contactName(): string {
    return this._contactName;
  }
  public set contactName(v: string) {
    this._contactName = v;
  }

  private _customerDate: string;
  public get customerDate(): string {
    return this._customerDate;
  }
  public set customerDate(v: string) {
    this._customerDate = v;
  }
  public get customerDateToJSON(): string {
    return moment(this.customerDate).format('YYYY-MM-DD');
  }

  private _customerDateBinding: Date;
  public get customerDateBinding(): Date {
    return this._customerDateBinding;
  }
  public set customerDateBinding(v: Date) {
    this._customerDateBinding = v;
  }

  private _customerDateFormat: string;
  public get customerDateFormat(): string {
    return this._customerDateFormat;
  }
  public set customerDateFormat(v: string) {
    this._customerDateFormat = v;
  }

  private _customerStatus: string;
  public get customerStatus(): string {
    return this._customerStatus;
  }
  public set customerStatus(v: string) {
    this._customerStatus = v;
  }
  public get customerStatusString(): string {
    return !!this.customerStatus ? 'Contacted' : 'Not Contacted';
  }

  private _customerType: CustomerType;
  public get customerType(): CustomerType {
    return this._customerType;
  }
  public set customerType(v: CustomerType) {
    this._customerType = v;
  }

  private _customerTypeId: number;
  public get customerTypeId(): number {
    return this._customerTypeId;
  }
  public set customerTypeId(v: number) {
    this._customerTypeId = v;
  }

  private _email: string;
  public get email(): string {
    return this._email;
  }
  public set email(v: string) {
    this._email = v;
  }

  private _latitude: number;
  public get latitude(): number {
    return this._latitude || null;
  }
  public set latitude(v: number) {
    this._latitude = v;
  }

  private _longitude: number;
  public get longitude(): number {
    return this._longitude || null;
  }
  public set longitude(v: number) {
    this._longitude = v;
  }

  private _phone: string;
  public get phone(): string {
    return this._phone;
  }
  public set phone(v: string) {
    this._phone = v;
  }

  private _position: string;
  public get position(): string {
    return this._position;
  }
  public set position(v: string) {
    this._position = v;
  }

  private _service: string;
  public get service(): string {
    return this._service;
  }
  public set service(v: string) {
    this._service = v;
  }

  private _typeOfInvestment: TypeOfInvestment;
  public get typeOfInvestment(): TypeOfInvestment {
    return this._typeOfInvestment;
  }
  public set typeOfInvestment(v: TypeOfInvestment) {
    this._typeOfInvestment = v;
  }
  public get typeOfInvestmentName(): string {
    return this.typeOfInvestment ? this.typeOfInvestment.name : '';
  }

  private _typeOfInvestmentId: number;
  public get typeOfInvestmentId(): number {
    return this._typeOfInvestmentId;
  }
  public set typeOfInvestmentId(v: number) {
    this._typeOfInvestmentId = v;
  }

  private _typeOfSale: CustomerClassification;
  public get typeOfSale(): CustomerClassification {
    return this._typeOfSale;
  }
  public set typeOfSale(v: CustomerClassification) {
    this._typeOfSale = v;
  }
  public get typeOfSaleName(): string {
    return this.typeOfSale ? this.typeOfSale.name : '';
  }

  private _typeOfSaleId: number;
  public get typeOfSaleId(): number {
    return this._typeOfSaleId;
  }
  public set typeOfSaleId(v: number) {
    this._typeOfSaleId = v;
  }

  // private _typeOfContact: CustomerClassification;
  // public get typeOfContact(): CustomerClassification {
  //   return this._typeOfContact;
  // }
  // public set typeOfContact(v: CustomerClassification) {
  //   this._typeOfContact = v;
  // }
  // public get typeOfContactName(): string {
  //   return this.typeOfContact ? this.typeOfContact.name : null;
  // }

  private _assignedStaff: User;
  public get assignedStaff(): User {
    return this._assignedStaff;
  }
  public set assignedStaff(v: User) {
    this._assignedStaff = v;
  }
  public get userName(): string {
    return this.assignedStaff ? this.assignedStaff.fullName : null;
  }

  constructor(d?: any) {
    super(d);
    this.customerType = new CustomerType();
    this.typeOfInvestment = new TypeOfInvestment();
    this.typeOfSale = new CustomerClassification();
    this.customerDateBinding = new Date();
    this.catalog = new CustomerClassification();
    this.assignedStaff = new User();

    if (d) {
      this.customerName = d.customerName;
      this.address = d.address || '';
      this.catalog = new CustomerClassification(d.catalog);
      this.contactName = d.contactName;
      this.customerDate = d.customerDate;
      this.customerDateBinding = new Date(d.customerDate);
      this.customerDateFormat = d.customerDateFormat;
      this.customerStatus = d.customerStatus;
      this.customerType = new CustomerType(d.customerType);
      this.customerTypeId = d.customerTypeId;
      this.email = d.email;
      this.latitude = d.latitude;
      this.longitude = d.longitude;
      this.phone = d.phone;
      this.position = d.position;
      this.service = d.service;
      this.typeOfInvestment = new TypeOfInvestment(d.typeOfInvestment);
      this.typeOfInvestmentId = d.typeOfInvestmentId;
      this.typeOfSale = new CustomerClassification(d.typeOfSale);
      this.typeOfSaleId = d.typeOfSaleId;
      // this.typeOfContact = d.typeOfContact;
      this.assignedStaff = new User(d.assignedStaff);
    }
  }

  public setEmpty() {
    this.customerType = null;
    this.typeOfSale = null;
    this.typeOfInvestment = null;
    this.catalog = null;
    this.assignedStaff = null;
    this.customerDateBinding = new Date();
  }

  public toJSON() {
    return {
      customerName: this.customerName ? this.customerName : null,
      customerTypeId: this.customerType ? this.customerType.id : null,
      typeOfInvestmentId: this.typeOfInvestment ? this.typeOfInvestment.id : null,
      customerStatus: this.customerStatus ? this.customerStatus : 0,
      customerDate: this.customerDateToJSON,
      catalogId: this.catalog ? this.catalog.id : null,
      address: this.address ? this.address : null,
      latitude: this.latitude,
      longitude: this.longitude,
      email: this.email ? this.email : null,
      phone: this.phone ? this.phone : null,
      position: this.position ? this.position : null,
      service: this.service ? this.service : null,
      typeOfSaleId: this.typeOfSale ? this.typeOfSale.id : null,
      // typeOfContactId: this.typeOfContact ? this.typeOfContact.id : null,
      contactName: this.contactName || null,
      assignedStaffId: this.assignedStaff ? this.assignedStaff.id : null,
    };
  }

  public gmapToJSON(): Marker {
    return {
      id: this.id,
      lat: this.latitude,
      lng: this.longitude,
      label: this.address,
      iconUrl: 'https://png.icons8.com/office/30/000000/administrator-male.png',
    };
  }
}
