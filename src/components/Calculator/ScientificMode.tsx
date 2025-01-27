import { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Display = styled.div`
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  text-align: right;
  font-size: 24px;
  font-family: monospace;
  min-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
`

const Button = styled.button<{ $isOperator?: boolean; $isFunction?: boolean }>`
  padding: 12px 8px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${props => {
    if (props.$isOperator) return '#4CAF50'
    if (props.$isFunction) return '#2196F3'
    return '#e9ecef'
  }};
  color: ${props => (props.$isOperator || props.$isFunction) ? 'white' : 'black'};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => {
      if (props.$isOperator) return '#45a049'
      if (props.$isFunction) return '#1976D2'
      return '#dee2e6'
    }};
  }
`

const ScientificMode = () => {
  const [display, setDisplay] = useState('0')
  const [firstOperand, setFirstOperand] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)
  const [memory, setMemory] = useState<number>(0)

  const clearDisplay = () => {
    setDisplay('0')
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit)
      setWaitingForSecondOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.')
      setWaitingForSecondOperand(false)
      return
    }

    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display)

    if (firstOperand === null) {
      setFirstOperand(inputValue)
    } else if (operator) {
      const result = performCalculation()
      setDisplay(String(result))
      setFirstOperand(result)
    }

    setWaitingForSecondOperand(true)
    setOperator(nextOperator)
  }

  const performCalculation = (): number => {
    const secondOperand = parseFloat(display)
    if (operator === '+') return firstOperand! + secondOperand
    if (operator === '-') return firstOperand! - secondOperand
    if (operator === '×') return firstOperand! * secondOperand
    if (operator === '÷') return firstOperand! / secondOperand
    if (operator === 'xⁿ') return Math.pow(firstOperand!, secondOperand)
    return secondOperand
  }

  const handleEquals = () => {
    if (!operator || firstOperand === null) return

    const result = performCalculation()
    setDisplay(String(result))
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  const handleFunction = (fn: string) => {
    const currentValue = parseFloat(display)
    let result: number

    switch (fn) {
      case 'sin':
        result = Math.sin(currentValue * Math.PI / 180)
        break
      case 'cos':
        result = Math.cos(currentValue * Math.PI / 180)
        break
      case 'tan':
        result = Math.tan(currentValue * Math.PI / 180)
        break
      case 'log':
        result = Math.log10(currentValue)
        break
      case 'ln':
        result = Math.log(currentValue)
        break
      case 'sqrt':
        result = Math.sqrt(currentValue)
        break
      case 'square':
        result = Math.pow(currentValue, 2)
        break
      default:
        return
    }

    setDisplay(String(result))
    setWaitingForSecondOperand(true)
  }

  const handleMemory = (operation: string) => {
    const currentValue = parseFloat(display)

    switch (operation) {
      case 'MC':
        setMemory(0)
        break
      case 'MR':
        setDisplay(String(memory))
        break
      case 'M+':
        setMemory(memory + currentValue)
        break
      case 'M-':
        setMemory(memory - currentValue)
        break
    }
    setWaitingForSecondOperand(true)
  }

  return (
    <Container>
      <Display>{display}</Display>
      <ButtonGrid>
        <Button $isFunction onClick={() => handleMemory('MC')}>MC</Button>
        <Button $isFunction onClick={() => handleMemory('MR')}>MR</Button>
        <Button $isFunction onClick={() => handleMemory('M+')}>M+</Button>
        <Button $isFunction onClick={() => handleMemory('M-')}>M-</Button>
        <Button onClick={clearDisplay}>C</Button>

        <Button $isFunction onClick={() => handleFunction('sin')}>sin</Button>
        <Button $isFunction onClick={() => handleFunction('cos')}>cos</Button>
        <Button $isFunction onClick={() => handleFunction('tan')}>tan</Button>
        <Button $isFunction onClick={() => setDisplay(String(Math.PI))}>π</Button>
        <Button onClick={() => setDisplay(String(-parseFloat(display)))}>±</Button>

        <Button $isFunction onClick={() => handleFunction('log')}>log</Button>
        <Button $isFunction onClick={() => handleFunction('ln')}>ln</Button>
        <Button $isFunction onClick={() => handleFunction('sqrt')}>√</Button>
        <Button $isFunction onClick={() => handleFunction('square')}>x²</Button>
        <Button $isOperator onClick={() => handleOperator('xⁿ')}>xⁿ</Button>

        <Button onClick={() => inputDigit('7')}>7</Button>
        <Button onClick={() => inputDigit('8')}>8</Button>
        <Button onClick={() => inputDigit('9')}>9</Button>
        <Button $isOperator onClick={() => handleOperator('÷')}>÷</Button>
        <Button onClick={() => setDisplay(String(Math.E))}>e</Button>

        <Button onClick={() => inputDigit('4')}>4</Button>
        <Button onClick={() => inputDigit('5')}>5</Button>
        <Button onClick={() => inputDigit('6')}>6</Button>
        <Button $isOperator onClick={() => handleOperator('×')}>×</Button>
        <Button onClick={() => setDisplay(String(parseFloat(display) / 100))}>%</Button>

        <Button onClick={() => inputDigit('1')}>1</Button>
        <Button onClick={() => inputDigit('2')}>2</Button>
        <Button onClick={() => inputDigit('3')}>3</Button>
        <Button $isOperator onClick={() => handleOperator('-')}>-</Button>
        <Button onClick={() => setDisplay('0')}>AC</Button>

        <Button onClick={() => inputDigit('0')}>0</Button>
        <Button onClick={inputDecimal}>.</Button>
        <Button $isOperator onClick={handleEquals}>=</Button>
        <Button $isOperator onClick={() => handleOperator('+')}>+</Button>
        <Button onClick={() => setDisplay(String(1/parseFloat(display)))}>1/x</Button>
      </ButtonGrid>
    </Container>
  )
}

export default ScientificMode 