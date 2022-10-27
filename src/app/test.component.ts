import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-test',
  template: `
  <virtual-scroll-viewport #viewport [list]="list" [itemSize]="30" style="width: 300px; height: 300px; background: antiquewhite;">
    <ul>
      <li class="item" *ngFor="let item of viewport.vList">{{item.index}}</li>
    </ul>
  </virtual-scroll-viewport>
  `,
  styles: [
    `
    ul {
      margin: 0;
    }

    li {
      height: 30px;
      line-height: 30px;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent {
  list = [];

  constructor() {
    this.list = Array(50).fill(null).map((v, i) => ({ index: i + 1 }));
  }
}
