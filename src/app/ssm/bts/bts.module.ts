import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtsComponent } from './bts.component';
import { Routes, RouterModule } from '@angular/router';
import { BtsMapModule } from './bts-map/bts-map.module';
import { BtsListModule } from './bts-list/bts-list.module';
import { AgmCoreModule } from '@agm/core';
import { environment } from 'environments/environment';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

const routes: Routes = [
  {
    path: '',
    component: BtsComponent,
    children: [
      {
        path: 'filters',
        loadChildren: './bts-filter/bts-filter.module#BtsFilterModule',
      },
      {
        path: 'create',
        loadChildren: './bts-create/bts-create.module#BtsCreateModule',
      },
      {
        path: '',
        redirectTo: 'filters',
        pathMatch: 'full',
      },
    ],
  },
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BtsMapModule,
    BtsListModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: environment.gm_api_key,
      libraries: ['places'],
      apiVersion: '3.31',
    }),
    AgmSnazzyInfoWindowModule,
  ],
  declarations: [BtsComponent],
})
export class BtsModule {}
