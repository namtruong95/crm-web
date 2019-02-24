import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerMapComponent } from './customer-map.component';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { environment } from 'environments/environment';

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
  declarations: [CustomerMapComponent],
  exports: [CustomerMapComponent],
})
export class CustomerMapModule {}
