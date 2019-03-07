import { Component, OnInit } from '@angular/core';
import { Folder } from 'models/folder';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotifyService } from 'shared/utils/notify.service';
import { FolderService } from 'shared/services/folder.service';

@Component({
  selector: 'app-policy-modal-ce-folder',
  templateUrl: './policy-modal-ce-folder.component.html',
  styleUrls: ['./policy-modal-ce-folder.component.scss'],
})
export class PolicyModalCeFolderComponent implements OnInit {
  public folder: Folder;
  public isLoading = false;

  constructor(
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _notify: NotifyService,
    private _folderSv: FolderService,
  ) {}

  ngOnInit() {}

  createOrUpdateFolder() {
    if (this.folder.id) {
      this._updateFolder();
      return;
    }

    this._createFolder();
  }

  private _createFolder() {
    this.isLoading = true;
    this._folderSv.createFolder(this.folder.toJSON()).subscribe(
      (res) => {
        this.close('reload');
        this.isLoading = false;
        this._notify.success('create folder success');
      },
      (errors) => {
        this.isLoading = false;
      },
    );
  }

  private _updateFolder() {
    this.isLoading = true;
    this._folderSv.updateFolder(this.folder.id, this.folder.toJSON()).subscribe(
      (res) => {
        this.close('reload');
        this.isLoading = false;
        this._notify.success('update folder success');
      },
      (errors) => {
        this.isLoading = false;
      },
    );
  }

  public close(reason?: string) {
    this._modalService.setDismissReason(reason);
    this._bsModalRef.hide();
  }
}
