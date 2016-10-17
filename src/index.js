import DragDataStore from './DragDataStore'
import DataTransfer from './DataTransfer'
import simulateEvent from './simulateEvent'

export default function setupTouchDNDCustomEvents() {
  window.touchDnd = {
    store: null,
    dataTransfer: null,
    lastDraggedOver: null,
    draggedItem: null
  }

  var touchDnd = window.touchDnd

  document.addEventListener('touchstart', handleTouchStart, true)
  document.addEventListener('touchend', handleTouchEnd, true)
  document.addEventListener('touchmove', handleTouchMove, true)
}

function handleTouchStart (event) {
  if (event.target.hasAttribute("draggable")) {
    event.preventDefault()

    var target = document.elementFromPoint(
      event.changedTouches[0].clientX,
      event.changedTouches[0].clientY
    )

    var store = new DragDataStore()
    var dataTransfer = new DataTransfer(store)

    touchDnd.store = store
    touchDnd.dataTransfer = dataTransfer
    touchDnd.draggedItem = target

    store.mode = 'readwrite'

    simulateEvent('touchdragstart', event, dataTransfer, target)
  }
}

function handleTouchMove (event) {
  if (touchDnd.draggedItem) {
    event.preventDefault()

    touchDnd.store.mode = 'readwrite'
    var dataTransfer = touchDnd.dataTransfer

    simulateEvent('touchdrag', event, dataTransfer, touchDnd.draggedItem)

    var lastDraggedOver = touchDnd.lastDraggedOver

    var draggedOverTarget = document.elementFromPoint(
      event.changedTouches[0].clientX,
      event.changedTouches[0].clientY
    )

    if (lastDraggedOver !== draggedOverTarget) {
      if (lastDraggedOver) {
        simulateEvent('touchdragleave', event, dataTransfer, lastDraggedOver)
      }

      simulateEvent('touchdragenter', event, dataTransfer, draggedOverTarget)

      touchDnd.lastDraggedOver = draggedOverTarget
    }
  }
}

function handleTouchEnd (event) {
  if (touchDnd.draggedItem) {
    event.preventDefault()

    var target = document.elementFromPoint(
      event.changedTouches[0].clientX,
      event.changedTouches[0].clientY
    )

    var store = touchDnd.store
    var dataTransfer = touchDnd.dataTransfer

    store.mode = 'readonly'
    simulateEvent('touchdrop', event, dataTransfer, target)

    store.mode = 'protected'
    simulateEvent('touchdragend', event, dataTransfer, target)

    touchDnd.store = null
    touchDnd.dataTransfer = null
    touchDnd.draggedItem = null
  }
}


