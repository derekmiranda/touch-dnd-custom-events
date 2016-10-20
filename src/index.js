import DragDataStore from './DragDataStore'
import DataTransfer from './DataTransfer'
import simulateEvent from './simulateEvent'
import { updateDragPreview, removeDragPreview } from './dragPreview'

export default function setupTouchDNDCustomEvents() {
  window.touchDndCustomEvents = {
    store: null,
    dataTransfer: null,
    lastDraggedOver: null,
    draggedItem: null,
  }

  document.addEventListener('touchstart', handleTouchStart, true)
  document.addEventListener('touchend', handleTouchEnd, true)
  document.addEventListener('touchmove', handleTouchMove, true)
}

function handleTouchStart (event) {
  if (event.target.hasAttribute("draggable")) {
    event.preventDefault()

    var x = event.changedTouches[0].clientX
    var y = event.changedTouches[0].clientY

    var target = document.elementFromPoint(x, y)

    var store = new DragDataStore()
    var dataTransfer = new DataTransfer(store)
    touchDndCustomEvents.store = store
    touchDndCustomEvents.dataTransfer = dataTransfer
    touchDndCustomEvents.draggedItem = target

    store.mode = 'readwrite'
    simulateEvent('touchdragstart', event, dataTransfer, target)

    var dragPreview = store.dragPreviewElement
    updateDragPreview(dragPreview, x, y)
  }
}

function handleTouchMove (event) {
  if (touchDndCustomEvents.draggedItem) {
    event.preventDefault()

    var x = event.changedTouches[0].clientX
    var y = event.changedTouches[0].clientY
    var dataTransfer = touchDndCustomEvents.dataTransfer
    var draggedItem = touchDndCustomEvents.draggedItem
    var dragPreview = touchDndCustomEvents.store.dragPreviewElement
    var previewContainer = updateDragPreview(dragPreview, x, y)

    touchDndCustomEvents.store.mode = 'readwrite'
    simulateEvent('touchdrag', event, dataTransfer, draggedItem)

    // hide dragPreview so we can get the element underneath
    previewContainer.hidden = true
    var draggedOver = document.elementFromPoint(x, y)
    previewContainer.hidden = false // show dragPreview again

    var lastDraggedOver = touchDndCustomEvents.lastDraggedOver
    if (lastDraggedOver !== draggedOver) {
      if (lastDraggedOver) {
        simulateEvent('touchdragleave', event, dataTransfer, lastDraggedOver)
      }
      simulateEvent('touchdragenter', event, dataTransfer, draggedOver)

      touchDndCustomEvents.lastDraggedOver = draggedOver
    }
  }
}

function handleTouchEnd (event) {
  if (touchDndCustomEvents.draggedItem) {
    event.preventDefault()

    var x = event.changedTouches[0].clientX
    var y = event.changedTouches[0].clientY
    var target = document.elementFromPoint(x, y)

    var dataTransfer = touchDndCustomEvents.dataTransfer

    touchDndCustomEvents.store.mode = 'readonly'
    simulateEvent('touchdrop', event, dataTransfer, target)

    touchDndCustomEvents.store.mode = 'protected'
    simulateEvent('touchdragend', event, dataTransfer, target)

    touchDndCustomEvents.store = null
    touchDndCustomEvents.dataTransfer = null
    touchDndCustomEvents.lastDraggedOver = null
    touchDndCustomEvents.draggedItem = null

    removeDragPreview()
  }
}
