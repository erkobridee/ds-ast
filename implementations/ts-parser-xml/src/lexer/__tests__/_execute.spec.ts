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
    console.log(REGEXP.exec(str));
  });
};

describe('Lexer', () => {
  executeRexExp('tag', {
    REGEXP: /<(?<tag>[\w:]+)[\s\S]*?>(?<content>[\s\S]*)?<\/\k<tag>*?>/,
    str: '<greetings>Hello World</greetings>',
  });

  executeRexExp('tag', {
    REGEXP:
      /<(?<tag>[\w:]+)(?:(?<attributes>(\s(\w+)=(?:"(.+)"|'(.+)'))+)|[\s\S]*?)>(?<content>[\s\S]*)?<\/\k<tag>*?>/,
    str: '<greetings attr1="1" attr2=\'2\'>Hello World</greetings>',
  });
});
