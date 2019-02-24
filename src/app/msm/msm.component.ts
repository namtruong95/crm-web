import { Component, OnInit } from '@angular/core';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-msm',
  templateUrl: './msm.component.html',
  styleUrls: ['./msm.component.scss'],
})
export class MsmComponent implements OnInit {
  constructor(public role: RoleService) {}

  ngOnInit() {}
}
