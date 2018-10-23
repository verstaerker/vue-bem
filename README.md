# @verstarker/vue-bem

A [Vue.js](https://vuejs.org/) directive to create [BEM](http://getbem.com/) class names.

This Plugin was inspired by [vue-bem-cn](https://github.com/c01nd01r/vue-bem-cn) and [vue-bem](https://github.com/AndersSchmidtHansen/vue-bem).

## BETA version

This plugin is currently in beta state and not recommended for productive use!

## What's the difference to vue-bem-cn and vue-bem?

While vue-bem-cn is basically a method you can call to create a BEM class, vue-bem defines a custom directive (like this plugin) to create BEM classes. Both plugins have their downsides thought:

* **vue-bem-cn** is not able to cache classes or prevent recalculating all classes on DOM changes.
* **vue-bem** does not allow dynamic modifiers.

This plugin tries to combine the positive effects of both those plugins:

* The block/element class have only to be defined initially on the element
* Caching is used if you enable hyphenation.
* Dynamic modifiers can be used.
* If the template is updated, but the modifiers did not change, classes will not be recalculated.

### Limitations

* You can not change the element name dynamically.
* You can not change mixin classes dynamically. 
* To prevent recalculation of unchanged modifiers you need to define a computed value which returns the modifier Object (instead of an inline attribute Object).

## How to use the directive

The vue-bem directive is used as any other Vue.js directive.

```
v-bem<:element><.mixin>="<modifier>"
```

All parts are optional. If you only use `v-bem` you will still get the block class thought.

## TODO: mixin

## Install

TODO: Add installation process

## Settings

```
{
  namespace: '',
  hyphenate: {
    blockAndElement: false,
    modifier: true,
  },
  delimiters: {
    element: '__',
    modifier: '--',
    value: '-',
  }
}
```

### `namespace` (String)

Can be used to add a static namespace to the beginning of every class. Must include the delimiter.

### `hyphenate` (Boolean|Object)

Allows to enable auto hyphenating of `block`, `element` and `modifiers`. Mixins are never touched. By default hyphenating is only applied to `modifiers` to allow the use of camelCase key names for the modifier Object. It is recommended to write `block` and `element` already in kebab case if you prepare so because it removes the conversion step.

### `delimiters` (String)

Allows to define custom delimiters between `block`, `element` and `modifier`.

## Examples

### Only block

```vue
<div v-bem></div>

<!-- will become -->
<div class="block"></div>
```

### Only element

```vue
<div v-bem:element></div>

<!-- will become -->
<div class="block__element"></div>
```

### With mixin

Note: can also be chained.

```vue
<div v-bem.mixin></div>

<!-- will become -->
<div class="block mixin"></div>
```
### Width modifier

Note: There is no limit to the number of modifiers.

```vue
<!-- `modifiers` is a computed value returning `{ color: 'red' }` -->
<div v-bem="modifiers"></div> 

<!-- will become -->
<div class="block block--color-red"></div>
```

### All together

```vue
<!-- `modifiers` is a computed value returning `{ color: 'red' }` -->
<div v-bem:element.mixin="modifiers"></div>

<!-- will become -->
<div class="block__element block__element--color-red mixin"></div>
```
