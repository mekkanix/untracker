import UTWorkerManager from './src/background/UTWorkerManager.js'

const utWkrManager = new UTWorkerManager()
utWkrManager.onReady = () => {
  utWkrManager.start()
}
