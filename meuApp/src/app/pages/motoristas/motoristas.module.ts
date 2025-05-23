import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotoristasPage } from './motoristas.page';

const routes: Routes = [
  {
    path: '',
    component: MotoristasPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MotoristasPage
  ]
})
export class MotoristasPageModule {}
