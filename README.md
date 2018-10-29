# @verstaerker/vue-bem

Adds a directive and (optional) mixin to your [Vue.js](https://vuejs.org/) project to create [BEM](http://getbem.com/) class names.

This Plugin was inspired by [vue-bem-cn](https://github.com/c01nd01r/vue-bem-cn) and [vue-bem](https://github.com/AndersSchmidtHansen/vue-bem).

## BETA version

This plugin is currently in beta state and not recommended for productive use!

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
        <li>Automatically class creation for block, element, modifier</li>
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

## How to use the directive

The vue-bem directive is used as any other Vue.js directive.

```
v-bem<:element>="<modifier>"
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

## TODO's

- [ ] Browser testing
