//https://nextjs.org/docs/pages/building-your-application/optimizing/testing#setting-up-jest-with-the-rust-compiler

const nextJest = require('next/jest');
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const config = async () => {

  const input = {
    // 'use client' 같은 next 문법을 사용하기 위해
    testEnvironment: 'jest-environment-jsdom',

    /*
    testEnvironmentOptions: {
      // https://stackoverflow.com/questions/60535438/add-and-execute-scripts-react-testing-library-and-jest
      resources: 'usable',
      runScripts: 'dangerously',
    },
    */

    // compilerOptions.baseUrl 추가
    moduleDirectories: ['node_modules', 'src'], 
  }

  /**
   * createJestConfig() 에서 생성한걸 하드코딩해서 사용하려면 몇가지 수정을 해야한다.
   * 1. compilerOptions.paths 를 moduleNameMapper 에 추가한다.
   * 왜 createJestConfig() 를 사용하면 이 작업이 필요없는지는 모르겠다.
   */
  const ret = await createJestConfig(input)();

  /**
   * contentlayer 가 es6 이라서 transform 을 시켜줘야한다.
   * 근데 input 에서 추가하면 맨 뒤에 붙어서, 기본적으로 있는 '/node_modules/' 에 의해 무효화되어 따로 추가한다.
   */
  ret.transformIgnorePatterns = [
    '/node_modules/(?!(contentlayer|@contentlayer))',
    '^.+\\.module\\.(css|sass|scss)$',
  ];

  return ret;
};

module.exports = config;

// https://www.daleseo.com/react-testing-library/