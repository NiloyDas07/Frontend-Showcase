import { useState } from "react";
import { InputBox } from "./components";
import useCurrencyInfo from "./hooks/useCurrencyInfo";
import bgUrl from "./assets/bg-2.jpg";

function App() {
  const [amount, setAmount] = useState();
  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("inr");
  const [convertedAmount, setConvertedAmount] = useState();

  const currencyInfo = useCurrencyInfo(from);

  const possibleConversionTypes = Object.keys(currencyInfo);

  function swap() {
    setFrom(to);
    setTo(from);
    setConvertedAmount(amount);
    setAmount(convertedAmount);
  }

  const convert = () => setConvertedAmount(amount * currencyInfo[to]);

  return (
    <div
      className="flex h-screen w-full flex-wrap items-center justify-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url('${bgUrl.src}')`,
      }}
    >
      <div className="w-full">
        <div className="mx-auto w-full max-w-md rounded-lg border border-gray-50 bg-white/30 p-5 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              convert();
            }}
          >
            <div className="mb-1 w-full">
              <InputBox
                label="From"
                amount={amount}
                currencyOptions={possibleConversionTypes}
                onAmountChange={(amount) => setAmount(amount)}
                onCurrencyChange={(currency) => setFrom(currency)}
                selectCurrency={from}
              />
            </div>

            <div className="relative h-0.5 w-full">
              <div className="bg-glass absolute left-1/2 -translate-x-1/2 -translate-y-1/2   rounded-md p-1">
                <button
                  type="button"
                  className="rounded-md  bg-blue-600 px-2 py-0.5 text-white"
                  onClick={swap}
                >
                  swap
                </button>
              </div>
            </div>
            <div className="mb-4 mt-1 w-full">
              <InputBox
                label="To"
                amount={convertedAmount}
                currencyOptions={possibleConversionTypes}
                onCurrencyChange={(currency) => setTo(currency)}
                selectCurrency={to}
                amountDisable
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white"
            >
              Convert {`${from.toUpperCase()} to ${to.toUpperCase()}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
