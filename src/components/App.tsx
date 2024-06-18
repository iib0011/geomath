import { useEffect, useRef } from 'react'
import { Grid } from './Grid/IGrid'

function App() {
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

      ///////////////////////////////////////////////////////////////////////////////////////////

      ///////////////////////////////////////////////////////////////////////////////////////////

      // Fonctions

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

      ///////////////////////////////////////////////////////////////////////////////////////////

      // Démarrage de la webapp

      onResize()

      ///////////////////////////////////////////////////////////////////////////////////////////

      // Evenements

      window.addEventListener('resize', onResize)

      // Zoomer le canvas avec la roulette
      canvas.addEventListener('wheel', function (e) {
        e.preventDefault()
        e.stopPropagation()

        const zoom = -e.deltaY / 120
        grid.setZoom(zoom, mousePosX, mousePosY)
      })

      // Pan canvas on drag

      canvas.addEventListener('mousedown', function (e) {
        e.preventDefault()
        e.stopPropagation()

        mouseStartX = e.clientX - canvas.offsetLeft
        mouseStartY = e.clientY - canvas.offsetTop

        canvas.onmousemove = function (e) {
          e.preventDefault()
          e.stopPropagation()

          grid.setPan(mouseStartX, mouseStartY, mousePosX, mousePosY)
        }
      })

      //  Récupérer les coordonnées de la souris en mouvement.
      canvas.addEventListener('mousemove', function (e) {
        e.preventDefault()
        e.stopPropagation()

        mousePosX = e.clientX - canvas.offsetLeft
        mousePosY = e.clientY - canvas.offsetTop
      })

      canvas.addEventListener('mouseup', function (e) {
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
  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}

export default App
