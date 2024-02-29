---
title: Attached Property VS Behavior
date: 2015-05-28
---

## 차이점

WPF Attached Property 는 WPF Control 에 추가적인 기능을 넣기위해 사용된다. 
``` Microsoft.Xaml.Behaviors.Behavior``` 역시 마찬가지이며 내부적으론 Attached Property 로 구현되어 있다. 그래서 둘은 별개가 아니다.

그럼 왜 Behavior 가 사용되는걸까? 

1. Attached Property 는 Static 변수나 함수를 필요로 해서 멤버변수 같은 클래스의 이점을 사용할 수 없다.
2. Unsubscribe 를 위해서 많은 코드다발이 필요하다. 이를 까먹으면 메모리 누수가 발생한다.
3. 편의기능을 구현할 수 있다. 예를들어 Attached Property 만으로는 드래그 앤 드랍으로 Behavior 추가같은 편의 기능을 구현할 수 없지만, Behavior 는 Collections 으로 관리되고 Subscribe / Unsubscribe 를 호출할 수 있어서 가능하다.



## 참고자료

[BRIAN NOYES' BLOG](https://web.archive.org/web/20180208143035/http://briannoyesblog.azurewebsites.net/2012/12/20/attached-behaviors-vs-attached-properties-vs-blend-behaviors/)