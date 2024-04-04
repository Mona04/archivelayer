import {
  requireConfigs, 
  FileWatcher,
  listFiles
} from '@archivelayer/utils'

import {
  ArchiveLayerConfigs, 
  ArchiveManager, 
} from '@archivelayer/core'

import chalk from 'chalk';

export async function Startup() 
{
  const configs = await requireConfigs<ArchiveLayerConfigs>();
  
  if(configs.sourcePath === undefined) return;
  
  const archiveManager = new ArchiveManager();
  archiveManager.initialize(configs);
  
  const watcher = new FileWatcher(
    configs.sourcePath, 
    (fileName)=>{archiveManager.fileUpdated(fileName)},
    (fileName)=>{archiveManager.fileRemoved(fileName)}
  ); 
}

export async function Build()
{
  const configs = await requireConfigs<ArchiveLayerConfigs>();
  
  if(configs.sourcePath === undefined) return;

  const archiveManager = new ArchiveManager();
  archiveManager.initialize(configs);

  listFiles(
    configs.sourcePath, 
    async (fileName)=>{await archiveManager.fileUpdated(fileName)},
    (delta)=>{ console.log(chalk.green(`Finish to build archives !!!! It takes ${delta} m/s\n\n`))} );
}