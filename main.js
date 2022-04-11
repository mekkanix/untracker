import Untracker from './Untracker.js'

chrome.runtime.onInstalled.addListener(() => {
  const untracker = new Untracker()
})
