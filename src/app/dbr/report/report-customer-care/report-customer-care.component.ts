import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-customer-care',
  templateUrl: './report-customer-care.component.html',
  styleUrls: ['./report-customer-care.component.scss'],
})
export class ReportCustomerCareComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  public exportReportCustomerCare(event: any) {
    console.log(event);
  }
}
