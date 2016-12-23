# InmutableJS
InmutableJS is a library from Facebook that provides a series of inmutable data structures. They are always immutable. The reference to them can change but the data inside of them cannot which means you can build predictable and reliable state models. 
We use ImmutableJS in Talk and it becomes really easy to manage Talk’s application state. [Immutable.js](https://facebook.github.io/immutable-js/)

More about Immutable Data and React: 
[React.js Conf 2015 - Immutable Data and React - YouTube](https://www.youtube.com/watch?v=I7IdS-PbEgI&feature=youtu.be)

## Why ImmutableJS?
- __Immutable Data is faster__
* Tracking mutation and Maintaining state is difficult
* Encourages you to think differently about how data flows through your application

## Getting Started
ImmutableJS API is pretty expense. We will try to cover the basics and more to show its power.

ImmutableJS provides many Persistent Immutable data structures including: `List()`, `Stack()`, `Map()`, `OrderedMap()`, `Set()`, `OrderedSet()` and `Record()`.

We will cover the most common data structures. `Map()` , `List()` and `Record()`  and also we will describe the behaviour of `Seq()` with `Range()`


## Map()
- [Map()](https://facebook.github.io/immutable-js/docs/#/Map)
	* Read values
		* [get()](https://facebook.github.io/immutable-js/docs/#/Map/get)
		* [has()](https://facebook.github.io/immutable-js/docs/#/Map/has)
		* [first()](https://facebook.github.io/immutable-js/docs/#/Map/first)
		* [last()](https://facebook.github.io/immutable-js/docs/#/Map/last)
	* Read deep values
		* [getIn()](https://facebook.github.io/immutable-js/docs/#/Map/getIn)
	* Change Values
		- [set()](https://facebook.github.io/immutable-js/docs/#/Map/set)
		* [merge()](https://facebook.github.io/immutable-js/docs/#/Map/merge)
		* [update()](https://facebook.github.io/immutable-js/docs/#/Map/update)
		* [clear()](https://facebook.github.io/immutable-js/docs/#/Map/clear)
		* [delete()](https://facebook.github.io/immutable-js/docs/#/Map/delete)
	* Change deep values
		* [setIn()](https://facebook.github.io/immutable-js/docs/#/Map/getIn)
	* Conversion to JavaScript types
		* [toJS()](https://facebook.github.io/immutable-js/docs/#/Map/toJS)
		* [toArray()](https://facebook.github.io/immutable-js/docs/#/Map/toArray)
		* [toObject](https://facebook.github.io/immutable-js/docs/#/Map/toObject)
	* Member
		* [size](https://facebook.github.io/immutable-js/docs/#/Map/size)

		
Creates a new Immutable Map.  An Object graph. [Map - Immutable.js](https://facebook.github.io/immutable-js/docs/#/Map)

```js

const data = {
	‘one’: {
		title: ‘One’,
		value: 1
	},
	‘two’: {
		title: ‘Two’,
		value: 2
	}
}

let map = Inmutable.Map(data)
```

### get()
Returns the value associated with the provided key, Since inmutable data cannot be mutated they create a new reference to the new data.
[get() - Immutable.js](https://facebook.github.io/immutable-js/docs/#/Map/get)

```js
map.get(‘one’).title
```


```js
let obj = { 1: “one” };
Object.keys(obj); // [ “1” ]
obj[“1”]; // “one”
obj[1];   // “one”

let map = Map(obj);
map.get(“1”); // “one”
map.get(1);   // undefined
```

### getIn()
To get data from a deeply nested structure.
[getIn() - Immutable.js](https://facebook.github.io/immutable-js/docs/#/Map/getIn)

*With a Map()*
```js

let map = Inmutable.Map({
	title: ‘Todo One’,
	text: ‘Do todo’
	category: {
		title: ‘Some category’,
		order: 1
	}
})

map.getIn([‘category’, ‘title’]) // ‘Some Category’

```

### length - size
To get the size of a Map() or a List()
```js
map.size
```

### set()
```js
map.set(‘three’, {title: ‘three’, value: 3})
```

### delete()
```js
map.delete(‘three’, {title: ‘three’, value: 3})
```

### update()
```js
map.update(‘one’, item => ‘’)
```

### clear()
Returns a new Map containing no keys or values.

```js
map.clear()
```

### merge()
Returns a new Map resulting from merging the provided iterables.
```js

let mapX = Inmutable.Map({a: 10, b: 20, c: 30})
let mapY = Inmutable.Map({a: 10, b: 20, c: 30})

mapX.merge(mapY) // { a: 50, b: 40, c: 30, d: 60 }
```

### Querying Methods

#### has
Returns a boolean if it finds the id key

```js
map.has(item.id)
```

#### first
Returns the first element of a Map
```js
map.first()
```

### Iteration Methods
We can use methods like  `.filter`, `.map`, `.reduce` . However it’s not recommended to use `.forEach` since it can mutate the data producing side effects.

#### groupBy

Returns the first element of a Map
```js
items.groupBy(item => {
	return todo.completed
});
```

### Working with Subsets of a Map()

#### slice()
Returns the last two items of a Map()
slice(<from>, <to>)
```js
items.slice(items.size-2, todos.size);
```

#### takeLast()
Returns the last two items of a Map()
```js
items.takeLast(2);
```

#### butLast()
Returns the last item
```js
items.butLast();
```

#### rest()
```js
items.rest();
```

#### skip()
Returns a Map() skipping the first 5 items
```js
items.skip(5);
```

#### skipUntil()
Returns a Map() skipping until it finds the value
```js
items.skipUntil(item => item.value === 1);
```

#### skipWhile()
Returns a Map() up until it finds 1 included.
```js
items.skipWhile(item => item.value === 1);
```

### Equality Methods

#### is()
```js
let mapX = Inmutable.Map({a: 10, b: 20, c: 30})
let mapY = Inmutable.Map({a: 10, b: 20, c: 30})

Immutable.is(mapX, mapY); // true
```

### FromJS

#### Object to Map() 
Creates deeply nested Map() from a plain Javascript Object

```js
let object = {a: 10, b: 20, c: 30};

Immutable.fromJS(object); // Map()
```


#### Array to List() 
Creates List() from a JS Array

```js
let array = [10,20,30];

Immutable.fromJS(object); // List()
```

#### Usage of the reviver function
The reviver function takes a key and a value. Converting JS to Map() or List()

```js
let array = [10,20,30];

Immutable.fromJS(array, (key, value) => {
	return value.toMap();
}); // Map()
```

*Note: the getIn will be index based instead of object based if it comes from an array*

### List()

Most of the __Map()__ methods can be used with __List()__
But there are some differences.

### Differences between the Immutable Map() and List()
List() have the same methods that a JS Array has. But instead of mutating the array it returns a new one.

Usually we wouldn’t use the push method in immutable data structures but with Immutable.List()s push methods are safe to be used.

```js
let list = Immutable.List()
list.push(3)
list.toArray() // [3]
```

#### get() and getIn()
The get method with Map() is _key_ based and with List() is _index_ based.

```js
// get()
let list = Immutable.List();
list.push(3);
list.get(0); // 3

let map = Immutable.Map();
list.set('active', true);
list.get('active'); // true

// getIn()
let map = Inmutable.List([10, 20, 30, [40, 50]])
map.getIn([3, 1]) // 50
```

#### of()
We can create a __List()__ by using the _of_ method 

```js
const items = [];
const list = Immutable.List.of('red', 'green', 'blue');
```

*Using the spread operator:*
```js
const items = ['red', 'green', 'blue'];
const list = Immutable.List.of(...items);
```

### Sequences
Represents a sequence of values. [Seq() - Immutable.js](https://facebook.github.io/immutable-js/docs/#/Seq)

- Sequences are immutable — Once a sequence is created, it cannot be changed.
- Sequences are Lazy

Creating sequences with _of()_
```js
let range = [0, 1, 2 ... 999]
let sequence = Immutable.Seq.of(...range)
```

For Example: the following performs no work, because the resulting of the sequence values are never iterated: 

```js

let operations = 0;

let squared = sequence.map(num => {
	operations++;
	return num * num;
})
operations; // 0

// Now using the sequence
squared.take(10).toArray();
operations; // 10

```

Once the sequence is used, it performs only the work necessary. It will return it only when you ask for them.

This is really powerful because it doesn’t produce an overflow with infinite an infinite range.

```js
let squaredRange = Immutable.Range(1, Infinity);

squaredRange.size; // Infinity

first1000squared = squaredRange
	.take(1000)
	.map(n => n * n);

first1000squared.size; // 1000
```

__Seq()__ allows for the efficient chaining of operations

```js
let squaredOdds = Immutable.Range(0, Infinity)
	.filter(n => n % 2 !== 0)
	.map(n => n * n)
	.take(1000);

console.log(
  squaredOdds.toArray()
)

```

You can fin this example here: [Sequences - JS Bin](http://jsbin.com/nilekuj/edit?js,console)

[image:12FACC54-0BAF-4C93-A782-F77DB7CD04D3-813-00001ABD60F45CC4/Screen Shot 2016-12-22 at 8.23.33 AM.png]

## Memoization with Immutable JS
Immutable JS provides advanced memoization.

```js
const seq = Immutable.Range(1, Infinity)
  .map(n => ({
    value: n
  }))

console.time(‘First Run’);
seq.take(1000);
console.timeEnd(‘First Run’); // First Run: 0.577ms

console.time(‘Second Run’);
seq.take(1000);
console.timeEnd(‘Second Run’); // Second Run: 0.165ms
```


### Play with Immutable JS 
[JS Bin - Collaborative JavaScript Debugging](http://jsbin.com/nilekuj/edit?js,console)

