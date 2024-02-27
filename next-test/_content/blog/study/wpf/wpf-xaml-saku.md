---
title: WPF Xaml 작성요령
date: 2015-05-28
---

## Override 로 쓸 필드는 Global Style 에 넣지 않는다.

넣어도 큰 문제는 되지 않지만 일반적으로 그렇게 쓰지않는다.

또한 현재 wpf disign mode 에서 레이아웃 관련된 필드가 적용이 안되는 버그가 있다. 

예를들어 다음을 살펴보자.

```xaml title="부모.xaml"
<Window x:Class="WpfApp1.MainWindow"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:local="clr-namespace:WpfApp1">
    <StackPanel>
        <local:SubControl/>
    </StackPanel>
</Window>

```

```xaml title="자식.xaml"
<UserControl x:Class="WpfApp1.SubControl"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation">
    <Grid>
        <ComboBox Width="10"/>
    </Grid>
</UserControl>
```

```App.xaml``` 에 Global Style 로 ```ComboBox``` 의 ```Width``` 를 지정해놓았다고 하자.

그러면 부모 컨트롤의 디자인 화면에는 Global Style 의 ```Width``` 가 적용된 것으로 나온다. 