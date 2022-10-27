import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { VirtualScrollViewportComponent } from './virtual-scroll-viewport.component';

import { TestComponent } from './test.component';
import { TableComponent } from './table.component';
import { ContentVisibilityComponent } from './content-visibility.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'table' },
  { path: 'test', component: TestComponent },
  { path: 'table', component: TableComponent },
  { path: 'content-visibility', component: ContentVisibilityComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    VirtualScrollViewportComponent,
    TestComponent,
    TableComponent,
    ContentVisibilityComponent,
  ],
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  bootstrap: [AppComponent],
})
export class AppModule {}
