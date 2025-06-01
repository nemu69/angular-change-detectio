import { ElementRef, Injectable, NgZone } from "@angular/core";
import { getPokemonName } from "pokemon.data";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { delay, delayWhen, distinctUntilChanged, take } from "rxjs/operators";
import { DelayedScheduler } from "./delayed-scheduler.service";

/**
 * Controls coloring of dirty checked components.
 */
@Injectable({ providedIn: "root" })
export class DirtyCheckService {
  private _clearColoring$ = new Subject<void>();
  private _autoClearColoring = true;
  private _busy$ = new BehaviorSubject<boolean>(false);

  private firstCheck = true;

  get isAutoClearColoring(): boolean {
    return this._autoClearColoring;
  }

  constructor(private _zone: NgZone, private _delayedScheduler: DelayedScheduler) {
    this._delayedScheduler.done$.pipe(take(1)).subscribe(() => {
      this.firstCheck = false;
    })
  }

  public clearColoring(): void {
    this._clearColoring$.next();
  }

  public setAutoClearColoring(autoClear: boolean): void {
    this._autoClearColoring = autoClear;

    if (autoClear) {
      this.clearColoring();
    }
  }

  public dirtyCheck(elementRef: ElementRef<HTMLElement>): void {
    this._busy$.next(true);
    this._zone.runOutsideAngular(() => {
      const element = elementRef.nativeElement;
      const cssClass = "dirty-check";
      this._delayedScheduler.schedule(() => {
        element.classList.add(cssClass);

        if (!this.firstCheck) {
          const pokemon = element.querySelector('img')!;
          const pokemonName = element.querySelector('.pokemon-name')!;

          pokemon.classList.add('fade-out');

          setTimeout(() => {
            const random = Math.floor(Math.random() * 299) + 1;
            pokemon.src = `/pokemons/${random}.svg`;
            pokemonName.textContent = getPokemonName(random);
            pokemon.classList.remove('fade-out');
          }, 500);
        }
      });

      if (this._autoClearColoring) {
        this._delayedScheduler.done$
          .pipe(
            take(1), // subscribe once
            delay(2000) // clear after 1s
          )
          .subscribe(() => {
            element.classList.remove(cssClass);
            this._busy$.next(false);
          });
      } else {
        this._delayedScheduler.done$
          .pipe(
            take(1), // subscribe once
            delayWhen(() => this._clearColoring$)
          )
          .subscribe(() => {
            element.classList.remove(cssClass);
            this._busy$.next(false);
          });
      }
    });
  }

  public get busy$(): Observable<boolean> {
    return this._busy$.asObservable().pipe(distinctUntilChanged());
  }
}
