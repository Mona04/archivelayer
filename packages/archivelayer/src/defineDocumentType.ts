import { DocumentType } from "@archivelayer/utils";

export function defineDocumentType(constructor:()=>DocumentType) {
  const res = constructor();

  return res;
}