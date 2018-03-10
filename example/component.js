import angular from 'angular'
const component = angular.module('component', [])

const context = require.context('./component', true, /\.js$/)
context.keys().forEach(c => {
  const each = context(c).default
  if (typeof each == 'function') {
    each(component)
  }
})

export default component