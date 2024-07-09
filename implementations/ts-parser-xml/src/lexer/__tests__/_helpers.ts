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

interface IRegexpItOptions {
  name?: string;
  maxRegExpLength?: number;
  regexp: RegExp;
  input: string;
  check: (result: RegExpExecArray | null) => void;
}

export const regexpIt = (options: IRegexpItOptions) => {
  const { name, regexp, maxRegExpLength = 50, input, check } = options;
  const truncateRegExt = new RegExp(`/(.{${maxRegExpLength}})..+/`);
  const regexpStr = regexp.toString().replace(truncateRegExt, '$1 …');
  const regexpDisplay = `RegExp( ${regexpStr} )`;
  const itName = name ? `${name} - ${regexpDisplay}` : regexpDisplay;
  it(itName, () => {
    const result = regexp.exec(input);
    check(result);
  });
};
