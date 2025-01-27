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

  const ball = useRef<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    radius: BALL_RADIUS,
    dx: INITIAL_BALL_SPEED,
    dy: INITIAL_BALL_SPEED
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
    ball.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      radius: BALL_RADIUS,
      dx: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      dy: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1)
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
  }

  const update = () => {
    // Move ball
    ball.current.x += ball.current.dx
    ball.current.y += ball.current.dy

    // Ball collision with top and bottom walls
    if (ball.current.y + ball.current.radius > CANVAS_HEIGHT || ball.current.y - ball.current.radius < 0) {
      ball.current.dy *= -1
    }

    // Ball collision with paddles
    const paddleCollision = (paddle: Paddle) => {
      return (
        ball.current.x - ball.current.radius < paddle.x + paddle.width &&
        ball.current.x + ball.current.radius > paddle.x &&
        ball.current.y > paddle.y &&
        ball.current.y < paddle.y + paddle.height
      )
    }

    if (paddleCollision(playerPaddle.current) || paddleCollision(aiPaddle.current)) {
      ball.current.dx *= -1.1 // Increase speed slightly on paddle hits
    }

    // Score points
    if (ball.current.x + ball.current.radius > CANVAS_WIDTH) {
      setPlayerScore(prev => prev + 1)
      resetBall()
    } else if (ball.current.x - ball.current.radius < 0) {
      setAiScore(prev => prev + 1)
      resetBall()
    }

    // Move player paddle
    playerPaddle.current.y += playerPaddle.current.dy
    if (playerPaddle.current.y < 0) playerPaddle.current.y = 0
    if (playerPaddle.current.y + playerPaddle.current.height > CANVAS_HEIGHT) {
      playerPaddle.current.y = CANVAS_HEIGHT - playerPaddle.current.height
    }

    // AI paddle movement
    const aiSpeed = 4
    const paddleCenter = aiPaddle.current.y + aiPaddle.current.height / 2
    const ballY = ball.current.y

    if (paddleCenter < ballY - 35) {
      aiPaddle.current.y += aiSpeed
    } else if (paddleCenter > ballY + 35) {
      aiPaddle.current.y -= aiSpeed
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
      if (e.key === 'ArrowUp') {
        playerPaddle.current.dy = -PADDLE_SPEED
      } else if (e.key === 'ArrowDown') {
        playerPaddle.current.dy = PADDLE_SPEED
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
  }, [])

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