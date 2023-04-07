export const CODE_CHAR_TEMPLATE = 'abcdefghijklmnopqrstuvwxyz1234567890';

export type GenerateCodeOptions = {
  length: number;
  affix?: string;
  prefix?: string;
  template?: string;
};

export const generateCode = ({
  length = 10,
  affix,
  prefix,
  template,
}: GenerateCodeOptions): string => {
  let code = '';
  const characters = template || CODE_CHAR_TEMPLATE;
  for (let i = 0; i < length; i += 1) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  if (affix) {
    code = `${affix.toLowerCase()}-${code}`;
  }

  if (prefix) {
    code = `${code}-${prefix.toLowerCase()}`;
  }

  return code;
};
