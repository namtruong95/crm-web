import { Component, OnInit } from '@angular/core';
import { Policy } from 'models/policy';
import { PolicyService } from 'shared/services/policy.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotifyService } from 'shared/utils/notify.service';
import { Folder } from 'models/folder';
import { FolderService } from 'shared/services/folder.service';

@Component({
  selector: 'app-policy-modal-delete-folder',
  templateUrl: './policy-modal-delete-folder.component.html',
  styleUrls: ['./policy-modal-delete-folder.component.scss'],
})
export class PolicyModalDeleteFolderComponent implements OnInit {
  public isLoading = false;
  public folder: Folder;

  constructor(
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
    private _folderSv: FolderService,
    private _notify: NotifyService,
  ) {}

  ngOnInit() {}

  public removeFolder() {
    this.isLoading = true;

    this._folderSv.deleteFolder(this.folder.id).subscribe(
      (res) => {
        this._notify.success('delete folder successs');
        this.close('reload');
        this.isLoading = false;
      },
      (errors) => {
        this.isLoading = false;
        this._notify.error(errors);
      },
    );
  }

  public close(reason?: string) {
    this._modalService.setDismissReason(reason);
    this._bsModalRef.hide();
  }
}
