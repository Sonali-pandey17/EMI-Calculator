
import { useEffect, useState } from 'react';
import './App.css';
import { tenureData } from './utils/constants';
import { numberWithCommas } from './utils/config';
function App() {
  const [cost, setCost] = useState(0);
  const [interest, setInterest] = useState(10);
  const [fee, setFee] = useState(1);
  const [tenure, setTenure] = useState(12);
  const [downPayment, setDownPayment] = useState(0);
  const [emi, setEmi] = useState(0);
  const calculateEmi = (downPayment) => {
    //EMI amount = [P x R x (1+R)^N]/[(1+R)^N-1]
    if(!cost || cost <= 0) return;

    const loanAmt = cost - downPayment;
    const rateOfInterest = interest / 100;
    const monthlyInterestRate = interest / 100 / 12;
    const numberOfYrs = tenure/12;
    const numOfMonths = tenure;

    if (monthlyInterestRate === 0) {
      // If interest rate is 0, calculate EMI as simple division
      return loanAmt / numOfMonths;
    }

    const EMI = (loanAmt * rateOfInterest * (1+rateOfInterest)** numberOfYrs)/((1+rateOfInterest)** numberOfYrs-1);
    return Number(EMI/12).toFixed(0);
  }

  const calculateDP = () => {
    if(!cost || cost <= 0) return;

    const downPaymentPercent = 100 - (emi / calculateEmi(0)) * 100;
    return Number((downPaymentPercent / 100) * cost).toFixed(0);
  }

  useEffect(()=>{
    if(!(cost>0)){
      setDownPayment(0);
      setEmi(0);
      return;
    }

    const emi = calculateEmi(downPayment);
    setEmi(emi);
  },[[cost, downPayment, tenure]]);

  const updateEmi = (e) => {
    if(!cost || cost <= 0) return;

    const dp = Number(e.target.value);
    setDownPayment(dp.toFixed(0));

    const emi = calculateEmi(dp);
    setEmi(emi);
    
  }
  const updateDownPayment = (e) =>{
    if(!cost || cost <= 0) return;

    const emi = Number(e.target.value);
    setEmi(emi.toFixed(0));

    const dp = calculateDP(emi);
    setDownPayment(dp);

  }
  

  return (
    <div className="App">
        <span className="title">EMI Calculator</span>

        <span className="title1">Total Cost of Asset</span>
        <input 
        className='input'
        value={cost}
        type='number'
        onChange={(e) => setCost(e.target.value)}
        placeholder="Total Cost of Assets"
        />

        <span className="title1">Interest Rate (in %)</span>
        <input 
        className='input'
        value={interest}
        type='number'
        onChange={(e) => setInterest(e.target.value)}
        placeholder=""
        />

        <span className="title1">Processing Fee (in %)</span>
        <input 
        className='input'
        value={fee}
        type='number'
        onChange={(e) => setFee(e.target.value)}
        placeholder=""
        />

        <span className="title1">Down Payment</span>
        <span className="title1" style={{textDecoration:'underline'}}>
          {" "}
          Total Down Payment - {numberWithCommas((Number(downPayment) + (cost - downPayment) * (fee / 100)).toFixed(0))}</span>
        <div>
          <input 
        type='range'
        min={0}
        max={cost}
        className='slider'
        value={downPayment}
        onChange={updateEmi}
        />
        <div className='labels'>
          <label>0%</label>
          <b>{numberWithCommas(downPayment)}</b>
          <label>100%</label>
        </div>
        </div>
        

        <span className="title1">Loan Per Month</span>
        <span className="title1" style={{textDecoration:'underline'}}>
          {" "}
          Total Loan Amount - {numberWithCommas((emi * tenure).toFixed(0))}</span>
        <div>
          <input 
        type='range'
        min={calculateEmi(cost)}
        max={calculateEmi(0)}
        className='slider'
        value={emi}
        onChange={updateDownPayment}
        />
        </div>
        <div className='labels'>
          <label>{numberWithCommas(calculateEmi(cost))}</label>
          <b>{numberWithCommas(emi)}</b>
          <label>{numberWithCommas(calculateEmi(0))}</label>
        </div>

        <span className="title1">Tenure</span>
        <div className='tenureContainer'>
          {tenureData.map((t)=>{
            return <button className={`tenure ${t === tenure ? 'selected' : ''}`} onClick={()=>setTenure(t)}>{t}</button>
          })}
        </div>
        
    </div>
  );
}

export default App;
