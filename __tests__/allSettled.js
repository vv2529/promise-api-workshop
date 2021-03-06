import CustomPromise from '../index.js'
import { scheduleResolve, scheduleReject } from '../__utils__'

test('CustomPromise.allSettled handles arrays of primitives', () => {
  return CustomPromise.allSettled([1, 'string', false])
})

test('CustomPromise.allSettled throws for non-array inputs', () => {
  return expect(() => {
    CustomPromise.allSettled('string')
  }).toThrow()
})

test(`CustomPromise.allSettled resolves with an array of promises when given an array of resolved and rejected promises`, async () => {
  const mockInput = [
    scheduleResolve(110, 1),
    scheduleResolve(120, 2),
    scheduleReject(130, 'reject1')
  ]
  const mockOutput = [1, 2, 'reject1']
  async function getResultValues() {
    const res = []
    const arr = await CustomPromise.allSettled(mockInput)
    for (let i = 0; i < mockInput.length; i++) {
      try {
        res[i] = await arr[i]
      } catch (err) {
        res[i] = err
      }
    }
    return res
  }
  const resultValues = await getResultValues()
  return expect(resultValues).toMatchObject(mockOutput)
})

test(`CustomPromise.allSettled saves values to output in order of their position in the input`, async () => {
  const mockInput = [
    scheduleReject(130, 'reject1'),
    scheduleResolve(120, 2),
    scheduleResolve(110, 1)
  ]
  const mockOutput = ['reject1', 2, 1]
  async function getResultValues() {
    const res = []
    const arr = await CustomPromise.allSettled(mockInput)
    for (let i = 0; i < mockInput.length; i++) {
      try {
        res[i] = await arr[i]
      } catch (err) {
        res[i] = err
      }
    }
    return res
  }
  const resultValues = await getResultValues()
  return expect(resultValues).toMatchObject(mockOutput)
})
