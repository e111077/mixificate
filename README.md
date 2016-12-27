# Mixificate
`mixificate` is a function that will convert a Polymer behavior object into an
ES6 Polymer Mixin.

## Usage
1) Import Mixificate via HTML Import or `script.src`

HTML Import:
```html
<link rel="import" href="../mixificate/mixificate.html">
```
srcipt.src:
```html
<script src="../mixificate/mixificate.js"></script>
```

2) Call `mixificate` on a Polymer behavior.
```javascript
let IronResizableMixin = mixificate(Polymer.IronResizableBehavior);
```

3) Use the mixin in a Polymer element.

```javascript
let IronResizableMixin = mixificate(Polymer.IronResizableBehavior);

class ResizableElement extends IronResizableMixin(Polymer.Element) {
  static get is() { return 'resizable-element' }
  ... // insert element definition here
}

customElements.define(ResizableElement.is, ResizableElement);
```
