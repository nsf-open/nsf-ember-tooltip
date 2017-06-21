/* global module, require */
/* eslint-env node */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');
var MergeTrees = require('broccoli-merge-trees');


module.exports = {
  name: 'nsf-ember-tooltip',


  included() {
    this._super.included.apply(this, arguments);

    this.import('vendor/tooltipster.bundle.js');
    this.import('vendor/tooltipster-scrollableTip.js');
    this.import('vendor/tooltipster.bundle.css');
  },


  treeForVendor(vendorTree) {
    var tooltipJsTree = new Funnel(path.dirname(require.resolve('tooltipster/dist/js/tooltipster.bundle.js')), {
      files: ['tooltipster.bundle.js'],
    });

    var tooltipCssTree = new Funnel(path.dirname(require.resolve('tooltipster/dist/css/tooltipster.bundle.css')), {
      files: ['tooltipster.bundle.css'],
    });

    var scrollTipTree = new Funnel(path.dirname(require.resolve('tooltipster-scrollabletip/tooltipster-scrollableTip.js')), {
      files: ['tooltipster-scrollableTip.js'],
    });

    return new MergeTrees([vendorTree, tooltipJsTree, tooltipCssTree, scrollTipTree]);
  },
};
