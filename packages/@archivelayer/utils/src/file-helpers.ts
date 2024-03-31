import fs from 'fs'
import {minimatch} from 'minimatch'

export function isFilePathMatchPattern(filePath:string, pattern:string) {
  return minimatch(filePath, pattern)
}