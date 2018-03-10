import angular from 'angular'
import component from './component'
import TS from 'angularjs-x'
import tsx from './tsx/index'

console.log(angular.injector(['ng']).get('$rootScope'))

const app = angular.module('ts', [component.name])

app.factory('TS', () => TS)
app.service('TSX', () => tsx)

export default app