import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtsMapComponent } from './bts-map.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'environments/environment';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: environment.gm_api_key,
      libraries: ['places'],
      apiVersion: '3.31',
    }),
    AgmSnazzyInfoWindowModule,
  ],
  declarations: [BtsMapComponent],
  exports: [BtsMapComponent],
})
export class BtsMapModule {}
