import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { QueryBuilder } from 'shared/utils/query-builder';
import { NotifyService } from 'shared/utils/notify.service';
import { UploaderService } from 'shared/services/uploader.service';
import { RoleService } from 'app/role.service';
import { ManageFileService } from 'shared/services/manage-file.service';
import { ManagePdf } from 'models/manage-pdf';

@Component({
  selector: 'app-policy-manage-pdf',
  templateUrl: './policy-manage-pdf.component.html',
  styleUrls: ['./policy-manage-pdf.component.scss'],
})
export class PolicyManagePdfComponent implements OnInit {
  @ViewChild('FileUpload')
  private _fileUpload: ElementRef;

  public query: QueryBuilder = new QueryBuilder();
  public files: ManagePdf[] = [];

  public isUploading = false;

  private _mimeTypes = ['application/pdf', '.pdf'];

  public get accept_file(): string {
    return this._mimeTypes.toString();
  }

  constructor(
    private _notify: NotifyService,
    private _uploader: UploaderService,
    public role: RoleService,
    private _manageFileSv: ManageFileService,
  ) {}

  ngOnInit() {
    this._getFiles();
  }

  private _getFiles() {
    const opts = {
      ...this.query.queryJSON(),
    };
    this._manageFileSv.getFiles(opts).subscribe(
      (res) => {
        this.query.setQuery(res);
        this.files = res.list;
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }

  public getFile() {
    const files = this._fileUpload.nativeElement.files;
    if (files.length === 0) {
      return;
    }

    const data: any[] = [];

    Array.from(files).forEach((file: File) => {
      // Validator File Type
      if (this._mimeTypes.indexOf(file.type) < 0) {
        this._notify.error('You can not upload files that are not in pdf format');
        return;
      }

      // Validator File Size
      if (file.size >= 10485760) {
        this._notify.error('You can not upload images larger than 10MB in size');
        return;
      }

      data.push({
        key: 'file',
        value: file,
      });
    });

    this.isUploading = true;

    this._uploader.store(`manage-file`, data).subscribe(
      (res) => {
        this.isUploading = false;
        this._notify.success(`upload ${data.length} files success`);
        this._getFiles();
        this._removeFile();
      },
      (errors) => {
        this.isUploading = false;
        this._notify.error(errors);
        this._removeFile();
      },
    );
  }

  private _removeFile() {
    this._fileUpload.nativeElement.value = null;
  }

  public downloadFile(file: ManagePdf) {
    this._manageFileSv.downloadFile(file.id).subscribe(
      (res) => {
        const pdf = 'data:application/octet-stream;base64,' + res.data.data.data;
        const dlnk = document.createElement('a');
        dlnk.href = pdf;
        dlnk.download = res.data.data.fileName;
        dlnk.click();
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }

  public removeFile(file: ManagePdf) {
    this._manageFileSv.deleteFile(file.id).subscribe(
      (res) => {
        this._notify.success(`delete file success`);
        this._getFiles();
      },
      (errors) => {
        this._notify.error(errors);
      },
    );
  }

  public pageChanged(event) {
    this.query.currentPage = event.page;
    this._getFiles();
  }
}
