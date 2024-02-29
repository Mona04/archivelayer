---
title: "Make a Blog using NextJS"
date: 2023-06-21
description: "Hello World"   
tags: [settings]
#
---


## 기본설정

### Type Script

1. ```tsconfig.json```


2. ```global.d.ts```
  + scss 인식을 못하면 ```declare module '*.scss';``` 를 추가해보자.


### 주의사항

App Router 와 Page Router 에서 지원되는 기능도 다르고 공식 문서도 분리되어 있다. 예를들어 ```getStaticProps()```  같은 Data Fetch 작업은 Page Router 에서는 작동하지 않는다. 

style module 에서 클래스 이름에 ```-``` 가 들어간다면 ```MyModule["aaa-bbb"]``` 이렇게 직접 써야한다. gatsby 처럼 자동으로 ```MyModule.aaaBBB``` 로 만들어 주지 않는다.

### Style

external css 가 scss 에서 ```@import``` 하면 적용이 안된다. ```<Link>``` 를 쓰던가 css 로 하면 된다. ```@import``` 가 순서대로 하나씩 로딩하는거라 시간이 걸린다고 하지만 유지관리 하기가 불편해서 그냥 css 로 했다.
