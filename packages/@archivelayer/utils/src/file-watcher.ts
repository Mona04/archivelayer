import fs from 'fs'

export class WatchFile
{
  mActionDone : {[key:string]:number} = {} 
  mPath = "";
  mCallback : (fileName:string) => void;
  constructor(path:string, callback:(fileName:string) => void)
  {
    this.mPath = path;
    this.mCallback = callback;
    fs.watch(path, {recursive: true}, this.watchCallback)
  }

  // https://stackoverflow.com/questions/67244227/watch-files-and-folders-recursively-with-node-js-also-get-info-whenever-change
  watchCallback : fs.WatchListener<string> = (eventName, fileName) => {
    var path = `${this.mPath}/${fileName}`;
    var stats = fs.statSync(path);
    let seconds = +stats.mtime;
    
    if(fileName === null) return;
    if(this.mActionDone[fileName] == seconds) return;
    this.mActionDone[fileName] = seconds

    this.mCallback(fileName);
  }
}