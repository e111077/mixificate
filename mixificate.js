const mixificate = behavior => {
  const KEYS_TO_IGNORE = {
      properties: 1,
      observers: 1,
      hostAttributes: 1,
      created: 1,
      attached: 1,
      ready: 1,
      listeners: 1
  };

  return superClass => {
    // generate the superclass if the behavior relies on other behaviors
    if (behavior.behaviors) {
      let lastSuperClass = superClass;

      for (let i = 0; i < behavior.behaviors.length; i++) {
        lastSuperClass = mixificate(behavior.behaviors[i])(lastSuperClass);
      }

      superClass = lastSuperClass;
    }

    // pass the behavior into MixedClass without instantiating it
    superClass.prototype.__behavior = behavior;

    class MixedClass extends superClass {
      constructor() {
        super();

        // set the functions that are not lifecycle callbacks
        let keys = Object.keys(super.__behavior);

        for (let keyIndex in keys) {
          let key = keys[keyIndex];

          if (!(key in KEYS_TO_IGNORE)) {
            this[key] = super.__behavior[key].bind(this);
          }
        }

        if (super.__behavior.created) {
          if (super.__behavior.created) {
            super.__behavior.created.call(this);
          }
        }
      }

      connectedCallback() {
        super.connectedCallback();

        if (behavior.attached) {
          super.__behavior.attached.call(this);
        }
      }

      ready() {
        if (super.__behavior.listeners) {
          let events = Object.keys(super.__behavior.listeners);

          for (let eventIndex in events) {
            let event = events[eventIndex];
            let listener = super.__behavior.listeners[event];

            this.addEventListener(event, this[listener]);
          }
        }

        if (super.__behavior.hostAttributes) {
          let attributes = Object.keys(super.__behavior.hostAttributes);

          for (let attributeIndex in attributes) {
            let attribute = attributes[attributeIndex];
            let attributeValue = super.__behavior.hostAttributes[attribute];

            this._ensureAttribute(attribute, attributeValue);
          }
        }

        super.__behavior.ready.call(this);
        superClass.prototype.ready();
      }
    }

    let configuration = {};
    configuration.properties = behavior.properties;
    configuration.observers = behavior.observers;
    MixedClass.config = configuration;

    MixedClass.is = behavior.is;

    return MixedClass;
  }
}