export function template(children: string = ''): string {
  return `
    {{ touch() }}
    <table style="display: none">
      <tr><th>input value:</th><td class="input-value">{{inputByVal}}</td></tr>
      <tr><th>object prop:</th><td class="input-value">{{inputByRef.value}}</td></tr>
      <tr><th>observable:</th><td class="input-value">{{inputObservableValue}}</td></tr>
      <tr><th>local signal:</th><td class="input-value">{{signal()}}</td></tr>
    </table>

    <header>
      <span>
        <span class="tag strategy-box {{ cdStrategyName }}">{{ cdStrategyName }}</span>
      </span>
      <span>
        <span class="tag" #ng_marked></span>
      </span>
    </header>
    <div #component class="component">
      <div class="action-wrapper">
        <div style="margin-top: 4px;">
          <span class="tag ng-on-changes-box" #ng_on_changes_box>ngOnChanges</span>
          <span class="tag cd-state-box" #cd_state_box></span>
        </div>

        <div>
          <div style="height: 100px; padding: 10px;">
            <img class="transition-img" style="view-transition-name: pokemon-image; height: 100%; width: 100%" [src]="'pokemons/' + pokemon() + '.svg'" />
          </div>

          <div style="margin: 10px 0;">
            <span class="pokemon-name" style="view-transition-name: pokemon-title; text-align: center; font-weight: 600; text-transform: capitalize;">{{ pokemonName() }}</span>
          </div>
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
          <button #hidden_button style="display: none" (click)="onClick()"></button>
        </div>
      </div>
      <div class="children">
        ${children}
        <!-- view-children -->
        <ng-content></ng-content>
        <!-- content-children -->
      </div>
    </div>
  `;
}
