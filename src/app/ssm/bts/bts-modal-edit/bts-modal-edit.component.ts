import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Bts } from 'models/bts';
import { MapsAPILoader } from '@agm/core';
import { NotifyService } from 'shared/utils/notify.service';
import { EventEmitterService } from 'shared/utils/event-emitter.service';
import { BtsService } from 'shared/services/bts.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-bts-modal-edit',
  templateUrl: './bts-modal-edit.component.html',
  styleUrls: ['./bts-modal-edit.component.scss'],
})
export class BtsModalEditComponent implements OnInit {
  @ViewChild('Address')
  private _address: ElementRef;

  public bts: Bts = new Bts();
  public isLoading = false;

  constructor(
    private _mapsAPILoader: MapsAPILoader,
    private _ngZone: NgZone,
    private _notify: NotifyService,
    private _emitter: EventEmitterService,
    private _btsSv: BtsService,
    private _bsModalRef: BsModalRef,
    private _modalService: BsModalService,
  ) {}

  ngOnInit() {
    this._initAutoCompleteGmap();
  }

  private _initAutoCompleteGmap() {
    this._mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this._address.nativeElement, {
        types: ['address'],
      });

      autocomplete.addListener('place_changed', () => {
        this._ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.bts.address = place.formatted_address;
          this.bts.latitude = place.geometry.location.lat();
          this.bts.longitude = place.geometry.location.lng();
        });
      });
    });
  }

  public updateBts() {
    this.isLoading = true;

    this._btsSv.updateBTS(this.bts.id, this.bts.toJSON()).subscribe(
      (res) => {
        this._notify.success('updated BTS success');
        this.bts = new Bts();
        this.isLoading = false;
        this.close('reload');
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
