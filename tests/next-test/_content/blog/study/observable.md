---
title: Observable 에 관한 메모
date: 2023-09-26
tags: [c#]
---


## Hot Stream / Cold Stream


``` c# title="hot stream"

using System.Collections.Concurrent;
using System.Reactive.Concurrency;
using System.Reactive.Disposables;
using System.Reactive.Linq;
using System.Reactive.Subjects;

namespace Test;

public class HotStream<T> : IDisposable
{
    public ConcurrentQueue<T> Queue { get; } = new ConcurrentQueue<T>();
    public IObservable<T> Stream => mStream;

    private readonly AutoResetEvent mDequeueEvent = new AutoResetEvent(false);
    private readonly CancellationTokenSource mCancelToken = new CancellationTokenSource();
    private readonly IConnectableObservable<T> mStream;

    public HotStream(IScheduler? scheduler = null)
    {
        var baseStream = Observable.Create<T>(o =>
        {
            while (mCancelToken.IsCancellationRequested == false)
            {
                mDequeueEvent.WaitOne();
                while (Queue.TryDequeue(out T? result) && !mCancelToken.IsCancellationRequested)
                {
                    o.OnNext(result);
                }
            }
            o.OnCompleted();
            return Disposable.Empty;
        });

        if (scheduler == null) scheduler = new EventLoopScheduler();
        mStream = baseStream.SubscribeOn(scheduler).Publish();
        mStream.Connect();
    }
    public void OnNext()
    {
        mDequeueEvent.Set();
    }

    bool bDisposed = false;
    public void Dispose()
    {
        if (bDisposed == false)
        {
            bDisposed = true;
            mCancelToken.Cancel();
            mDequeueEvent.Set();
            Queue.Clear();
        }
    }
}
```

위는 ```Publish()```, ```Connect()``` 를 이용해 구현한 간단한 Hot Stream 이다. ```Publish()``` 는 내부적으로 ```Subject<T>``` 를 사용했고 사실 ```Subject<T>``` 가 Hot Stream 이기도 하다. 그래서 ```Subject<T>``` 만 써도 된다. 하지만 ```Publish()``` 특징을 보이기 위해서 위 코드를 들고왔다.

Hot Stream 은 구독 전에 호출한 ```OnNext()``` 를 무시하며 바로바로 보내는 것이 특징이다.

그래서 다음과 같은 결과를 보인다.

```c# title="input"
var stream = new HotStream<string>();
stream.Queue.Enqueue("1");
stream.OnNext();
Thread.Sleep(1000); // thread 변환까지의 딜레이를 고려
stream.Stream.Subscribe(s=>Console.WriteLine($"1 => {s}"));
stream.Stream.Subscribe(s=>Console.WriteLine($"2 => {s}"));
for (int i = 2; i < 5; i++)
    stream.Queue.Enqueue(i.ToString());
stream.OnNext();
```

```plaintext title="output"
1 => 2
2 => 2
1 => 3
2 => 3
1 => 4
2 => 4
```

만약 ```Publish()``` 를 사용하지 않았다면 어떨까?

```plaintext title="output"
1 => 1
1 => 2
1 => 3
1 => 4
```

위는 Cold Stream 의 두가지 특징을 가지고 있다. 
1. ```Subscribe()``` 하기 전의 값이 살아있다. 이는 ```Subscribe()``` 시점에 Observable Sequence 가 값을 넣기 시작하기 때문이다.
2. 1번 구독자만 살아있다가 끝난다. 왜냐하면 위 구현에서는 ```Observable``` 내부의 루프가 끝나지 않아서 다음 ```Observer``` 에게 순서가 가지 않기 때문이다. 만약 가더라도 queue 내부는 비워서 아무일도 안할 것이다.


이러한 특징 때문에 요구사항에 맞는 stream 을 쓰는게 중요하다. ui 등 가장 최신 값이 필요하면 Hot Stream 을 사용한다던지 말이다.



### Hot Stream 다른 구현 버전

``` c# title="hot stream"
public class HotStream : IDisposable
{
    public IObservable<T?> Stream<T>() where T : class => mSource.Where(v => v is T)!.Cast<T?>();

    private readonly IDisposable mSourceToken;
    private readonly IConnectableObservable<object?> mSource;
    private readonly CancellationTokenSource mCancelToken;
    private readonly BlockingCollection<object?> mQueue = new();
    
    public MixStream(IScheduler? scheduler = null)
    {
        scheduler ??= new EventLoopScheduler();
        this.mCancelToken = new CancellationTokenSource();

        var baseStream = Observable.Create<object>(observer =>
        {
            while (this.mCancelToken.IsCancellationRequested == false)
            {
                while (this.mQueue.TryTake(out object? result) && !this.mCancelToken.IsCancellationRequested)
                {
                    observer.OnNext(result);
                }
            }
            observer.OnCompleted();
            return Disposable.Create(() =>
            {
                Console.WriteLine("Stream End");
            });
        });

        mSource = baseStream.SubscribeOn(scheduler).Publish();
        mSourceToken = this.mSource.Connect();
    }
    public void OnNext(object? message)
    {
        this.mQueue.TryAdd(message);
    }
    public void Dispose()
    {
        mSourceToken.Dispose();
        mCancelToken.Dispose();
    }    
}
```

```BlockingCollection<>``` 을 사용한 버전이다. 



## SubscribeOn vs ObserveOn

``` c#
    IObservable<int> observable = Observable.Create<int>(r =>
        {
            // SubscribeOn() 에서 스케듈러가 적용되는 부분
            r.OnNext(1);
            return Disposable.Empty;
        })
        .ObserveOn(new EventLoopScheduler())
        .SubscribeOn(new EventLoopScheduler());
    observable.Subscribe(_ =>
    {
        // ObserveOn() 에서 스케듈러가 적용되는 부분
    });
```

```ObserveOn()``` 은 Subscriber 가 등록한 Callback 이 호출될 Scheduler 를 정한다. 기본은 ```OnNext()``` 가 호출되는 CallStack 에서 Callback 이 호출됨을 염두에 두자.

```SubscribeOn()``` 은 Cold Stream 에 ```Subscribe()``` 를 할 때 Sequence 가 만들어지는 스케듈러를 바꾼다. 그래서 만약 ```Publish()```/```Connect()``` 를 쓰면 적용되지 않는다.





## 참고자료

[msdn IConnectableObservable\<T\> Interface](https://learn.microsoft.com/en-us/previous-versions/dotnet/reactive-extensions/hh211887(v=vs.103))