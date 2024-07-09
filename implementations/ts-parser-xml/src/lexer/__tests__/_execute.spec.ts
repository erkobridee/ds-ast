import { ElementSpec, RawTextSpec, CDataSpec } from '~/lexer/Token';

//----------------------------------------------------------------------------//

const executeIt = (name: string, specFn: Function) => {
  it(name, () => {
    console.log('');
    specFn();
    console.log(`\n${'-'.repeat(80)}`);
  });
};

const executeRexExp = (
  name: string,
  { REGEXP, str }: { REGEXP: RegExp; str: string }
) => {
  executeIt(name, () => {
    const result = REGEXP.exec(str);
    console.log(result);

    const groups = result?.groups;
    groups && console.log('groups:', groups);
  });
};

//----------------------------------------------------------------------------//

describe('Lexer', () => {
  executeRexExp('tag', {
    REGEXP: /<(?<tag>[\w:]+)[\s\S]*?>(?<content>[\s\S]*)?<\/\k<tag>*?>/,
    str: '<greetings>Hello World</greetings>',
  });

  executeRexExp('tag with attributes', {
    REGEXP:
      /<(?<tag>[\w:]+)(?:(?<attributes>(\s(\w+)=(?:"(.+)"|'(.+)'))+)|[\s\S]*?)>(?<content>[\s\S]*)?<\/\k<tag>*?>/,
    str: '<greetings attr1="1" attr2=\'2\'>Hello World</greetings>',
  });

  executeRexExp('tag with attributes and attributes without value', {
    REGEXP: ElementSpec[0],
    str: '<greetings attr1="1" attr2=\'2\' required>Hello World</greetings>',
  });

  executeRexExp('read raw text', {
    REGEXP: RawTextSpec[0],
    str: `dasd><asdasdasdas$$%%^^^</`,
  });

  executeRexExp('read cdata', {
    REGEXP: CDataSpec[0],
    str: `<![CDATA[dasd><asdasdasdas$$%%^^^]]>`,
  });
});
