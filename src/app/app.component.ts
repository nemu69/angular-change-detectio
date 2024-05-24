import {AfterViewInit, ApplicationRef, Component, DestroyRef, effect, ElementRef, Inject, inject, NgZone, OnInit, Renderer2, viewChild, ViewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Subject} from 'rxjs';

import {DirtyCheckService} from './dirty-check.service';
import {NumberHolder} from './number-holder';
import {WarningService} from './warning.service';
import { AppModule } from './app.module';
import { ENABLE_ZONELESS } from 'src/main';
import { toCanvas } from 'qrcode';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    AppModule,
  ]
})
export class AppComponent implements OnInit, AfterViewInit {
  private destroyRef = inject(DestroyRef);

  private value = 0;
  public inputByVal!: number;
  public inputByRef = new NumberHolder();
  public inputObservable = new Subject<number>();

  private _apptickButton = viewChild.required<ElementRef<HTMLButtonElement>>('apptick_button');
  private _timeoutButton = viewChild.required<ElementRef<HTMLButtonElement>>('timeout_button');
  private _clickButton = viewChild.required<ElementRef<HTMLButtonElement>>('click_button');
  private _triggerChangeButton = viewChild.required<ElementRef<HTMLButtonElement>>('trigger_change');
  private _clearButton = viewChild.required<ElementRef<HTMLButtonElement>>('clear');
  private _inputValueField = viewChild.required<ElementRef<HTMLInputElement>>('input_value_field');
  private _propagateByValueCheckbox = viewChild.required<ElementRef<HTMLInputElement>>('propagate_by_value_checkbox');
  private _propagateByRefCheckbox = viewChild.required<ElementRef<HTMLInputElement>>('propagate_by_ref_checkbox');
  private _propagateByObservableCheckbox = viewChild.required<ElementRef<HTMLInputElement>>('propagate_by_observable_checkbox');
  private _propagateInZoneCheckbox = viewChild.required<ElementRef<HTMLInputElement>>('propagate_in_zone_checkbox');
  private _autoClearCheckbox = viewChild.required<ElementRef<HTMLInputElement>>('auto_clear');
  private _canvas = viewChild.required<ElementRef<HTMLInputElement>>('qrcode_canvas');

  enableZoneless = localStorage.getItem(ENABLE_ZONELESS) === "1";

  renderer = inject(Renderer2);

  constructor(
      private _zone: NgZone,
      private _appRef: ApplicationRef,
      private _dirtyCheckColoringService: DirtyCheckService,
      private _warningService: WarningService,
  ) {
    effect(() => {
      this._zone.runOutsideAngular(() => {
        this.renderer.listen(this._autoClearCheckbox().nativeElement, 'click', this.onAutoCheckboxChange.bind(this));
        this.renderer.listen(this._clearButton().nativeElement, 'click', this.onClear.bind(this));
        this.renderer.listen(this._timeoutButton().nativeElement, 'click', this.onTimeout.bind(this));
      });
    });
  }

  ngOnInit(): void {
    toCanvas(this._canvas().nativeElement, window.location.href , function(error) {
      if (error) console.error(error)
        console.log('success!');
    });
  }

  toggleZoneless(): void {
    localStorage.setItem(ENABLE_ZONELESS, this.enableZoneless ? '0' : '1');
    window.location.reload();
  }

  onTick() {
      this._dirtyCheckColoringService.clearColoring();
      this._appRef.tick();
      this._warningService.hideWarning();
    }

    onTimeout() {
      setTimeout(() => {
        this._warningService.hideWarning();
        this._zone.run(() => console.log(`setTimeout(...)`));
      }, 3000);
    }

    onClear() {
      this._warningService.hideWarning();
      this._dirtyCheckColoringService.clearColoring();
    }

    clickNoop(): void {
      console.log(`click`);
    }

    onAutoCheckboxChange(event: Event) {
      const element = event.target as HTMLInputElement;
      this._dirtyCheckColoringService.setAutoClearColoring(element.checked);
    }

    onChange() {
      this._dirtyCheckColoringService.clearColoring();
      if (this.isPropagateInZone()) {
        this._zone.run(() => this.updateInputValue());
      } else {
        this.updateInputValue();
      }
    }

    public ngAfterViewInit(): void {
      this._dirtyCheckColoringService.setAutoClearColoring(this.isAutoClear());

      // Busy
      this._dirtyCheckColoringService.busy$.pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((busy) => {
            this._apptickButton().nativeElement.disabled = busy;
            this._timeoutButton().nativeElement.disabled = busy;
            this._clickButton().nativeElement.disabled = busy;
            this._autoClearCheckbox().nativeElement.disabled = busy;
            this._triggerChangeButton().nativeElement.disabled = busy;
            this._propagateByValueCheckbox().nativeElement.disabled = busy;
            this._propagateByRefCheckbox().nativeElement.disabled = busy;
            this._propagateByObservableCheckbox().nativeElement.disabled = busy;
            this._propagateInZoneCheckbox().nativeElement.disabled = busy;
            if (busy && !this._dirtyCheckColoringService.isAutoClearColoring) {
              this._clearButton().nativeElement.classList.add('emphasize');
            } else {
              this._clearButton().nativeElement.classList.remove('emphasize');
            }
          });
    }


    private updateInputValue(): void {
      this.value++;
      if (this.isPropagateByValue()) {
        this.inputByVal = this.value;
      }
      if (this.isPropagateByRef()) {
        this.inputByRef.value = this.value;
      }
      if (this.isPropagateByObservable()) {
        this.inputObservable.next(this.value);
      }

      // Update DOM directly because outside Angular zone to not trigger change
      // detection
      const valueElement = this._inputValueField().nativeElement;
      valueElement.innerHTML = this.value.toString(10);
    }

    private isAutoClear(): boolean {
      return !!this._autoClearCheckbox().nativeElement.checked;
    }

    private isPropagateByValue(): boolean {
      return this._propagateByValueCheckbox().nativeElement.checked;
    }

    private isPropagateByRef(): boolean {
      return this._propagateByRefCheckbox().nativeElement.checked;
    }

    private isPropagateByObservable(): boolean {
      return this._propagateByObservableCheckbox().nativeElement.checked;
    }

    private isPropagateInZone(): boolean {
      return this._propagateInZoneCheckbox().nativeElement.checked;
    }
}
