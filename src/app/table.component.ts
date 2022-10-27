import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import * as Mock from 'mockjs';

@Component({
  selector: 'app-table',
  template: `
    <div class="table-container">
      <virtual-scroll-viewport #viewport [list]="list" [itemSize]="40" (update)="activeFixedColumn()" (scroll)="onScroll()" class="{{xScrollbarPosition}}">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th *ngFor="let column of columns" class="{{column.className}}" [ngStyle]="column.style">{{column.title}}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of viewport.vList; trackBy: trackBy">
              <td *ngFor="let column of columns" class="{{column.className}}" [ngStyle]="column.style">
                <ng-container *ngIf="column.field !== '#btn' else btn">{{data[column.field]}}</ng-container>
                <ng-template #btn>
                  <button type="button" class="btn btn-xs btn-primary">编辑</button>&nbsp;
                  <button type="button" class="btn btn-xs btn-danger">删除</button>
                </ng-template>
              </td>
            </tr>
          </tbody>
        </table>
      </virtual-scroll-viewport>
    </div>

    <br>
    tip: 缩小屏幕测试固定列水平滚动
  `,
  styles: [
  `
  .table-container virtual-scroll-viewport {
    max-height: 400px;
    border: 1px solid #ddd;
  }
  .table-container .table {
    margin: 0;
    white-space: nowrap;
    border-collapse: separate;
  }
  .table-container thead tr th {
    position: sticky;
    top: 0px;
    background: #fff;
    z-index: 1;
  }
  .table-container thead tr th.sticky-left {
    z-index: 2;
  }
  .table-container tbody tr:first-child td {
    border-top: 0;
  }
  .table-container th ~ th, 
  .table-container td ~ td {
    border-left: 1px solid #ddd;
  }
  
  .sticky-left {
    position: sticky;
    background: #fff;
    left: 0;
  }
  .sticky-right {
    position: sticky;
    background: #fff;
    right: 0;
  }
  .x-scrollbar-in-start .sticky-right,
  .x-scrollbar-in-middle .sticky-right {
    box-shadow: -6px 0 6px 0 rgb(0 0 0 / 10%);
  }
  .x-scrollbar-in-end .sticky-left,
  .x-scrollbar-in-middle .sticky-left {
    box-shadow: 6px 0 6px 0 rgb(0 0 0 / 10%);
  }

  .table-container virtual-scroll-viewport {
    overflow: hidden;
    z-index: 1;
  }
  .table-container virtual-scroll-viewport:hover {
    overflow: overlay;
  }
  .table-container virtual-scroll-viewport::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .table-container virtual-scroll-viewport::-webkit-scrollbar-thumb {
    background: rgb(0 0 0 / 30%);
    border-radius: 4px;
  }
  .table-container virtual-scroll-viewport::-webkit-scrollbar-track,
  .table-container virtual-scroll-viewport::-webkit-scrollbar-corner {
    background: rgb(0 0 0 / 6%);
  }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  columns = [
    { title: '#', field: 'id', className: 'sticky-left', style: { width: '55px', 'min-width': '55px', 'text-align': 'center' } },
    { title: '姓名', field: 'name', className: 'sticky-left', style: { left: '55px' } },
    { title: '学号', field: 'no' },
    { title: '性别', field: 'sex' },
    { title: '年龄', field: 'age' },
    { title: '学院', field: 'college' },
    { title: '专业', field: 'major' },
    { title: '班级', field: 'class' },
    { title: '入学时间', field: 'entranceTime' },
    { title: '奖学金', field: 'scholarship' },
    { title: '社团', field: 'club' },
    { title: '操作项', field: '#btn', className: 'sticky-right' },
  ];

  list = [];
  lastScrollLeft: number = null;
  xScrollbarPosition: string = null;
  @ViewChild('viewport', { read: ElementRef }) viewportElementRef: ElementRef = null;

  constructor() {
    const total = 5000;
    this.list = Mock.mock({
      [`data|${total}`]: [{
        "id|+1": 1,
        "no|+1": 7107320614,
        "name": "@cname",
        "sex|1": ['男', '女'],
        "age|18-30": 18,
        "college|1": ['物联网工程学院', '外语外贸学院', '土木工程学院'],
        "major|1": ['软件工程', '网络工程', '人工智能', '商务英语', '国际贸易实务', '国际邮轮乘务管理', '工程造价', '建筑工程技术', '工程造价管理'],
        "class|1-5": 1,
        "entranceTime": () => Mock.mock('@date("yyyy/MM/dd HH:mm:ss")'),
        "scholarship|8000-20000": 0,
        "club": () => ["民乐", "摄影", "骑行", "电竞"].slice(0, Mock.mock('@integer(0, 3)')),
        "remark": "<mark>HTML</mark><em>备注</em>",
        "status|0-1": 0,
      }]
    }).data;
  }

  trackBy(index, rowData) {
    return index;
  }

  onScroll() {
    const scrollLeft = (this.viewportElementRef.nativeElement as HTMLElement).scrollLeft;
    if (this.lastScrollLeft === scrollLeft) return;
    this.lastScrollLeft = scrollLeft;
    this.activeFixedColumn();
  }

  activeFixedColumn() {
    this.xScrollbarPosition = null;
    const scrollLeft = Math.round((this.viewportElementRef.nativeElement as HTMLElement).scrollLeft);
    const scrollWidth = Math.round((this.viewportElementRef.nativeElement as HTMLElement).scrollWidth);
    const clientWidth = Math.round((this.viewportElementRef.nativeElement as HTMLElement).clientWidth);

    if (scrollWidth <= clientWidth) return;

    switch (true) {
      case scrollLeft === 0: {
        this.xScrollbarPosition = 'x-scrollbar-in-start';
        break;
      }
      case [scrollWidth, scrollWidth - 1, scrollWidth + 1].includes(scrollLeft + clientWidth): {
        this.xScrollbarPosition = 'x-scrollbar-in-end';
        break;
      }
      default: {
        this.xScrollbarPosition = 'x-scrollbar-in-middle';
        break;
      }
    }
  }
}
