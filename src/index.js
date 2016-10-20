import DragDataStore from './DragDataStore'
import DataTransfer from './DataTransfer'
import simulateEvent from './simulateEvent'

export default function setupTouchDNDCustomEvents() {
  window.touchDnd = {
    store: null,
    dataTransfer: null,
    lastDraggedOver: null,
    draggedItem: null,
    clientX: 0,
    clientY: 0
  }

  var touchDnd = window.touchDnd

  document.addEventListener('touchstart', handleTouchStart, true)
  document.addEventListener('touchend', handleTouchEnd, true)
  document.addEventListener('touchmove', handleTouchMove, true)
}

function updateDragPreview(store, clientX, clientY) {
  var top = clientY - store.dragPreviewY
  var left = clientX - store.dragPreviewX
  var width = store.dragPreviewWidth
  var height = store.dragPreviewHeight

  var style = 'position:fixed; top:' + top + 'px; left:' + left + 'px; width:' + width + 'px; height:' +  height + 'px;'

  var previewContainer = document.getElementById('touchDndPreviewContainer')
  if (previewContainer) {
    previewContainer.style = style;
  } else {
    previewContainer = document.createElement("div")
    previewContainer.id = 'touchDndPreviewContainer'
    previewContainer.appendChild(store.dragPreviewElement)
    previewContainer.style = style;
    document.body.appendChild(previewContainer)
  }

  return previewContainer
}

function removeDragPreview() {
  var previewContainer = document.getElementById('touchDndPreviewContainer')
  if (previewContainer) {
    document.body.removeChild(previewContainer)
  }
}

function handleTouchStart (event) {
  if (event.target.hasAttribute("draggable")) {
    event.preventDefault()

    touchDnd.clientX = event.changedTouches[0].clientX
    touchDnd.clientY = event.changedTouches[0].clientY

    var target = document.elementFromPoint(touchDnd.clientX, touchDnd.clientY)

    var store = new DragDataStore()
    var dataTransfer = new DataTransfer(store)

    touchDnd.store = store
    touchDnd.dataTransfer = dataTransfer
    touchDnd.draggedItem = target

    store.mode = 'readwrite'

    simulateEvent('touchdragstart', event, dataTransfer, target)

    var previewContainer = updateDragPreview(
      touchDnd.store,
      touchDnd.clientX,
      touchDnd.clientY
    )
  }
}

function handleTouchMove (event) {
  if (touchDnd.draggedItem) {
    event.preventDefault()

    touchDnd.clientX = event.changedTouches[0].clientX
    touchDnd.clientY = event.changedTouches[0].clientY

    touchDnd.store.mode = 'readwrite'

    var previewContainer = updateDragPreview(
      touchDnd.store,
      touchDnd.clientX,
      touchDnd.clientY
    )

    var dataTransfer = touchDnd.dataTransfer

    simulateEvent('touchdrag', event, dataTransfer, touchDnd.draggedItem)

    var lastDraggedOver = touchDnd.lastDraggedOver

    // hide dragPreview so we can get the element underneath
    previewContainer.hidden = true
    var draggedOverTarget = document.elementFromPoint(
      touchDnd.clientX,
      touchDnd.clientY
    )
    previewContainer.hidden = false // show dragPreview again

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

    touchDnd.clientX = event.changedTouches[0].clientX
    touchDnd.clientY = event.changedTouches[0].clientY

    var target = document.elementFromPoint(touchDnd.clientX, touchDnd.clientY)

    var store = touchDnd.store
    var dataTransfer = touchDnd.dataTransfer

    store.mode = 'readonly'
    simulateEvent('touchdrop', event, dataTransfer, target)

    store.mode = 'protected'
    simulateEvent('touchdragend', event, dataTransfer, target)

    touchDnd.store = null
    touchDnd.dataTransfer = null
    touchDnd.draggedItem = null

    removeDragPreview()
  }
}


