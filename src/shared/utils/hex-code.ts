// java String#hashCode
const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // tslint:disable-next-line:no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

export const hexCode = (i: string): string => {
  // tslint:disable-next-line:no-bitwise
  const c = (hashCode(i) & 0x00ffffff).toString(16).toLowerCase();

  return '00000'.substring(0, 6 - c.length) + c;
};
