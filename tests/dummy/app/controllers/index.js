import Ember from 'ember';

const {
  Controller,
  get,
  set,
} = Ember;


export default Controller.extend({
  inputContent: 'This is a tooltip!',

  tooltipContent: 'This is a tooltip!',

  enabled: true,

  showTip: false,

  showTipOnUpdate: false,

  tipTrigger: 'click',

  actions: {
    toggleTipVisibility() {
      this.toggleProperty('showTip');
    },

    updateTooltipContent() {
      set(this, 'tooltipContent', get(this, 'inputContent'));
    },
  },
});
