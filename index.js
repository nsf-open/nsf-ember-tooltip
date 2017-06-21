/* global module, require */
/* eslint-env node */
'use strict';

const path = require('path');
const Funnel = require('broccoli-funnel');
const MergeTrees = require('broccoli-merge-trees');


module.exports = {
  name: 'nsf-ember-tooltip',


  included() {
    let app;

    // If the addon has the _findHost() method (in ember-cli >= 2.7.0), we'll just use that.
    if (typeof this._findHost === 'function') {
      app = this._findHost();
    }
    else {
      // Otherwise, we'll use this implementation borrowed from the _findHost() method in ember-cli.
      let current = this;

      do {
        app = current.app || app;
      } while (current.parent.parent && (current = current.parent));
    }

    this.app = app;
    this.addonConfig = this.app.project.config(app.env)['nsf-ember-tooltip'] || {};

    this._super.included.apply(this, arguments);

    this.import('vendor/tooltipster.bundle.js');
    this.import('vendor/tooltipster-scrollableTip.js');

    if (!this.addonConfig.excludeDefaultStyles) {
      this.import('vendor/tooltipster.bundle.css');
    }
  },


  treeForVendor() {
    const trees = [];

    trees.push(new Funnel(path.dirname(require.resolve('tooltipster/dist/js/tooltipster.bundle.js')), {
      files: ['tooltipster.bundle.js'],
    }));

    trees.push(new Funnel(path.dirname(require.resolve('tooltipster-scrollabletip/tooltipster-scrollableTip.js')), {
      files: ['tooltipster-scrollableTip.js'],
    }));

    if (!this.addonConfig.excludeDefaultStyles) {
      trees.push(new Funnel(path.dirname(require.resolve('tooltipster/dist/css/tooltipster.bundle.css')), {
        files: ['tooltipster.bundle.css'],
      }));
    }

    return new MergeTrees(trees);
  },
};
