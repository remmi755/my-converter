import React from 'react';
import { Block } from './Block';
import './index.scss';

function App() {
  const [fromCurrency, setFromCurrency] = React.useState('UAH')
  const [toCurrency, setToCurrency] = React.useState('USD')
  const [fromPrice, setFromPrice] = React.useState('')
  const [toPrice, setToPrice] = React.useState('')
  const [rates, setRates] = React.useState([])
  // const ratesRef = React.useRef([])

  React.useEffect(() => {
    fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
        .then((res) => res.json())
        .then((json) => {
          const date = json[0].exchangedate
          json = [...json, {r030: 1, txt: 'Українська гривна', rate: 1, cc: 'UAH', exchangedate: date}]
          setRates(json)
          console.log(json)
          // ratesRef.current = json;
        })
        .catch((err) => {
          console.warn(err)
          alert('Не удалось получить информацию')
        })
  }, [])

  const foundCurrencyFrom = () => {
    const currencyValueFrom = rates.filter((cur) => cur.cc === fromCurrency);
    return  currencyValueFrom[0]?.rate;
  }

  const foundCurrencyTo = () => {
    const  currencyValueTo = rates.filter((cur) => cur.cc === toCurrency);
    return  currencyValueTo[0]?.rate;
  }

  let valueFrom = foundCurrencyFrom()
  let valueTo = foundCurrencyTo()

  const onChangeFromPrice =  (value) => {
    const result =  (valueFrom / valueTo * value);
    setToPrice(result.toFixed(2))
    setFromPrice(value)
  }

  const onChangeToPrice =  (value) => {
    const result = (valueTo / valueFrom) * value
    setFromPrice(result.toFixed(2))
    setToPrice(value)
  }

  React.useEffect(() => {
    onChangeFromPrice(fromPrice)
  }, [fromCurrency])

  React.useEffect(() => {
    onChangeToPrice(toPrice)
  }, [toCurrency])

  return (
      <>
          <div className="title">
                  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=30&pause=1000&center=true&width=700&height=100&lines=Milena's+currency+converter;in+real+time" alt="Typing SVG" />
          </div>
          <div className="App">
              <Block value={fromPrice}
                     currency={fromCurrency}
                     onChangeCurrency={setFromCurrency}
                     onChangeValue={onChangeFromPrice}/>
              <Block value={toPrice}
                     currency={toCurrency}
                     onChangeCurrency={setToCurrency}
                     onChangeValue={onChangeToPrice}/>
          </div>
      </>

  );
}

export default App;
