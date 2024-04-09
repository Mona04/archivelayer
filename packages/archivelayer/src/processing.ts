import {
  FileWatcher,
  listFiles
} from '@archivelayer/utils'

import {  
  requireConfigs, 
  ArchiveLayerConfigs, 
  ArchiveManager, 
} from '@archivelayer/core'

import chalk from 'chalk';

export async function Startup(baseFolder?:string|null) 
{
  const configs = await requireConfigs(baseFolder);

  if(configs.sourcePath === undefined) return;
  
  const archiveManager = new ArchiveManager();
  archiveManager.initialize(configs);
  
  listFiles(
    configs.sourcePath, 
    async (fileName)=>{await archiveManager.registFile(fileName)},
    (delta)=>{ 
      console.log(chalk.green(`Intialized to watch archives !!!! It takes ${delta} m/s\n\n`))  
      const watcher = new FileWatcher(
        configs.sourcePath, 
        (fileName)=>{archiveManager.fileUpdated(fileName)},
        (fileName)=>{archiveManager.fileRemoved(fileName)}
      ); 
    });
}

export async function Build(baseFolder?:string|null)
{
  const configs = await requireConfigs(baseFolder);
  
  if(configs.sourcePath === undefined) return;

  const archiveManager = new ArchiveManager();
  archiveManager.initialize(configs);

  listFiles(
    configs.sourcePath, 
    async (fileName)=>{await archiveManager.fileUpdated(fileName)},
    (delta)=>{ console.log(chalk.green(`Finish to build archives !!!! It takes ${delta} m/s\n\n`))} );
}