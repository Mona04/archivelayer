/**
 * 함수 또는 값을 받아서 값은 그냥 넘기고 함수는 함수 리턴값을 내놓는 편의성 함수
 * @param input 
 * @returns 
 */
export function getValue<T>(input: T | (()=>T) ) : T {
  if(typeof input === 'function') {
    var iinput : any = input;
    return iinput();
  }
  return input;
}