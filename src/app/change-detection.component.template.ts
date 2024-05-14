export function template(children: string = ''): string {  
  return `
        {{touch}}
     <!--   <button class="toggle-visibility" #toggle_visiblity (click.outside)="onToggleVisibility()">-</button>-->
        <header>
        <span>
        <span class="tag strategy-box {{cdStrategyName}}">{{cdStrategyName}}</span>
        </span>
        <span>     
        <span class="tag" #ng_marked></span>
        </span>
        </header>
        <div #component class="component">
          <div class="action-wrapper">
            <div>
              <span  class="tag ng-on-changes-box" #ng_on_changes_box>ngOnChanges</span>
              <span class="tag cd-state-box" #cd_state_box ></span>
            </div>
                  
            <div style="height: 120px; padding: 10px;">
              <img style="height: 100%; width: 100%;" [src]="'pokemons/' + pokemon() + '.svg'" />
            </div>

            <div class="action">
              <select #action_list>
                <option value="click">Click</option>
                <option value="detach">Detach</option>
                <option value="attach">Attach</option>
                <option value="signal">Increment signal</option>
                <option value="dc">Detect changes</option>
                <option value="mfc">Mark for check</option>
              </select>
              <button title="Execute selected action" #execute_button text="▶️">▶️</button>
              <button #hidden_button style="display:none" (click)="onClick()"></button>
            </div>
          </div>
          <div class="children">
            ${children} <!-- view-children -->
            <ng-content></ng-content> <!-- content-children -->
          </div>
        </div>`;
}
