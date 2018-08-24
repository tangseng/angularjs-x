# @tangseng/angularjs-x

> 在angularjs项目中实现类似Vue的组件书写方式和Vuex的数据管理能力

``` sh
npm install @tangseng/angularjs-x
```

**TS和TSX的结合使用**

> TS中实现了结合使用TSX的语法糖：computed来绑定state 和 methods中可以绑定action

```javascript
//建立共享数据的模块 test.js
const testModule = {
  state: {
    message: ''
  },
  mutations: {
    mutationMessage(state, message) {
      state.message = message
    }
  },
  actions: {
    updateMessage({ commit }, message) {
      commit('mutationMessage', message)
    }
  }
}

//在TSX中注册test模块
TSX.registerModule('test', testModule)

//组件
angular.module('test').directive('testComponent', (TS) => {
  'ngInject'

  return {
    restrict: 'AE',
    scope: {},
    template: `
      <div>
        <span>{{message}}</span>
        <button ng-click="click()"></button>
      </div>
    `,
    link(scope) {
      const component = new TS(scope, {
        computed: {
          message: 'test.message'
        },
        methods: {
          updateMessage: 'test.updateMessage'
        },
        scopeMethods: {
          click() {
            this.updateMessage('hehe...')
          }
        }
      })
    }
  }
})
```

**可以通过例子和文章更多了解**

- [例子：example](https://github.com/tangseng/angularjs-x/tree/master/example)
- [文章：在angularjs项目中实现类似Vue的组件书写方式和Vuex的数据管理能力](https://github.com/tangseng/artcles/blob/master/[2018-03-10]在angularjs项目中实现类似Vue的组件书写方式和Vuex的数据管理能力.md)
