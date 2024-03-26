export function getValue<T>(input: T | (()=>T) ) {
  if(typeof input === 'function') {
    var iinput : any = input;
    return iinput();
  }
  return input;
}