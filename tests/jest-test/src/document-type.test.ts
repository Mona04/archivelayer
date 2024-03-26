import {isFilePathMatchPattern} from "@archivelayer/utils"

describe('DocumentType Test', () => {
    it('File Path Pattern Test', () => {
      expect(isFilePathMatchPattern("aaa/aa/ab.md", "**/*.md")).toBeTruthy();
      expect(isFilePathMatchPattern("aaa/aa/ab.mdx", "**/*.md")).toBeFalsy();
    })
  })