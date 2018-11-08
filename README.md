# @verstaerker/vue-bem

Adds a directive and (optional) mixin to your [Vue.js](https://vuejs.org/) project to create [BEM](http://getbem.com/) class names.

This Plugin was inspired by [vue-bem-cn](https://github.com/c01nd01r/vue-bem-cn) and [vue-bem](https://github.com/AndersSchmidtHansen/vue-bem).

## Table of Contents

* [Comparison](#comparison)
* [How to use](#how-to-use)
* [Install](#install)
* [Examples](#examples)
* [License](#license)

## Comparison

<table>
  <tbody>
  <tr>
    <th valign="top"></th>
    <th>@verstaerker/vue-bem</th>
    <th>vue-bem-cn</th>
    <th>vue-bem (Vue 1)</th>
  </tr>
  <tr>
    <th valign="top">Info</th>
    <td valign="top">
      <ul>
        <li>Automatic class creation for block, element, modifier</li>
        <li>Component name or custom property used as block name</li>
        <li>Dynamic modifiers</li>
        <li>Allows Boolean, Number and String values as modifiers</li>
        <li>Prevents re-calculation of classes if modifiers did not change</li>
        <li>Cache for String replacements</li>
        <li>Only updates modifier classes on re-calculation</li>
      </ul>
    </td>
    <td valign="top">
      <ul>
        <li>Automatic class creation for block, element, modifier and mixin</li>
        <li>Component name or custom property used as block name</li>
        <li>Dynamic element name</li>
        <li>Dynamic modifiers</li>
        <li>Dynamic mixins</li>
        <li>Allows Boolean, Number and String values for modifiers</li>
      </ul>
    </td>
    <td valign="top">
      <ul>
        <li>Automatic class creation for block, element, modifier</li>
      </ul>
    </td>
  </tr>
  <tr>
    <th valign="top">Limitations</th>
    <td valign="top">
      <ul>
        <li>Static element name</li>
        <li>Mixins must be defined with class attribute</li>
        <li>Modifiers must be defined as computed property to allow "caching"</li>
      </ul>
    </td>
    <td valign="top">
      <ul>
        <li>No caching</li>
        <li>Recalculates on each component update</li>
        <li>Updates all BEM classes when re-calculating</li>
      </ul>
    </td>
    <td valign="top">
      <ul>
        <li>Deprecated</li>
        <li>Static element and modifiers</li>
      </ul>
    </td>
  </tr>
  </tbody>
</table>

## How to use

### Directive

The vue-bem directive is used as any other Vue.js directive.

```
v-bem<:element>="<modifier>"
```

All parts are optional. If you only use `v-bem` you will still get the block class thought.

### Mixin

The mixin adds a `$bem` (or as configured) method to the extended component which you can use to create BEM classes from within JavaScript.

```
render(h) {
  const className = this.$bem(<element> [, <modifier>]);
}
```

### Attributes

#### Element (String)

The element name which will be concatenated with the block name using the `element` delimiter as glue.

#### Modifier (Object)

The to be applied modifiers which will be concatenated with the block or element name using the `modifier` delimiter as glue.

A value can be given to each modifier (which will be concatenated using the `value` delimiter as glue):

- Type `String` and `Number` will be added as a value to the modifier class
- Type `Boolean` will add/remove the modifier and not add a value to the modifier

## Install

To install the npm package run

```
npm i @verstaerker/vue-bem --save
```

### Directive

The directive is delivered as a Vue plugin. You can install it as any other plugin:

```javascript
import Vue from 'vue';
import vueBem from '@verstaerker/vue-bem';

Vue.use(vueBem);

new Vue(/* ... */);
```

### Mixin

To use the mixin you MUST install the plugin first. Then you can use the mixin as any other Vue mixin (locally or globally). It is recommended to use the mixin locally when needed.

```javascript
// component.vue
import { bemMixin } from '@verstaerker/vue-bem'

export default {
  mixins: [bemMixin],
  render(h) {
    const className = this.$bem('element');
    
    // ...
  }
}
```

## Settings

```
// Defaults
{
  namespace: '',
  method: '$bem'
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

### `mixin` (String)

Defines the name of the bem method of the mixin.

### `hyphenate` (Boolean|Object)

Allows to enable auto hyphenating of `block`, `element` and `modifiers`. Mixins are never touched. By default hyphenating is only applied to `modifiers` to allow the use of camelCase key names for the modifier Object. It is recommended to write `block` and `element` already in kebab case if you prepare so because it removes the conversion step.

### `delimiters` (Object)

Allows to define custom delimiters between `block`, `element` and `modifier`.

#### `delimiters.element` (String)
#### `delimiters.modifier` (String)
#### `delimiters.value` (String)

## Examples

The following examples show how to create block, element and modifier classes. You can combine the directive with static or dynamic class bindings.

### Directive

#### Only block

```html
<div v-bem></div>

<!-- will become -->
<div class="block"></div>
```

#### Only element

```html
<div v-bem:element></div>

<!-- will become -->
<div class="block__element"></div>
```

#### With modifier(s)

Note: There is no limit to the number of modifiers.

```html
<!-- `modifiers` is a computed value returning `{ color: 'red' }` -->
<div v-bem="modifiers"></div> 

<!-- will become -->
<div class="block block--color-red"></div>
```

#### All together

```html
<!-- `modifiers` is a computed value returning `{ visible: true }` -->
<div v-bem:element="modifiers"></div>

<!-- will become -->
<div class="block__element block__element--visible"></div>
```

### Mixin

#### Only block

```javascript
render(h) {
  const className = this.$bem(); // 'block'
}
```

#### With modifier(s)

```javascript
render(h) {
  const className = this.$bem('element'); // 'block__element'
}
```

#### Only element

Note: There is no limit to the number of modifiers.

```javascript
computed: {
  modifiers() {
    return {
      color: this.$props.color
    }
  }
},
render(h) {
  const className = this.$bem(this.modifiers); // 'block block--color-red'
}
```

#### All together

```javascript
computed: {
  modifiers() {
    return {
      visible: this.$props.visible
    }
  }
},
render(h) {
  const className = this.$bem('element', this.modifiers); // 'block__element block__element--visible'
}
```

## License

MIT
