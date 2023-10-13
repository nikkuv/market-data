"use client";
import styles from "./page.module.css";
import './globals.css'
import React, { useState, useEffect } from "react";

const getColor = (price, comparisonPrice) => {
  if (comparisonPrice === null) return "black";
  return price > comparisonPrice
    ? "green"
    : price < comparisonPrice
    ? "red"
    : "black";
};

export default function Home() {
  const [data, setData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);

  const fetchData = async () => {
    const response = await fetch(
      "https://f68370a9-1a80-4b78-b83c-8cb61539ecd6.mock.pstmn.io/api/v1/get_market_data/"
    );
    const data = await response.json();
    setData(data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePrev = () => {
    setStartIndex((prevIndex) => Math.max(0, prevIndex - 7));
  };

  const handleNext = () => {
    setStartIndex((prevIndex) => Math.min(data.length - 7, prevIndex + 7));
  };

  const renderTableHeaders = () => {
    return data
      .slice(startIndex, startIndex + 7)
      .map((item) => {
        const date = item.date;
        const datePart = date.split("T")[0];
        return <th className={styles.tableHeaderText} key={item.date}>{datePart}</th>
      });
  };

  const renderOpeningPrices = () => {
    return data.slice(startIndex, startIndex + 7).map((item, index, arr) => (
      <td
        key={item.date}
        className={styles.rows}
        style={{
          color: getColor(item.open, index > 0 ? arr[index - 1].close : null),
        }}
      >
        {item.open}
      </td>
    ));
  };

  const renderClosingPrices = () => {
    return data.slice(startIndex, startIndex + 7).map((item) => (
      <td className={styles.rows} key={item.date} style={{ color: getColor(item.close, item.open) }}>
        {item.close}
      </td>
    ));
  };

  return (
    <div className={styles.page}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th></th>
              {renderTableHeaders()}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Opening Price</td>
              {renderOpeningPrices()}
            </tr>
            <tr>
              <td>Closing Price</td>
              {renderClosingPrices()}
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <button className={styles.button} onClick={handlePrev} disabled={startIndex === 0}>
          Prev
        </button>
        <button className={styles.button} onClick={handleNext} disabled={startIndex + 7 >= data.length}>
          Next
        </button>
      </div>
    </div>
  );
}

