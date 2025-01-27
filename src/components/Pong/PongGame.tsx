import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

interface PongGameProps {
  onClose: () => void
}

const GameContainer = styled.div`
  position: relative;
  background: #000;
  border-radius: 10px;
  padding: 20px;
`

const Canvas = styled.canvas`
  border: 2px solid #fff;
  border-radius: 5px;
`

const Score = styled.div`
  color: #fff;
  font-size: 24px;
  font-family: monospace;
  text-align: center;
  margin-bottom: 10px;
`

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #0096E0;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #007bbf;
  }
`

interface Ball {
  x: number
  y: number
  radius: number
  dx: number
  dy: number
}

interface Paddle {
  x: number
  y: number
  width: number
  height: number
  dy: number
}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400
const PADDLE_WIDTH = 10
const PADDLE_HEIGHT = 60
const BALL_RADIUS = 5
const PADDLE_SPEED = 5
const INITIAL_BALL_SPEED = 5

const PongGame: React.FC<PongGameProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const intervalRef = useRef<number>()
  const [gameStarted, setGameStarted] = useState(false)

  const ball = useRef<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    radius: BALL_RADIUS,
    dx: 0, // Start with 0 velocity
    dy: 0
  })

  const playerPaddle = useRef<Paddle>({
    x: 50,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
  })

  const aiPaddle = useRef<Paddle>({
    x: CANVAS_WIDTH - 50 - PADDLE_WIDTH,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
  })

  const resetBall = () => {
    const randomAngle = (Math.random() * Math.PI / 4) + Math.PI / 8 // angle between PI/8 and 3PI/8
    const direction = Math.random() > 0.5 ? 1 : -1
    
    ball.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      radius: BALL_RADIUS,
      dx: INITIAL_BALL_SPEED * Math.cos(randomAngle) * direction,
      dy: INITIAL_BALL_SPEED * Math.sin(randomAngle) * (Math.random() > 0.5 ? 1 : -1)
    }
  }

  const startGame = () => {
    if (!gameStarted) {
      resetBall()
      setGameStarted(true)
    }
  }

  const draw = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw center line
    ctx.setLineDash([5, 15])
    ctx.beginPath()
    ctx.moveTo(CANVAS_WIDTH / 2, 0)
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)
    ctx.strokeStyle = '#fff'
    ctx.stroke()
    ctx.setLineDash([])

    // Draw ball
    ctx.beginPath()
    ctx.arc(ball.current.x, ball.current.y, ball.current.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.closePath()

    // Draw paddles
    ctx.fillStyle = '#fff'
    ctx.fillRect(
      playerPaddle.current.x,
      playerPaddle.current.y,
      playerPaddle.current.width,
      playerPaddle.current.height
    )
    ctx.fillRect(
      aiPaddle.current.x,
      aiPaddle.current.y,
      aiPaddle.current.width,
      aiPaddle.current.height
    )

    // Draw "Press any key to start" if game hasn't started
    if (!gameStarted) {
      ctx.fillStyle = '#fff'
      ctx.font = '20px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Press any key to start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50)
    }
  }

  const update = () => {
    if (!gameStarted) return

    // Move ball
    ball.current.x += ball.current.dx
    ball.current.y += ball.current.dy

    // Ball collision with top and bottom walls
    if (ball.current.y - ball.current.radius <= 0 || 
        ball.current.y + ball.current.radius >= CANVAS_HEIGHT) {
      ball.current.dy *= -1
    }

    // Ball collision with paddles
    const paddleCollision = (paddle: Paddle) => {
      const nextX = ball.current.x + ball.current.dx
      return (
        nextX - ball.current.radius < paddle.x + paddle.width &&
        nextX + ball.current.radius > paddle.x &&
        ball.current.y > paddle.y &&
        ball.current.y < paddle.y + paddle.height
      )
    }

    if (paddleCollision(playerPaddle.current)) {
      // Calculate angle based on where the ball hits the paddle
      const relativeIntersectY = (playerPaddle.current.y + (PADDLE_HEIGHT / 2)) - ball.current.y
      const normalizedIntersectY = relativeIntersectY / (PADDLE_HEIGHT / 2)
      const bounceAngle = normalizedIntersectY * Math.PI / 3 // Increased angle range

      const speed = Math.sqrt(ball.current.dx * ball.current.dx + ball.current.dy * ball.current.dy)
      ball.current.dx = Math.abs(speed * Math.cos(bounceAngle)) // Always positive
      ball.current.dy = -speed * Math.sin(bounceAngle)
      
      // Move ball out of paddle to prevent multiple collisions
      ball.current.x = playerPaddle.current.x + playerPaddle.current.width + ball.current.radius
    }

    if (paddleCollision(aiPaddle.current)) {
      // Similar angle calculation for AI paddle
      const relativeIntersectY = (aiPaddle.current.y + (PADDLE_HEIGHT / 2)) - ball.current.y
      const normalizedIntersectY = relativeIntersectY / (PADDLE_HEIGHT / 2)
      const bounceAngle = normalizedIntersectY * Math.PI / 3 // Increased angle range

      const speed = Math.sqrt(ball.current.dx * ball.current.dx + ball.current.dy * ball.current.dy)
      ball.current.dx = -Math.abs(speed * Math.cos(bounceAngle)) // Always negative
      ball.current.dy = -speed * Math.sin(bounceAngle)
      
      // Move ball out of paddle to prevent multiple collisions
      ball.current.x = aiPaddle.current.x - ball.current.radius
    }

    // Score points
    if (ball.current.x + ball.current.radius > CANVAS_WIDTH) {
      setPlayerScore(prev => prev + 1)
      resetBall()
      setGameStarted(false)
    } else if (ball.current.x - ball.current.radius < 0) {
      setAiScore(prev => prev + 1)
      resetBall()
      setGameStarted(false)
    }

    // Move player paddle
    playerPaddle.current.y += playerPaddle.current.dy
    if (playerPaddle.current.y < 0) playerPaddle.current.y = 0
    if (playerPaddle.current.y + playerPaddle.current.height > CANVAS_HEIGHT) {
      playerPaddle.current.y = CANVAS_HEIGHT - playerPaddle.current.height
    }

    // AI paddle movement with improved tracking
    const aiSpeed = 5
    const paddleCenter = aiPaddle.current.y + aiPaddle.current.height / 2
    const ballY = ball.current.y
    const prediction = ball.current.y + (ball.current.dy * 
      ((aiPaddle.current.x - ball.current.x) / Math.abs(ball.current.dx || 1)))

    // Only move if the ball is moving towards the AI
    if (ball.current.dx > 0) {
      if (paddleCenter < prediction - 10) {
        aiPaddle.current.y += aiSpeed
      } else if (paddleCenter > prediction + 10) {
        aiPaddle.current.y -= aiSpeed
      }
    } else {
      // Return to center when ball is moving away
      if (paddleCenter < CANVAS_HEIGHT / 2 - 10) {
        aiPaddle.current.y += aiSpeed / 2
      } else if (paddleCenter > CANVAS_HEIGHT / 2 + 10) {
        aiPaddle.current.y -= aiSpeed / 2
      }
    }

    if (aiPaddle.current.y < 0) aiPaddle.current.y = 0
    if (aiPaddle.current.y + aiPaddle.current.height > CANVAS_HEIGHT) {
      aiPaddle.current.y = CANVAS_HEIGHT - aiPaddle.current.height
    }
  }

  const runGameLoop = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    update()
    draw(ctx)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) {
        startGame()
        return
      }

      if (e.key === 'ArrowUp') {
        playerPaddle.current.dy = -PADDLE_SPEED
      } else if (e.key === 'ArrowDown') {
        playerPaddle.current.dy = PADDLE_SPEED
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        playerPaddle.current.dy = 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    intervalRef.current = window.setInterval(runGameLoop, 1000 / 60)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [gameStarted, onClose])

  return (
    <GameContainer>
      <Score>
        Player: {playerScore} | AI: {aiScore}
      </Score>
      <Canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <CloseButton onClick={onClose}>Close Game (Esc)</CloseButton>
    </GameContainer>
  )
}

export default PongGame 