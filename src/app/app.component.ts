import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <br>

    <ul class="nav nav-tabs">
      <li routerLinkActive="active">
        <a routerLink="test">测试</a>
      </li>
      <li routerLinkActive="active">
        <a routerLink="table">表格</a>
      </li>
      <li routerLinkActive="active">
        <a routerLink="content-visibility">原生代替方案</a>
      </li>
    </ul>

    <br>

    <router-outlet></router-outlet>
  `
})
export class AppComponent { }
