import { Spec } from '~/lexer/Token';

import { runRexExp } from './_helpers';

//----------------------------------------------------------------------------//

describe('Lexer', () => {
  runRexExp('tag', {
    REGEXP: /<(?<tag>[\w:]+)[\s\S]*?>(?<content>[\s\S]*)?<\/\k<tag>*?>/,
    str: '<greetings>Hello World</greetings>',
  });

  runRexExp('tag with attributes', {
    REGEXP:
      /<(?<tag>[\w:]+)(?:(?<attributes>(\s(\w+)=(?:"(.+)"|'(.+)'))+)|[\s\S]*?)>(?<content>[\s\S]*)?<\/\k<tag>*?>/,
    str: '<greetings attr1="1" attr2=\'2\'>Hello World</greetings>',
  });

  runRexExp('tag with attributes and attributes without value', {
    REGEXP: Spec.Element[0],
    str: '<greetings attr1="1" attr2=\'2\' required>Hello World</greetings>',
  });

  runRexExp('read raw text', {
    REGEXP: Spec.RawText[0],
    str: `dasd><asdasdasdas$$%%^^^</`,
  });

  runRexExp('read cdata', {
    REGEXP: Spec.CData[0],
    str: `<![CDATA[dasd><asdasdasdas$$%%^^^]]>`,
  });
});
