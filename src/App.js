import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Table } from 'react-bootstrap';
import parse from 'html-react-parser';

const socket = io('http://localhost:8001');

function App() {
  const [dataTranding, setData] = useState([]);
  const [oldData, setOldData] = useState([]);
  useEffect(() => {
    // Socket.io events
    socket.on('connect', () => {
      console.log('Connected to server!');
    });

    socket.on('detect-profit', (data) => {
      if (data.length === 0) {
        setData(oldData);
      } else {
        setData(data);
        setOldData(data);
      }
      console.log('Received data:', data);
    });

    // Clean up
    return () => {
      socket.off('connect');
      socket.off('message');
    };
  }, [oldData]);

  // function handleClick() {
  //   socket.emit('message', 'Hello, server!');
  // }

  return (
    <div>
      <h1>Binance Triangular Arbitrage Scanner</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th># No</th>
            <th>Opportunity pairs</th>
            <th>Profit(%)</th>
          </tr>
        </thead>
        <tbody>
          {dataTranding.map((item, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{parse(item.tpath)}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default App;
