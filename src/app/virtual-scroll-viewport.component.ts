import { Component, ViewChild, ElementRef, Input, HostListener, OnChanges, ChangeDetectorRef, Output, EventEmitter, AfterViewInit, OnDestroy, ChangeDetectionStrategy, NgZone } from '@angular/core';

/**
 * 虚拟滚动组件
 * 
 * 尽量不要给 viewport 及其子节点设置 border、margin、padding 避免计算出错
 * 
 * 为什么不使用 translateY 代替 margin-top? 因为 translateY 导致 position: sticky 出现异常
 */

@Component({
  selector: 'virtual-scroll-viewport',
  template: `
    <div class="virtual-scroll-content-wrapper" #wrapper style="margin-top: {{marginTop}}px;">
      <ng-content></ng-content>
    </div>
    <div class="virtual-scroll-content-spacer" [style.height.px]="totalHeight"></div>
  `,
  styles: [`
    * {
      box-sizing: border-box;
    }
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: auto;
      position: relative;
      contain: content;
    }
    .virtual-scroll-content-wrapper {
      min-width: 100%;
      display: inline-block;
      vertical-align: middle;
      contain: content;
    }
    .virtual-scroll-content-spacer {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      z-index: -1;
    }
    :host:hover {
      will-change: scroll-position;
    }
    :host:hover .virtual-scroll-content-wrapper {
      will-change: contents, margin;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualScrollViewportComponent<T> implements OnChanges, AfterViewInit, OnDestroy {
  @Input() list: T[] = [];
  @Input() itemSize: number = null;
  @Input() maxBuffer: number = null;
  @Input() minBuffer: number = null;
  @Input() disabled = false;
  @Output() update = new EventEmitter();

  vList: T[] = [];
  totalHeight: number = null;
  lastScrollTop: number = null;
  marginTop: number = null;
  $resizeObserver: ResizeObserver = null;

  @ViewChild('wrapper') wrapper: ElementRef = null;

  constructor(private viewport: ElementRef, private cdr: ChangeDetectorRef, private ngZone: NgZone) { }

  ngOnChanges() {
    this.list = this.list || [];

    if (this.disabled) {
      this.vList = this.list;
      return;
    }

    requestAnimationFrame(() => {
      (this.viewport.nativeElement as HTMLElement).scrollTop = 0;
      this.lastScrollTop = null;
      this.updateVList();
    });
  }

  ngAfterViewInit() {
    this.$resizeObserver = new ResizeObserver((entries) => {
      this.ngZone.run(() => {
        let contentRect = entries[0].contentRect;
        if (!(contentRect.width || contentRect.height)) return;
        this.updateVList(true);
      });
    });
    this.$resizeObserver.observe(this.viewport.nativeElement);
  }

  ngOnDestroy() {
    this.$resizeObserver.disconnect();
  }

  @HostListener('scroll') onScroll() {
    if (!this.disabled) {
      this.updateVList();
    }
  }

  updateVList(force = false) {
    const scrollTop = (this.viewport.nativeElement as HTMLElement).scrollTop;

    if (!force && this.lastScrollTop === scrollTop) return;

    const wrapperRect = (this.wrapper.nativeElement as HTMLElement).getBoundingClientRect();
    const viewportRect = (this.viewport.nativeElement as HTMLElement).getBoundingClientRect();
    const viewportClientHeight = (this.viewport.nativeElement as HTMLElement).clientHeight;
    const viewportBorderWidth = (viewportRect.height - viewportClientHeight) / 2;
    const maxBuffer = this.maxBuffer || viewportRect.height;
    const minBuffer = this.minBuffer || viewportRect.height / 2;
    const topBuffer = viewportRect.top - wrapperRect.top + viewportBorderWidth;
    const bottomBuffer = wrapperRect.bottom - viewportRect.bottom + viewportBorderWidth;
    const needUpdate = (scrollTop >= this.lastScrollTop ? bottomBuffer : topBuffer) <= minBuffer;
    this.lastScrollTop = scrollTop;

    if (!force && !needUpdate) return;

    const start = Math.floor(Math.max(scrollTop - maxBuffer, 0) / this.itemSize);
    const end = Math.ceil((scrollTop + viewportClientHeight + maxBuffer) / this.itemSize);
    this.vList = this.list.slice(start, end);
    this.marginTop = start * this.itemSize;
    this.totalHeight = this.itemSize * this.list.length;

    requestAnimationFrame(() => this.update.emit());
    this.cdr.markForCheck();
  }

}
