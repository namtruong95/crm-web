import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './timeline.component';
import { Routes, RouterModule } from '@angular/router';
import { TimelineListModule } from './timeline-list/timeline-list.module';
const routes: Routes = [
  {
    path: '',
    component: TimelineComponent,
    children: [
      {
        path: 'list',
        loadChildren: './timeline-tree/timeline-tree.module#TimelineTreeModule',
      },
      {
        path: 'create',
        loadChildren: './timeline-create/timeline-create.module#TimelineCreateModule',
      },
      {
        path: '**',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), TimelineListModule],
  declarations: [TimelineComponent],
})
export class TimelineModule {}
