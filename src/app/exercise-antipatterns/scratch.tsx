import { useEffect, useState } from "react";

type Order = {
  type: "cappuccino" | "espresso" | "latte" | "mocha";
  price: number;
  quantity: number;
};

function App() {
  const [orders, setOrders] = useState<Order[]>([]);

  const total = orders.reduce((acc, item) => {
    acc = acc + item.price * item.quantity;
    return acc;
  }, 0);

  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map((o) => (
          <li key={o.type}>{o.type}</li>
        ))}
      </ul>
      <p>Total : {total}</p>
    </div>
  );
}
