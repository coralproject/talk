React component example:

```js
  <Button>Push Me</Button>
```

Instead of an `button` tag, we can render an `a` tag instead:
```js
  <Button anchor>Push Me</Button>
```

Setting `fullWidth` will render a full width button:
```js
  <Button fullWidth>Push Me</Button>
```

Setting `invert` will render an inverted button:
```js
  <Button invert>Push Me</Button>
```
```js
  <Button fullWidth invert>Push Me</Button>
```

Setting `primary` will use the primary color:
```js
  <Button primary>Push Me</Button>
```
```js
  <Button primary fullWidth>Push Me</Button>
```
```js
  <Button primary invert>Push Me</Button>
```
```js
  <Button primary fullWidth invert>Push Me</Button>
```
