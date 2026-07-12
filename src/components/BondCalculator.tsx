/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Calculator, Check, ArrowRight, Info, Percent, Hourglass, Landmark } from "lucide-react";

interface BondCalculatorProps {
  initialPrice?: number;
  inlineLayout?: boolean;
}

export default function BondCalculator({
  initialPrice = 2500000,
  inlineLayout = false,
}: BondCalculatorProps) {
  const [price, setPrice] = useState(initialPrice);
  const [deposit, setDeposit] = useState(250000); // 10% default
  const [interestRate, setInterestRate] = useState(11.75); // South African Prime Rate is around 11.75%
  const [termYears, setTermYears] = useState(20); // standard SA term

  const [monthlyRepayment, setMonthlyRepayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [requiredIncome, setRequiredIncome] = useState(0);

  // Sync with initialPrice if it changes
  useEffect(() => {
    if (initialPrice) {
      setPrice(initialPrice);
      setDeposit(Math.round(initialPrice * 0.1)); // 10% deposit
    }
  }, [initialPrice]);

  useEffect(() => {
    const loanAmount = Math.max(0, price - deposit);
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = termYears * 12;

    let monthly = 0;
    if (loanAmount > 0) {
      if (monthlyRate === 0) {
        monthly = loanAmount / totalMonths;
      } else {
        monthly =
          (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);
      }
    }

    const total = monthly * totalMonths;
    const interest = Math.max(0, total - loanAmount);
    const minIncome = monthly / 0.3; // standard bank affordability criteria: repayment <= 30% of gross income

    setMonthlyRepayment(monthly);
    setTotalPayment(total);
    setTotalInterest(interest);
    setRequiredIncome(minIncome);
  }, [price, deposit, interestRate, termYears]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div
      id="bond-calculator-container"
      className={`bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl ${
        inlineLayout ? "p-0 border-0" : "p-6 sm:p-8"
      }`}
    >
      {!inlineLayout && (
        <div className="mb-6 flex items-center gap-3" id="calc-header">
          <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-xl">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
              Bond Repayment Calculator
            </h3>
            <p className="text-gray-500 text-xs mt-0.5">
              Estimate your monthly South African mortgage bond commitments instantly
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="calc-grid">
        {/* Sliders Input (Left) */}
        <div className="space-y-6 lg:col-span-7" id="calc-inputs">
          {/* Purchase Price Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-700">Purchase Price</span>
              <span className="font-mono text-brand-primary font-bold text-base bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                {formatCurrency(price)}
              </span>
            </div>
            <input
              type="range"
              min={100000}
              max={30000000}
              step={50000}
              value={price}
              onChange={(e) => {
                const newPrice = Number(e.target.value);
                setPrice(newPrice);
                // Keep deposit reasonable
                if (deposit > newPrice) {
                  setDeposit(newPrice);
                }
              }}
              className="w-full accent-brand-primary h-1.5 bg-gray-200 rounded-lg cursor-pointer"
              id="slider-purchase-price"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>R100k</span>
              <span>R15.0M</span>
              <span>R30.0M</span>
            </div>
          </div>

          {/* Deposit Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-700 flex items-center gap-1">
                Cash Deposit
                <span className="text-[10px] text-gray-400 font-normal">
                  ({price > 0 ? Math.round((deposit / price) * 100) : 0}%)
                </span>
              </span>
              <span className="font-mono text-gray-700 font-bold bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                {formatCurrency(deposit)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={price}
              step={10000}
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              className="w-full accent-brand-primary h-1.5 bg-gray-200 rounded-lg cursor-pointer"
              id="slider-deposit"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>No Deposit</span>
              <span>Full Payment</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-700 flex items-center gap-1">
                <Percent className="h-3.5 w-3.5 text-brand-primary" />
                Interest Rate (Annual)
              </span>
              <span className="font-mono text-gray-700 font-bold bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                {interestRate.toFixed(2)}%
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={20}
              step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-brand-primary h-1.5 bg-gray-200 rounded-lg cursor-pointer"
              id="slider-interest-rate"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>5.0%</span>
              <span className="text-brand-secondary font-semibold">11.75% (Prime Rate)</span>
              <span>20.0%</span>
            </div>
          </div>

          {/* Repayment Term Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-700 flex items-center gap-1">
                <Hourglass className="h-3.5 w-3.5 text-brand-primary" />
                Loan Term (Years)
              </span>
              <span className="font-mono text-gray-700 font-bold bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                {termYears} Years
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={termYears}
              onChange={(e) => setTermYears(Number(e.target.value))}
              className="w-full accent-brand-primary h-1.5 bg-gray-200 rounded-lg cursor-pointer"
              id="slider-loan-term"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono">
              <span>5 Years</span>
              <span>20 Years (Standard)</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Repayment Summary Output (Right) */}
        <div className="lg:col-span-5 bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col justify-between" id="calc-summary">
          <div className="space-y-4">
            <h4 className="text-xs font-mono text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-2 flex items-center gap-1.5">
              <Landmark className="h-4 w-4 text-brand-secondary" />
              Repayment Breakdown
            </h4>

            {/* Principal Loan Amount */}
            <div className="flex items-center justify-between text-xs font-mono text-gray-500">
              <span>Principal Loan Amount:</span>
              <span className="text-gray-800 font-bold">{formatCurrency(Math.max(0, price - deposit))}</span>
            </div>

            {/* Estimated Repayment Big Title */}
            <div className="py-4 text-center border-y border-gray-200">
              <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase block mb-1">
                Estimated Monthly Repayment
              </span>
              <span id="monthly-repayment-display" className="text-3xl font-extrabold text-brand-primary tracking-tight">
                {formatCurrency(monthlyRepayment)}
              </span>
            </div>

            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between font-mono text-gray-500">
                <span>Total Interest Paid:</span>
                <span className="text-red-600 font-bold">{formatCurrency(totalInterest)}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-gray-500">
                <span>Total Bond Repayments:</span>
                <span className="text-gray-800 font-bold">{formatCurrency(totalPayment)}</span>
              </div>
            </div>
          </div>

          {/* Affordability Requirement */}
          <div className="mt-6 bg-white border border-gray-200 p-4 rounded-xl flex items-start gap-3" id="affordability-info">
            <div className="mt-0.5 p-1 bg-brand-primary/10 rounded-full text-brand-primary">
              <Info className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block mb-0.5 font-bold">
                Bank Affordability Rule
              </span>
              <span className="text-xs text-gray-600 leading-relaxed block">
                SA lenders require a combined gross income of at least{" "}
                <strong className="text-brand-primary font-bold">{formatCurrency(requiredIncome)}</strong> per month to approve this bond.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
