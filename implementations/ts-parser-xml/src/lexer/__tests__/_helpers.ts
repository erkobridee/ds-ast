import { truncate } from '~/utils/text';
import { Spec } from '~/lexer/Token';

//----------------------------------------------------------------------------//

export const runIt = (name: string, specFn: Function) => {
  it(name, () => {
    console.log('');
    specFn();
    console.log(`\n${'-'.repeat(80)}`);
  });
};

export const runRexExp = (
  name: string,
  { REGEXP, str }: { REGEXP: RegExp; str: string }
) => {
  runIt(name, () => {
    const result = REGEXP.exec(str);
    console.log(result);

    const groups = result?.groups;
    groups && console.log('groups:', groups);
  });
};

//----------------------------------------------------------------------------//

type TCheckFn = (result: RegExpExecArray | null) => void;

interface IRegexpItOptions {
  name?: string;
  maxRegExpLength?: number;
  regexp: RegExp;
  input: string;
  check: TCheckFn;
}

export const regexpIt = (options: IRegexpItOptions) => {
  const { name, regexp, maxRegExpLength = 50, input, check } = options;
  const regexpStr = truncate(regexp.toString(), maxRegExpLength);
  const regexpDisplay = `RegExp( ${regexpStr} )`;
  const itName = name ? `${name} - ${regexpDisplay}` : regexpDisplay;
  it(itName, () => {
    const result = regexp.exec(input);
    check(result);
  });
};

interface INamedRegexpItOptions {
  name: string;
  maxRegExpLength?: number;
  input: string;
  check: TCheckFn;
}

export const namedRegexpIt = (options: INamedRegexpItOptions) => {
  const { name, ...rest } = options;
  const regexp = Spec[name][0];
  return regexpIt({ name, regexp, ...rest });
};
