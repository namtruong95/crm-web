import { Component, OnInit } from '@angular/core';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { PolicyModalCeFolderComponent } from '../policy-modal-ce-folder/policy-modal-ce-folder.component';
import { Folder } from 'models/folder';
import { FolderService } from 'shared/services/folder.service';
import { Router } from '@angular/router';
import { PolicyModalDeleteFolderComponent } from '../policy-modal-delete-folder/policy-modal-delete-folder.component';
import { NotifyService } from 'shared/utils/notify.service';
import * as cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-policy-manage-folder',
  templateUrl: './policy-manage-folder.component.html',
  styleUrls: ['./policy-manage-folder.component.scss'],
})
export class PolicyManageFolderComponent implements OnInit {
  public folders: Folder[] = [];
  public isLoading = false;

  constructor(
    private _modalService: BsModalService,
    private _folderSv: FolderService,
    private _router: Router,
    private _notify: NotifyService,
  ) {}

  ngOnInit() {
    this._getListFolders();
  }

  public showFolder(folder: Folder) {
    this._router.navigate(['/ssm/policy/folders', folder.id]);
  }

  private _getListFolders() {
    this.isLoading = true;
    this._folderSv.getListFolder().subscribe(
      (res) => {
        this.folders = res;
        this.isLoading = false;
      },
      (errors) => {
        this._notify.error(errors);
        this.isLoading = false;
      },
    );
  }

  public createFolder() {
    const config: ModalOptions = {
      initialState: {
        folder: new Folder(),
      },
    };
    this._openModal(PolicyModalCeFolderComponent, config);
  }

  editFolder(folder: Folder) {
    const config: ModalOptions = {
      initialState: {
        folder: cloneDeep(folder),
      },
    };
    this._openModal(PolicyModalCeFolderComponent, config);
  }

  removeFolder(folder: Folder) {
    const config: ModalOptions = {
      initialState: {
        folder,
      },
    };
    this._openModal(PolicyModalDeleteFolderComponent, config);
  }

  private _openModal(comp, config?: ModalOptions) {
    const subscribe = this._modalService.onHidden.subscribe((reason: string) => {
      subscribe.unsubscribe();
      if (reason === 'reload') {
        this._getListFolders();
      }
    });

    this._modalService.show(comp, config);
  }
}
