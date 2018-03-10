import TS from '../dist/index'

describe('TS', () => {
  beforeAll(() => {
    console.log('before all')
  })

  beforeEach(() => {
    console.log('before each')
  })

  it('ts data', () => {
    console.log('data')
  })

  it('ts computed', () => {
    console.log('computed')
  })

  afterEach(() => {
    console.log('after each')
  })

  afterAll(() => {
    console.log('after all')
  })
})