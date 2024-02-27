---
title: "Make a Blog using NextJS"
date: 2023-06-21
description: Hello World 
---

## 필요한 기능


### 블로그 포스트 관련

1. Markdown / MDX 를 사용할 예정이다.

2. 블로그 포스트를 Category 별로 표시하여 사이드 메뉴에 표시해야한다.

3. Post Title, Content, Tag 및 Category 로 검색기능이 필요하다.

4. 코드를 이쁘게 나오게 하고 싶다.

5. 수식 표현을 위해 latex 지원이 필요하다.



### 페이지 관련

1. 다크모드가 필요하다.

2. 밑에 가장 최근에 블로그를 업데이트한(빌드한) 시간을 표시하고 싶다. 

3. 블로그 글 목록은 Grid 형식이고 스크롤을 내릴 때마다 나타낼때 서서히 나타나는 효과가 있었으면 좋겠다. [ex](https://blog.itcode.dev/comments)



### 기타

+ 공부상태 이쁘게 표현해서 화면에 띄우고 싶다. 
+ 영작용 포스트 페이지가 필요하다. 한글 / 영어 이렇게 나오게 하고 싶다.
+ open ai api 를 이용해서 뭐 하나 만들고 싶다.



## 프레임워크

### 웹 개발 프레임워크

[SSG 프레임워크 성능 비교](https://css-tricks.com/comparing-static-site-generator-build-times/)

react 를 써보고 싶어 gatsby 랑 nextjs 중에 고민했는데 컴파일 속도보고 nextjs 로 정했다.


### CSS 프레임워크

[Tailwind 장단점](https://ykss.netlify.app/translation/the_pros_and_cons_of_tailwindcss/)

[TailwindCSS 사용기](https://fe-developers.kakaoent.com/2022/220303-tailwind-tips/)


### CMS

내가 필요한 기능은 markdown hot reload 와 검색기능을 위한 전체 데이터 최적화이다. 

결론부터 말하면 나는 그냥 [ContentLayer](https://www.contentlayer.dev/)를 쓰기로 했다. 
글을 쓰는 2023.07 에는 아직 베타버전이라 버그도 많지만 내가 필요한 기능이 모두 있고 nextjs 공식 사이트에서 지원한다고 적혀져 있어 이후 지원도 기대할 수 있기 때문이다.

이전에 내가 고려한 것은  [next remote watch](https://github.com/hashicorp/next-remote-watch) 였는데 next.js 12 버전까지 지원하고 이후는 소식이 뚝 끊겨있었다. 
그래서 내가 직접 파일변경 이벤트를 받아오고 nextjs hot reload api 를 호출하려고 했는데 이게 private api 라 숨겨져있었고 찾을 수 없었다. 
나중에 보니까 ```next/router``` 를 사용하던데 자세히는 모르겠다.

### Search Framework

[rhostem 의 커스텀 검색](https://blog.rhostem.com/posts/2018-08-23-blog-search)

[lunrjs](https://lunrjs.com/)



## Content

### Syntax Highlight

Contentlayer 에서 rehype 관련 모듈을 넣어줄 수가 있다.

많이 사용되는 것으로는
[Rehype Highlight](https://www.npmjs.com/package/rehype-highlight), 
[Rehype Prism Plus](https://www.npmjs.com/package/rehype-prism-plus), 
[Rehype Pretty Code](https://rehype-pretty-code.netlify.app/)
가 있엇는데 난 마지막 것을 선택했다.
+ server side 에서 미리 파싱하는 특성 상 html 용량이 조금 나가지만 더 빠르다.
+ 줄/단어 하이라이트 같은 부가 기능도 붙어있고 커스터마이즈도 편하다.
+ 문서도 잘되어있어서 Rehype Prism Plus 대신 써보았다. 

#### Copy 버튼

요즘 Code Block 은 Copy 버튼이 붙어있다. 이를 구현하기 위해서 [claritydev blog](https://claritydev.net/blog/copy-to-clipboard-button-nextjs-mdx-rehype) 를 참고하여 구현하였다.

```unist-util-visit``` 을 이용해서 code 가 parse 되기 전에 원본 데이터를 따로 저장해둔다는 것이 핵심이다.
+ 성능 차이가 궁금해서 포스트 1000개로 테스트도 해봤다.```Measure-Command { start-process npm 'run contentlayer build' -wait}``` 를 사용했는데 전처리/후처리 여부는 결과에 큰 영향을 주지 않았다.

이렇게 저장한 데이터를 실질적으로 복사하는 부분을 ```<script>``` 를 통해서 Copy 를 구현했다. markdown 에도 적용하고 싶었기 때문에 react 를 쓸 수 없었기 때문이다.



### Latex

```MathJax``` 는 [NextJS hydration issue](https://github.com/remarkjs/remark-math/issues/80) 가 현재 블로그를 만드는 시점에 있다. 

markdown 은 처음부터 html 로 바꿔서 문제가 없는데 mdx 은 바뀐 결과물이 react 문법과 겹쳐서 그런가 문제가 생긴다.

그래서 mdx 는 ```katex``` 를 사용했다.



### TOC



### 



## Issue

ContentLayer 가 table 을 parse 하지 않아서 ```remark-gfm``` 을 사용했는데 ```4.0.0``` 버전에서는 에러가 뜬다. ```3.x``` 버전에는 잘 동작하고 있다.