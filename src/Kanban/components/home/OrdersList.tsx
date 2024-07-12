import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faKey } from '@fortawesome/free-solid-svg-icons';

import { useSelectOrdersQuery } from '../../api/endpoints/order.endpoint';

import '../../css/UsersList.css';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';

// Componente `OrdersList`
const OrdersList: React.FC = () => {
  const { data: list, error } = useSelectOrdersQuery();

  const handleEditOrder = (orderId: number) => {
    // Lógica para edição do pedido
    console.log(`Editar pedido com ID ${orderId}`);
  };

  const handleRemoveOrder = (orderId: number) => {
    // Lógica para remoção do pedido
    console.log(`Remover pedido com ID ${orderId}`);
  };

  const handleResetOrder = (orderId: number) => {
    // Lógica para resetar o pedido
    console.log(`Resetar pedido com ID ${orderId}`);
  };

  // Type guard to check if error is of type FetchBaseQueryError
  const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError => {
    return error && typeof error === 'object' && 'status' in error;
  };

  return (
    <div className="container">
      <h1 className="mt-12">Orders List</h1>
      <div className="row">
        <div className="col-md-12">
          <table style={{ border: '1px solid #ddd', borderCollapse: 'collapse', width: '100%' }}>
            <thead style={{ backgroundColor: '#f2f2f2' }}>
              <tr>
                <th style={{ minWidth: '50px' }}>ID</th>
                <th style={{ minWidth: '100px' }}>User ID</th>
                <th style={{ minWidth: '150px' }}>Value</th>
                <th style={{ minWidth: '200px' }}>Order Type</th>
                <th style={{ minWidth: '250px' }}>Address From</th>
                <th style={{ minWidth: '250px' }}>Address To</th>
                <th style={{ minWidth: '200px' }}>Created At</th>
                <th style={{ minWidth: '200px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list && list.map(order => (
                <tr key={order.id}>
                  <td style={{ maxWidth: '100px', wordBreak: 'break-word' }}>{order.id}</td>
                  <td style={{ maxWidth: '100px', wordBreak: 'break-word' }}>{order.userId}</td>
                  <td style={{ maxWidth: '150px', wordBreak: 'break-word' }}>{order.value}</td>
                  <td style={{ maxWidth: '200px', wordBreak: 'break-word' }}>{order.orderType}</td>
                  <td style={{ maxWidth: '250px', wordBreak: 'break-word' }}>{order.addressFrom}</td>
                  <td style={{ maxWidth: '250px', wordBreak: 'break-word' }}>{order.addressTo}</td>
                  <td style={{ maxWidth: '200px', wordBreak: 'break-word' }}>{new Date(order.createAt).toLocaleString()}</td>
                  <td style={{ minWidth: '150px' }}>
                    <button onClick={() => handleEditOrder(order.id)} className="btn btn-primary btn-sm mr-1">
                      <FontAwesomeIcon icon={faEdit} className="mr-1" /> 
                    </button>
                    <button onClick={() => handleResetOrder(order.id)} className="btn btn-info btn-sm mr-1">
                      <FontAwesomeIcon icon={faKey} className="mr-1" /> 
                    </button>
                    <button onClick={() => handleRemoveOrder(order.id)} className="btn btn-danger btn-sm">
                      <FontAwesomeIcon icon={faTrash} className="mr-1" /> 
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {error && (
            <p className="text-danger">
              {isFetchBaseQueryError(error) ? error.status : 'An error occurred'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
