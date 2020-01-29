import init, { contribute } from '@/lib/phase2/phase2.js'

export default ({ store, isHMR, app }, inject) => {
  inject('contribute', main)
}
async function main() {
  const initPromise = init()
  await initPromise
  return contribute
}
