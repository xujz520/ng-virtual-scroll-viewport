import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-content-visibility',
  template: `
    <ul class="ul" #ul style="width: 300px; height: 300px; background: antiquewhite;">
      <li class="item" *ngFor="let item of list">{{item.index}}</li>
    </ul>

    <br>

    <button (click)="test(ul)">测试优化是否生效</button> (视口之外元素的内容是否为空)

    <hr>
    <h4>content-visibility 使用的注意事项</h4>
    <ul>
      <li>只是不显示子节点, 父元素本身依然存在</li>
      <li>对 table tr 无效</li>
      <li>视口外的静态资源依然会被加载(&lt;img src="xxx"&gt;)</li>
    </ul>
  `,
  styles: [
    `
    .ul {
      margin: 0;
      list-style: none;
      overflow: auto;
    }

    .ul > li {
      height: 30px;
      line-height: 30px;
      content-visibility: auto;
      contain-intrinsic-size: 30px;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentVisibilityComponent {
  list = [];

  constructor() {
    this.list = Array(500).fill(null).map((v, i) => ({ index: i + 1 }));
  }

  test(ul: HTMLElement) {
    ul.scrollTop = 0;
    setTimeout(() => {
      alert((ul.lastElementChild as HTMLElement).innerText === '');
    }, 40);
  }
}
