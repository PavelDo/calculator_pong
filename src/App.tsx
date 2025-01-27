import { useState, useEffect } from 'react'
import styled from 'styled-components'
import BasicMode from './components/Calculator/BasicMode'
import ScientificMode from './components/Calculator/ScientificMode'
import PongGame from './components/Pong/PongGame'

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
`

interface CalculatorProps {
  $isScientific: boolean;
}

const Calculator = styled.div<CalculatorProps>`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: ${props => props.$isScientific ? '500px' : '350px'};
  transition: max-width 0.3s ease;
`

const ModeToggle = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`

function App() {
  const [isScientific, setIsScientific] = useState(false)
  const [showPong, setShowPong] = useState(false)
  const [cmdPressed, setCmdPressed] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Meta') {
        setCmdPressed(true)
      } else if (cmdPressed && e.key === '1') {
        setShowPong(prev => !prev)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Meta') {
        setCmdPressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [cmdPressed])

  return (
    <AppContainer>
      {showPong ? (
        <PongGame onClose={() => setShowPong(false)} />
      ) : (
        <Calculator $isScientific={isScientific}>
          <ModeToggle onClick={() => setIsScientific(prev => !prev)}>
            {isScientific ? 'Switch to Basic' : 'Switch to Scientific'}
          </ModeToggle>
          {isScientific ? <ScientificMode /> : <BasicMode />}
        </Calculator>
      )}
    </AppContainer>
  )
}

export default App
