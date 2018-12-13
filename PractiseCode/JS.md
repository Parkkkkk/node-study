## Javascript ( scope , Execution Context , hoisting , closure , IIFE)

### Scope

---

```
var x = 'park'		    	//전역변수
function ex() {
  var x = 'jin';		//지역변수
  x = 'change';
}
ex()				// x를 바꾸기 시도
alert(x);			// 여전히 'park'

```

지역변수는 아무리 해도 전역변수에 영향을 끼칠 수 없다. 이것이 함수 스코프 때문이다.

다른 예로

```
var x = 'park'
function ex() {
 x = 'jin';			// var을 선언하지 않음
}
ex()
alert(x);

```

위 코드에서는 x 호출시에 전역변수가 바뀌게 되는데 자바스크립트는 변수의 범위를 호출한 함수의 지역 스코프부터 전역 변수들이 있는 전역 스코프까지 점차 넓혀가며 찾기 때문이다.

함수 ex의 범위 안에 x가 없기 때문에 더 넓은 범위인 전역 스코프에서 찾게 되는것이다.



#### - Lexical Scoping

스코프는 함수를 호출할 때가 아니라 선언할 때 생긴다. 그래서 정적 스코프라고도 불립니다.

```
var name = 'park';
function log() {
	console.log(name);
}
function wrapper() {
	var name = 'jin';
	log();
}
wrapper();

```

위에 실행 결과는 'park'이다 

다시 정리하자면 , 함수를 처음 선언하는 순간, 함수 내부의 변수는 자기 스코프로부터 가장 가까운 곳에 있는 변수를 계속 참조하게 된다. 위의 예시에서는 log 함수 안의 name 변수는 선언 시 가장 가까운 전역변수 name을 참조하기 때문에 log를 호출해도 지역변수 name = 'jin'을 참조하는것이 아니라 그대로 전역 변수 name 의 값인 park이 나오는것이다.



### Context

---

코드를 실행 하는 순간 모든 것을 포함하는 전역 컨텍스트가 생기게 된다. 모든것을 관리 하는 환경이고 페이지가 종료될때까지 유지된다. 그리고 함수를 호출할 때마다 함수 컨텍스트가 하나씩 더 생기게 된다.



### Hosting

---

호이스팅이란 변수를 선언하고 초기화했을 때 선언 부분이 최상단으로 끌어 올려지는 현상을 의미한다.



```
ex();

function ex() {
    console.log('jin');
}
```



### Closure

---

클로저는 스코프 , 컨텍스트 , 비공개 변수와 함수의 관계를 항상 같이 말해주어야한다.

먼저 클로저를 활용한 유명한 카운터 예제를 봐보자

```
var counter = function() {
  var count = 0;
  function changeCount(number) {
    count += number;
  }
  return {
    increase: function() {
      changeCount(1);
    },
    decrease: function() {
      changeCount(-1);
    },
    show: function() {
      alert(count);
    }
  }
};
var counterClosure = counter();   
counterClosure.increase();
counterClosure.show(); // 1
counterClosure.decrease();
counterClosure.show(); // 0

```

counter 함수는 호출 시 return을 통해 CounterClosure 컨텍스트에 비공개 변수인 count에 접근할 수 있는 scope chain을 반환하게 된다.



####  -For문 + 이벤트 리스너

For문에 이벤트 리스너를 사용한다고 했을때 **클로저**를 사용하지 않는다 하면

```
for ( var i = 0 ; i < 5 ; i++ ) {
	$('#target' + 1).on('click', function () {
	   alert(i);
	});
}
```

위 코드에서 이벤트 리스너에 i는 lexical scoping에 따라 외부에 i를 계속 참조 하게 되어 결국 alert 결과가 모두 5가 된다.

해결 방법은 **IIFE( 즉시 호출 함수 표현식 )** 을 사용하여 **클로저**를 만들어 주면된다.

```
for ( var i = 0; i < 5 ; i++ ) {
	(function (j) {
	  $('#target' + j ).on('click', function() {
		alert(j);
	});
  })(i);
}

```

이와 같이 코드를 작성하면 j 값은 i 에 해당하는 숫자로 고정된다.



### IIFE( 즉시 호출 함수 표현식 )

---

```
(function () {} ) ();
```

먼저 IIFE를 사용하는 주된 이유는 **변수를** **전역으로** **선언하는** **것을** **피하기** **위함**이라고 한다.



IIFE를 보기전에 함수의 선언 (Function Declaration)과 함수의 표현 (Function Expression)의 차이점에 대해 이해할 팔요가 있다니 살펴보자.

#### - 함수의 선언과 표현

함수 선언(declaration)은 미리 자바 스크립트의 실행 컨텍스트(execution context)에 로딩 되어 있으므로 언제든지 호출할 수 있지만, 표현식 (Expression)은 인터프리터가 해당 라인에 도달 하였을 때만 실행이 된다. 



간단한 예로 

```
foo();		//success!
function foo() {
	alert('foo');
}

foo();		// "foo" is not defined.
var foo = function () {
	alert('foo');
}
```

를 보면 되겠다.



IIFE 예제 코드를 바로 살펴보면

```
( function () { 
	var firstName = 'park';
	funciton init () {
		doStuff ( firstName );
	}

	function doStuff () {
		// blabla
	}
	
	function doMoreStuff () {
		//blabla
	}

	init ();
}) ();

```

함수를 괄호로 감싸고 마지막에 ()를 통해서 즉시 호출되는것!

