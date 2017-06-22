[![Build Status](https://travis-ci.org/nsf-open/nsf-ember-tooltip.svg?branch=master)](https://travis-ci.org/nsf-open/nsf-ember-tooltip)
# NSF Ember Tooltip

An [ember-cli](https://www.ember-cli.com) addon for using [Tooltipster](https://iamceege.github.io/tooltipster/) in Ember applications. The default sideTip, and the [ScrollableTip](https://github.com/louisameline/tooltipster-scrollableTip) plugins come preconfigured.

----

## Installation
(_We will be registering this as an NPM package soon. For now, pull what you need directly from GitHub. See [Git URLs as Dependencies](https://docs.npmjs.com/files/package.json#git-urls-as-dependencies)._)
```
npm install nsf-open/nsf-ember-tooltip#commit-ish --save-dev
```

## Usage
It's pretty simple. You provide the tooltip content, and the trigger content. The component will take care of the rest.

Inline form
```handlebars
{{-- Using positional parameters --}}
{{tool-tip 'Here is some more information' 'I have a tooltip'}}

{{-- Equivalent with named parameters --}}
{{tool-tip content='Here is some more information' text='I have a tooltip'}}

{{-- The title attribute may also be used to provide the tip's content --}}
{{tool-tip title='Here is some more information' text='I have a tooltip'}}
```

Block form
```handlebars
{{-- The component's yield block becomes the trigger --}}
{{#tool-tip 'Here is some more information'}}
    I have a tooltip
{{/tool-tip}}

{{-- For complex content that you do not want to create programmatically --}}
{{-- you can also define the tooltip content in the block --}}
{{#tool-tip}}
    I have a tooltip
    <div data-tooltip-content>
        <p><strong>Here is some more information</strong></p>
    </div>
{{/tool-tip}}
```
NOTE: using `data-tooltip-content` in the component's yield block currently has one limitation: its content cannot be re-rendered. When first created, the component detaches that element from the DOM before passing it to Tooltipster. Sorry, we're working on it!

## Properties
`{{tool-tip}}` supports (almost) all of the basic options provided by Tooltipster, listed [here](https://iamceege.github.io/tooltipster/#options).

NOTE: We need to deviate from Tooltipster in one significant place - the `trigger` option. Since `trigger` is used internally by Ember components, use `tipTrigger` instead.

In addition, we have added:

| Property | Type | Default | Description
| --- | --- | --- | --- |
| canTab | Boolean | true | Adds `tabindex=0` to the tooltip's trigger so it will be included in the page's tab flow. If the tooltip's trigger set to `hover`, then the tooltip will be shown on focus and hidden on blur. If the trigger is `click`, then the enter key will toggle the tooltip when the element has focus.
| enabled | Boolean | true | A bound property that will enable/disable the tooltip by calling `.tooltipster('enable')` and `.tooltipster('disable')`.
| showTip | Boolean | false | A bound property that may be used to programmatically show/hide the tooltip.
| showTipOnUpdate | Boolean | false | If true, changes to the `content` value will cause the tooltip to be shown.
| tipTextAttr | String | `"[data-tooltip-content]"` | Any valid jQuery selector that will be used to search the component's block for the tooltip's content.

## Styling
The component provides the core Tooltipster styles and default theme out of the box. If you want to roll your own styles, then you can disable this in your app's `environment.js`:
```javascript
const ENV = {
  'nsf-ember-tooltip': {
    excludeDefaultStyles: true,
  }
};
```

If you are using SASS, the component provides and optional partial file and mixin that you may import to change things up.

To import:
```sass
@import 'nsf-ember-tooltip/styles';
```

Available variables (with their defaults):
```sass
$tooltipster-color:         white;
$tooltipster-bg:            #565656;
$tooltipster-border:        black;
$tooltipster-border-weight: 2px;
$tooltipster-border-radius: 4px;
$tooltipster-arrow-width:   10px;
$tooltipster-padding:       6px 14px;
$tooltipster-line-height:   18px;
```

Using the mixin to create more variants:
```sass
.my-custom-tooltipster-theme-name {
  @include tooltipster-variant(color, background-color, border-color [, border-weight: 2px, arrow-width: 10px]);
}
```
