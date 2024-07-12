import { Lexer } from '~/lexer';
import { TAbstractSyntaxTree } from '~/parser/AST';

import { AbstractStatesMachine } from './AbstractStatesMachine';
import { StatesMachineXML } from './StatesMachineXML';
import { StatesMachineHTML } from './StatesMachineHTML';

//----------------------------------------------------------------------------//

export enum AvailableStatesMachine {
  XML = 'XML',
  HTML = 'HTML',
}

//----------------------------------------------------------------------------//

/**
 * The State Machine that will generate the AST
 *
 * It supports XML or HTML
 */
export class StatesMachine extends AbstractStatesMachine {
  private statesMachine?: AbstractStatesMachine;

  constructor(
    lexer: Lexer,
    type: AvailableStatesMachine = AvailableStatesMachine.XML
  ) {
    super(lexer);
    this.setStatesMachineType(type);
  }

  private setStatesMachine(statesMachine: AbstractStatesMachine) {
    this.statesMachine = statesMachine;
  }

  private setStatesMachineType(type: AvailableStatesMachine) {
    switch (type) {
      case AvailableStatesMachine.XML:
        this.setStatesMachine(new StatesMachineXML(this.lexer));
        break;
      case AvailableStatesMachine.HTML:
        this.setStatesMachine(new StatesMachineHTML(this.lexer));
        break;
    }
  }

  public start(): TAbstractSyntaxTree {
    return this.statesMachine!.start();
  }
}

export default StatesMachine;
