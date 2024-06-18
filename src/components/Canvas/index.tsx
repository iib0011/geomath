import { useEffect, useRef } from 'react'
import { Grid } from './Grid'

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext('2d', { alpha: false })

      if (context == null) return
      let grid: Grid
      let mouseStartX: number
      let mouseStartY: number

      let mousePosX = 0
      let mousePosY = 0

      const onResize = () => {
        // Déterminer la résolution d'affichage

        const stdCanvasW = document.body.clientWidth - 2 * canvas.offsetLeft
        const stdCanvasH = stdCanvasW / 2
        const optCanvasW = stdCanvasW * window.devicePixelRatio
        const optCanvasH = stdCanvasH * window.devicePixelRatio

        if (window.devicePixelRatio > 1) {
          canvas.width = optCanvasW
          canvas.height = optCanvasH
          context.scale(window.devicePixelRatio, window.devicePixelRatio)
        } else {
          canvas.width = stdCanvasW
          canvas.height = stdCanvasH
        }

        canvas.style.width = stdCanvasW + 'px'
        canvas.style.height = stdCanvasH + 'px'

        // Créer et afficher la grille
        grid = new Grid({
          stdCanvasH,
          stdCanvasW,
          canvas,
          context,
          minCellSize: 20
        })
        grid.draw()
      }

      onResize()

      // events

      window.addEventListener('resize', onResize)

      // Zoomer le canvas avec la roulette
      canvas.addEventListener('wheel', function (e) {
        e.preventDefault()
        e.stopPropagation()

        const zoom = -e.deltaY / 10
        grid.setZoom(zoom, mousePosX, mousePosY)
      })

      // Pan canvas on drag

      canvas.addEventListener('mousedown', function (e) {
        e.preventDefault()
        e.stopPropagation()

        mouseStartX = e.clientX - canvas.offsetLeft
        mouseStartY = e.clientY - canvas.offsetTop

        canvas.onmousemove = (e) => {
          e.preventDefault()
          e.stopPropagation()

          grid.setPan(mouseStartX, mouseStartY, mousePosX, mousePosY)
        }
      })

      canvas.addEventListener('mousemove', (e) => {
        e.preventDefault()
        e.stopPropagation()

        mousePosX = e.clientX - canvas.offsetLeft
        mousePosY = e.clientY - canvas.offsetTop
      })

      canvas.addEventListener('mouseup', (e) => {
        e.preventDefault()
        e.stopPropagation()

        canvas.onmousemove = null
        canvas.onwheel = null

        // Get last (0;0) coordinates
        grid.lastAxisPosX = grid.axisPosX
        grid.lastAxisPosY = grid.axisPosY
      })

      canvas.addEventListener('mouseout', function (e) {
        e.preventDefault()
        e.stopPropagation()

        canvas.onmousemove = null
        canvas.onwheel = null

        // Get last (0;0) coordinates
        grid.lastAxisPosX = grid.axisPosX
        grid.lastAxisPosY = grid.axisPosY
      })
    }
  }, [])
  return <canvas ref={canvasRef}></canvas>
}

export default Canvas
