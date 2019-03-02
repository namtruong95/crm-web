import { CustomerType } from './customer-type';
import { TypeOfInvestment } from './type-of-investment';
import { CustomerClassification } from './customer-classification';
import * as moment from 'moment';
import { Marker } from 'interfaces/maker';
import { User } from './user';
import { BaseModelInterface, BaseModel } from './base.model';
import { Deserializable } from 'shared/interfaces/deserializable';

interface CustomerInterface extends BaseModelInterface {
  customerName: string;
  address: string;
  catalog: CustomerClassification;
  contactName: string;
  customerDate: string;
  customerDateBinding: Date;
  customerDateFormat: string;
  customerStatus: string;
  customerType: CustomerType;
  customerTypeId: number;
  email: string;
  latitude: number;
  longitude: number;
  phone: string;
  position: string;
  service: string;
  typeOfInvestment: TypeOfInvestment;
  typeOfInvestmentId: number;
  typeOfSale: CustomerClassification;
  typeOfSaleId: number;
  assignedStaff: User;
}

export class Customer extends BaseModel implements Deserializable<Customer> {
  customerName: string;

  private _address: string;
  public get address(): string {
    return this._address;
  }
  public set address(v: string) {
    this._address = (v || '').split(';')[0];
  }
  get has_address(): boolean {
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

  contactName: string;

  customerDate: string;
  public get customerDateToJSON(): string {
    return moment(this.customerDate).format('YYYY-MM-DD');
  }

  private _customerDateBinding: Date;
  public get customerDateBinding(): Date {
    return this._customerDateBinding;
  }
  public set customerDateBinding(v: Date) {
    this._customerDateBinding = new Date(v);
  }

  customerDateFormat: string;

  customerStatus: string;
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

  customerTypeId: number;
  email: string;
  latitude: number;
  longitude: number;
  phone: string;
  position: string;
  service: string;

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

  typeOfInvestmentId: number;

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

  typeOfSaleId: number;

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

  constructor() {
    super();
    this.customerType = new CustomerType();
    this.typeOfInvestment = new TypeOfInvestment();
    this.typeOfSale = new CustomerClassification();
    this.customerDateBinding = new Date();
    this.catalog = new CustomerClassification();
    this.assignedStaff = new User();
    this.address = '';
  }

  deserialize(input: Partial<CustomerInterface>): Customer {
    super.deserialize(input);

    Object.assign(this, input);

    this.customerDateBinding = new Date(input.customerDate);

    this.typeOfInvestment =
      input.typeOfInvestment instanceof TypeOfInvestment
        ? input.typeOfInvestment
        : new TypeOfInvestment().deserialize(input.typeOfInvestment);

    this.typeOfSale =
      input.typeOfSale instanceof CustomerClassification
        ? input.typeOfSale
        : new CustomerClassification().deserialize(input.typeOfSale);

    this.catalog =
      input.catalog instanceof CustomerClassification
        ? input.catalog
        : new CustomerClassification().deserialize(input.catalog);

    this.customerType =
      input.customerType instanceof CustomerType
        ? input.customerType
        : new CustomerType().deserialize(input.customerType);

    this.assignedStaff =
      input.assignedStaff instanceof User ? input.assignedStaff : new User().deserialize(input.assignedStaff);

    return this;
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
