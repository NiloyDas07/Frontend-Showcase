import { useId } from "react";

export default function InputBox({
  label,
  amount,
  onAmountChange,
  onCurrencyChange,
  currencyOptions = [],
  selectCurrency = "usd",
  amountDisable = false,
  currencyDisable = false,
  className = "",
}) {
  const amountInputId = useId();

  return (
    <div className={`flex rounded-lg bg-white p-3 text-sm ${className}`}>
      <div className="w-1/2">
        <label
          htmlFor={amountInputId}
          className="mb-2 inline-block text-black/40"
        >
          {label}
        </label>
        <input
          type="number"
          step="0.0000000000000000000001"
          min="0"
          id={amountInputId}
          className="w-full bg-transparent py-1.5 outline-none"
          placeholder="Amount"
          disabled={amountDisable}
          value={amount}
          onChange={(e) => onAmountChange && onAmountChange(e.target.value)}
        />
      </div>

      <div className="flex w-1/2 flex-wrap justify-end text-right">
        <p className="mb-2 w-full text-black/40">Currency Type</p>

        <select
          className="cursor-pointer rounded-lg bg-gray-100 px-1 py-1 outline-none"
          value={selectCurrency}
          onChange={(e) => onCurrencyChange && onCurrencyChange(e.target.value)}
          disabled={currencyDisable}
        >
          {currencyOptions.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
