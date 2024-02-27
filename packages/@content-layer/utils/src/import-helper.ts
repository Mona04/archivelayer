//import module from 'module'

export function requireFromString(src : string, filename : string) {
    var m = module.constructor();
    m.paths = module.paths;
    m._compile(src, filename);
    return m.exports;
  }