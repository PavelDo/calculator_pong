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
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`

const Button = styled.button<{ $isOperator?: boolean }>`
  padding: 15px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${props => props.$isOperator ? '#4CAF50' : '#e9ecef'};
  color: ${props => props.$isOperator ? 'white' : 'black'};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.$isOperator ? '#45a049' : '#dee2e6'};
  }
`

const BasicMode = () => {
  const [display, setDisplay] = useState('0')
  const [firstOperand, setFirstOperand] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)

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

  return (
    <Container>
      <Display>{display}</Display>
      <ButtonGrid>
        <Button onClick={clearDisplay}>C</Button>
        <Button onClick={() => setDisplay(String(-parseFloat(display)))}>±</Button>
        <Button onClick={() => setDisplay(String(parseFloat(display) / 100))}>%</Button>
        <Button $isOperator onClick={() => handleOperator('÷')}>÷</Button>

        <Button onClick={() => inputDigit('7')}>7</Button>
        <Button onClick={() => inputDigit('8')}>8</Button>
        <Button onClick={() => inputDigit('9')}>9</Button>
        <Button $isOperator onClick={() => handleOperator('×')}>×</Button>

        <Button onClick={() => inputDigit('4')}>4</Button>
        <Button onClick={() => inputDigit('5')}>5</Button>
        <Button onClick={() => inputDigit('6')}>6</Button>
        <Button $isOperator onClick={() => handleOperator('-')}>-</Button>

        <Button onClick={() => inputDigit('1')}>1</Button>
        <Button onClick={() => inputDigit('2')}>2</Button>
        <Button onClick={() => inputDigit('3')}>3</Button>
        <Button $isOperator onClick={() => handleOperator('+')}>+</Button>

        <Button onClick={() => inputDigit('0')}>0</Button>
        <Button onClick={inputDecimal}>.</Button>
        <Button onClick={() => setDisplay('0')}>AC</Button>
        <Button $isOperator onClick={handleEquals}>=</Button>
      </ButtonGrid>
    </Container>
  )
}

export default BasicMode 