/**
 * Fetches currency information from the provided currency code.
 *
 * @param {string} currency - The currency type to fetch information for.
 * @return {Object} - The fetched currency information.
 */

import { useEffect, useState } from "react";

export default function useCurrencyInfo(currency) {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`
    )
      .then((res) => res.json())
      .then((res) => setData(res[currency]));
    console.log(data);
  }, [currency]);

  return data;
}
