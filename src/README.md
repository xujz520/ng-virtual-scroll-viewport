# virtual-scroll-viewport 虚拟滚动

## API
```html
<virtual-scroll-viewport #viewport [list]="list" [itemSize]="30" style="height: 300px;">
  <ul>
    <li class="item" *ngFor="let item of viewport.vList" style="height: 30px;">{{item}}</li>
  </ul>
</virtual-scroll-viewport>
```


| 参数 | 说明 | 类型 | 默认值 |
| - | - | - | - |
| [list] | 列表数据源 | any[] | |
| [itemSize] | 行高 | number | |
| [maxBuffer] | 最大缓冲尺寸 | number | 默认为视口的高度 |
| [minBuffer] | 最小缓冲尺寸, 滚动时小于该值将更新视图 | number | 默认为视口高度的一半 |
| [disabled] | 是否禁用虚拟滚动 | boolean | false |
| (update) | 视图更新事件 | EventEmitter | |

## 原理
```html
<virtual-scroll-viewport (scroll)="updateVList()">
  <div class="virtual-scroll-content-wrapper" #wrapper style="margin-top: {{marginTop}}px;">
    <ng-content></ng-content>
  </div>
  <div class="virtual-scroll-content-spacer" [style.height.px]="totalHeight"></div>
</virtual-scroll-viewport>
```

* viewport 滚动视口(固定高度)
* contentwrapper 内容包裹层
* content-spacer 内容占位垫片 = itemSize * list.length
* list 原始数据
* vList 在视口展示的数据
* itemSize 行高(必须)
* maxBuffer 最大缓冲尺寸
* minBuffer 最小缓冲尺寸, 滚动时小于该值将更新视图 `vList`

```ts
// 滚动事件
updateVList() {
  // 标识是否需要更新
  needUpdate = false;
  if (内容向上滚动) {
    needUpdate = bottomBuffer(底部缓冲区) < minBuffer;
  } else {
    needUpdate = topBuffer(顶部缓冲区) < minBuffer;
  }
  if (!needUpdate) return;

  // 切割出需要展示的内容
  start = Math.max(scrollTop - maxBuffer, 0) / this.itemSize;
  end = (scrollTop + viewportClientHeight + maxBuffer) / this.itemSize;
  this.vList = this.list.slice(start, end);
  // 设置视口内容偏移
  this.marginTop = start * this.itemSize;
}
```

![](data:image/png;base64,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)