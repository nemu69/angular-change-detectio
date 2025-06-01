import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AbstractChangeDetectionComponent } from "../abstract-change-detection.component";
import { template } from "../change-detection.component.template";
import { ColorService } from "../color.service";

const NAME = "comp-1-x-4";
const LEVEL = 3;
const CD_STRATEGY = ChangeDetectionStrategy.OnPush;
const CHILD_TEMPLATE = `
  <app-comp-1-x-4-1 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-4-1>
  <app-comp-1-x-4-2 [inputByVal]="inputByVal" [inputByRef]="inputByRef" [inputObservable]="inputObservable"></app-comp-1-x-4-2>
`;

@Component({
    selector: `app-${NAME}`,
    template: template(CHILD_TEMPLATE),
    styleUrls: ["./../change-detection.component.scss"],
    providers: [ColorService],
    changeDetection: CD_STRATEGY,
    standalone: false
})
export class Comp_1_x_4_Component extends AbstractChangeDetectionComponent {
  constructor() {
    super(NAME, LEVEL, CD_STRATEGY);
  }
}
