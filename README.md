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