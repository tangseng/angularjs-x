export default app => {
  app.directive('tsOne', ['TS', (TS) => {
    return {
      restrict: 'AE',
      transclude: true,
      scope: {

      },
      template: `
        <fieldset style="border:1px solid red;">
          <legend><ng-transclude></ng-transclude></legend>
          <div>{{gongyong}}</div>
          <div>{{bindGongyong}}</div>
        </fieldset>
      `,
      link(scope, element, attrs) {
        const component = new TS(scope, {
          auto: true,

          data: {
            bindGongyong: 0 
          },

          computed: {
            gongyong: {
              name: 'main.gongyong',
              compute(gongyongVal) {
                return gongyongVal
              }
            }
          },

          watchs: {
            gongyong(...args) {
              this.scope.bindGongyong = '绑定并乘以2倍 = ' + (args[0] * 2)
            }
          },

          methods: {

          },

          scopeMethods: {

          },

          created() {

          },

          destroy() {

          },

          render() {

          }
        })
      }
    }
  }])
}