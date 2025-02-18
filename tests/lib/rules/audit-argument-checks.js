/**
 * @fileoverview Enforce check on all arguments passed to methods and publish functions
 * @author Dominik Ferber
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../dist/rules/audit-argument-checks')
var RuleTester = require('eslint').RuleTester


// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester()
ruleTester.run('audit-argument-checks', rule(), {

  valid: [
    'foo()',

    'Meteor[x]()',
    'Meteor["publish"]()',
    'Meteor.publish()',

    {code: 'Meteor.publish("foo", function ({ x }) {})', parser: 'babel-eslint'},
    {code: 'Meteor.publish("foo", () => {})', parser: 'babel-eslint'},
    'Meteor.publish("foo", function () {})',
    'Meteor.publish("foo", function (bar) { check(bar, Match.Any); })',
    {code: 'Meteor.publish("foo", (bar) =>  { check(bar, Match.Any); })', parser: 'babel-eslint'},
    'Meteor.publish("foo", function (bar, baz) { check(bar, Match.Any); check(baz, Match.Any); })',

    'Meteor.methods()',
    'Meteor.methods({ x: function () {} })',
    'Meteor["methods"]({ x: function () {} })',
    'Meteor.methods({ x: true })',
    {code: 'Meteor.methods({ x () {} })', parser: 'babel-eslint'},
    'Meteor.methods({ x: function (bar) { check(bar, Match.Any); } })',
    'Meteor.methods({ x: function (bar, baz) { check(bar, Match.Any); check(baz, Match.Any); } })'
  ],

  invalid: [
    {
      code: 'Meteor.publish("foo", function (bar) { foo(); })',
      errors: [{
        message: 'bar is not checked',
        type: 'Identifier'
      }]
    },
    {
      code: 'Meteor["publish"]("foo", function (bar) { foo(); })',
      errors: [{
        message: 'bar is not checked',
        type: 'Identifier'
      }]
    },
    {
      code: 'Meteor.publish("foo", function (bar) {})',
      errors: [{
        message: 'bar is not checked',
        type: 'Identifier'
      }]
    },
    {
      code: 'Meteor.publish("foo", function (bar, baz) { check(bar, Match.Any); })',
      errors: [{
        message: 'baz is not checked',
        type: 'Identifier'
      }]
    },
    {
      code: 'Meteor.methods({ foo: function (bar) {} })',
      errors: [{
        message: 'bar is not checked',
        type: 'Identifier'
      }]
    },
    {
      code: 'Meteor.methods({ foo: function () {}, foo2: function (bar) {} })',
      errors: [{
        message: 'bar is not checked',
        type: 'Identifier'
      }]
    },
    {
      code: 'Meteor.methods({ foo () {}, foo2 (bar) {} })',
      errors: [{
        message: 'bar is not checked',
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    },
    {
      code: `
        Meteor.methods({
          foo () {},
          foo2 (bar) {
            if (true) {
              check(bar, Meteor.any)
            }
          }
        })
      `,
      errors: [{
        message: 'bar is not checked',
        type: 'Identifier'
      }],
      parser: 'babel-eslint'
    }
  ]
})
