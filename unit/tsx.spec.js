import { TSX } from '../dist/index'

describe('TSX', () => {
  
  beforeAll(() => {
    TSX.addModule('global', {
      state: {
        test: 0
      },
      actions: {
        mutationTest(testVal) {
          this.state.test = testVal
        }
      }
    })
  })

  it('mapState && mapAction', () => {
    let testVal
    TSX.mapAction('global.mutationTest')(10)
    TSX.mapState('global.test', (val) => {
      testVal = val
    })
    expect(testVal).toBe(10)
  })
})