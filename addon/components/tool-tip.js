import Ember from 'ember';

const {
  Component,
  computed,
  get,
  set,
  defineProperty,
  typeOf,
  isBlank,
  compare,
  run: {
    next,
  },
  testing,
} = Ember;


/**
 *
 *
 * @class ToolTipComponent
 * @namespace NSF
 * @extends Ember.Component
 */
const ToolTip = Component.extend({
  attributeBindings: ['title', 'ariaHidden:aria-hidden', 'tabIndex:tabindex'],

  tagName: 'span',

  text: null,

  title: null,

  canTab: true,

  showTipOnUpdate: false,

  tipTextAttr: '[data-tooltip-content]',


  ariaHidden: computed('hasBlock', 'text', function() {
    return !get(this, 'hasBlock') && isBlank(get(this, 'text'));
  }).readOnly(),


  tabIndex: computed('canTab', function() {
    return get(this, 'canTab') ? '0' : null;
  }).readOnly(),


  enabled: computed({
    get() {
      return this.$() ? this.$().tooltipster('status').enabled : true;
    },

    set(key, value) {
      if (this.$()) {
        this.$().tooltipster(value ? 'enable' : 'disable');
      }

      return value;
    },
  }),


  showTip: computed({
    get() {
      return this.$() ? this.$().tooltipster('status').open : false;
    },

    set(key, value) {
      if (this.$()) {
        this.$().tooltipster(value ? 'open' : 'close');
      }

      return value;
    },
  }),


  _cacheValues: null,

  propertiesMap: computed(function() {
    return [
      { propName: 'animation', default: 'fade' },
      { propName: 'animationDuration', default: (testing ? 0 : 350) },
      { propName: 'arrow', default: true },
      { propName: 'content', default: null },
      { propName: 'contentAsHTML', default: false },
      { propName: 'contentCloning', default: false },
      { propName: 'debug', default: true },
      { propName: 'delay', default: (testing ? 0 : 300) },
      { propName: 'delayTouch', default: (testing ? 0 : [300, 500]) },
      { propName: 'distance', default: 6 },
      { propName: 'functionInit', default: null },
      { propName: 'functionBefore', default: null },
      { propName: 'functionReady', default: null },
      { propName: 'functionAfter', default: null },
      { propName: 'functionFormat', default: null },
      { propName: 'functionPosition', default: null },
      { propName: 'IEmin', default: 6 },
      { propName: 'interactive', default: false },
      { propName: 'maxWidth', default: null },
      { propName: 'minIntersection', default: 16 },
      { propName: 'minWidth', default: 0 },
      { propName: 'multiple', default: false },
      { propName: 'plugins', default: ['sideTip', 'scrollableTip'] },
      { propName: 'repositionOnScroll', default: false },
      { propName: 'restoration', default: 'none' },
      { propName: 'selfDestruction', default: true },
      { propName: 'side', default: ['top', 'bottom', 'left', 'right'] },
      { propName: 'timer', default: 0 },
      { propName: 'theme', default: [] },
      { propName: 'trackerInterval', default: (testing ? 0 : 500) },
      { propName: 'trackOrigin', default: false },
      { propName: 'trackTooltip', default: false },
      { propName: 'tipTrigger', pluginName: 'trigger', default: 'hover' },
      { propName: 'triggerClose', default: {} },
      { propName: 'triggerOpen', default: {} },
      { propName: 'updateAnimation', default: null },
      { propName: 'viewportAware', default: true },
      { propName: 'zIndex', default: 9999999 }
    ];
  }).readOnly(),


  init() {
    this._super(...arguments);
    get(this, 'propertiesMap').forEach(def => this.defineComponentProperty(def));
  },


  defineComponentProperty(def) {
    const val = get(this, def.propName);

    defineProperty(this, def.propName, computed({
      get() {
        return typeOf(val) !== 'undefined' ? val : def.default;
      },

      set(key, value) {
        return this.updatePluginPropertyValue(def.pluginName || def.propName, value);
      },
    }));
  },


  updatePluginPropertyValue(key, value) {
    // Some internal comparison-making because there are instances where all the
    // computed props get re-computed and we don't want to spam the plugin without
    // need. Not sure why that is happening, but it is.
    if (compare(value, get(this, `_cacheValues.${key}`)) === 0) {
      return value;
    }

    switch(key) {
      case 'content':
        this.$().tooltipster(key, value);

        if (get(this, 'showTipOnUpdate')) {
          this.$().tooltipster('open');
        }

        break;

      default:
        this.$().tooltipster('option', key, value);
        break;
    }

    set(this, `_cacheValues.${key}`, value);

    return value;
  },


  mapPropertyValues(forPlugin = true) {
    const result = {};

    get(this, 'propertiesMap').forEach((item) => {
      result[forPlugin ? item.pluginName || item.propName : item.propName] = get(this, item.propName);
    });

    return result;
  },


  didInsertElement() {
    this._super(...arguments);

    const props = this.mapPropertyValues();
    const content = this.$(get(this, 'tipTextAttr'));

    if (content && content.length) {
      props.content = content.eq(0).detach();
    }
    else if (isBlank(props.content)) {
      delete props.content;
    }

    set(this, '_cacheValues', props);

    this.$()
      .tooltipster(props)
      .tooltipster(get(this, 'enabled') ? 'enable' : 'disable')
      .tooltipster('instance')
      .on('before', () => { next(this, 'notifyPropertyChange', 'showTip'); })
      .on('after', () => { next(this, 'notifyPropertyChange', 'showTip'); });

    if (get(this, 'showTip')) {
      this.$().tooltipster('open');
    }

    this.sendAction('onReady', this.$().tooltipster('instance'));
  },


  willDestroyElement() {
    this.$().tooltipster('destroy');
    this._super(...arguments);
  },


  focusIn() {
    if (get(this, 'canTab') && get(this, 'tipTrigger') === 'hover') {
      this.$().tooltipster('open');
    }
  },


  focusOut() {
    if (get(this, 'canTab') && get(this, 'tipTrigger') === 'hover') {
      this.$().tooltipster('close');
    }
  },


  keyUp(event) {
    // React to enter key (13) presses
    if (event.keyCode === 13 && get(this, 'canTab') && get(this, 'tipTrigger') === 'click') {
      this.$().tooltipster(get(this, 'showTip') ? 'close' : 'open');
    }
  },
});


ToolTip.reopenClass({
  positionalParams: ['content', 'text'],
});


export default ToolTip;
