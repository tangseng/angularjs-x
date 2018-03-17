export default app => {
  app.directive('tsTwo', ['TS', (TS) => {
    return {
      restrict: 'AE',
      transclude: true,
      scope: {

      },
      template: `
        <fieldset style="border: 1px solid blue;margin-top: 10px;">
          <legend><ng-transclude></ng-transclude></legend>
          <div>
            <button ng-click="click()">点我+1</button>
            <button ng-repeat="number in enumNumbers" ng-click="click(number)" style="margin-right:5px;">{{number}}</button>
          </div>
        </fieldset>
      `,
      link(scope, element, attrs) {
        const component = new TS(scope, {
          data: {
            enumNumbers: [10, 20, 30]
          },

          computed: {

          },

          watchs: {

          },

          methods: {
            update: 'main.updateGongyong'
          },

          scopeMethods: {
            click(number) {
              this.update(number)
            }
          },

          created() {

          },

          destory() {

          },

          render() {

          }
        })
      }
    }
  }])
}