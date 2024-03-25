export const getValue = (input: object|{():object}) => {
  return (typeof input === 'function') ? input() : input;
}