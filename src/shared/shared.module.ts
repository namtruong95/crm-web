import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from './services/api.service';
import { HttpModule } from '@angular/http';
import { NotifyService } from './utils/notify.service';
import { ToastrModule } from 'ngx-toastr';
import { EventEmitterService } from './utils/event-emitter.service';
import { UploaderService } from './services/uploader.service';
import { HttpClientModule } from '@angular/common/http';
import { DownloadService } from './services/download.service';
import { GmapService } from './services/gmap.service';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { environment } from 'environments/environment';
import { KeyCloakService } from './services/kc.service';
import { KeyCloakApiService } from './services/kc-api.service';

@NgModule({
  imports: [
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      enableHtml: true,
    }),
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: environment.gm_api_key,
      libraries: ['places'],
      apiVersion: '3.31',
    }),
    AgmSnazzyInfoWindowModule,
  ],
  providers: [
    ApiService,
    KeyCloakApiService,
    DownloadService,
    KeyCloakService,
    GmapService,
    NotifyService,
    EventEmitterService,
    UploaderService,
  ],
})
export class SharedModule {}
