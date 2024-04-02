import { DocumentType } from "@archivelayer/core";

export function defineDocumentType(constructor:()=>DocumentType) 
{
  const res = constructor();
  return res;
}