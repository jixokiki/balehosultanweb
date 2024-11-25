// "use client";

// import React, { useEffect, useState } from "react";
// import { db } from "@/firebase/firebase";
// import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

// const TransactionHistory = () => {
//   const [transactions, setTransactions] = useState([]);

//   // Fungsi untuk fetch data dari Firestore
//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "cart"));
//         const data = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setTransactions(data);
//       } catch (error) {
//         console.error("Error fetching transactions:", error);
//       }
//     };

//     fetchTransactions();
//   }, []);

//   // Fungsi untuk memperbarui status di Firestore
//   const handleApproval = async (transactionId) => {
//     try {
//       const transactionDoc = doc(db, "cart", transactionId);
//       await updateDoc(transactionDoc, {
//         status: "disetujui", // Menambahkan atau memperbarui field "status"
//       });

//       // Perbarui status di state lokal
//       setTransactions((prevTransactions) =>
//         prevTransactions.map((transaction) =>
//           transaction.id === transactionId
//             ? { ...transaction, status: "disetujui" }
//             : transaction
//         )
//       );
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };

//   return (
//     <div className="transaction-history">
//       <h1 className="text-2xl font-bold mb-4">Riwayat Transaksi</h1>
//       {transactions.length === 0 ? (
//         <p>Belum ada transaksi.</p>
//       ) : (
//         transactions.map((transaction) => (
//           <div key={transaction.id} className="mb-6 border p-4 rounded">
//             <h2 className="text-xl font-semibold mb-2">Order ID: {transaction.id}</h2>
//             <p><strong>User Name:</strong> {transaction.userName || "Tidak Diketahui"}</p>
//             <p><strong>Tanggal:</strong> {new Date(transaction.timeStamp?.toDate()).toLocaleString()}</p>
//             <h3 className="text-lg font-medium mt-4">Pesanan:</h3>
//             {transaction.pesanan ? (
//               <table className="table-auto w-full border">
//                 <thead>
//                   <tr>
//                     <th>Judul</th>
//                     <th>Kategori</th>
//                     <th>Deskripsi</th>
//                     <th>Harga</th>
//                     <th>Status</th>
//                     <th>Aksi</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {transaction.pesanan.map((item, index) => (
//                     <tr key={index}>
//                       <td>{item.title}</td>
//                       <td>{item.category}</td>
//                       <td>{item.description}</td>
//                       <td>{item.price}</td>
//                       <td>{transaction.status || "Belum Disetujui"}</td>
//                       <td>
//                         <button
//                           className="bg-blue-500 text-white px-3 py-1 rounded"
//                           onClick={() => handleApproval(transaction.id)}
//                           disabled={transaction.status === "disetujui"} // Disable jika sudah disetujui
//                         >
//                           {transaction.status === "disetujui"
//                             ? "Sudah Disetujui"
//                             : "Setujui"}
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p>Pesanan tidak tersedia.</p>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default TransactionHistory;



"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  // Fungsi untuk fetch data dari Firestore
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cart"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  // Fungsi untuk memperbarui status di Firestore dan menambah transaksi
  const handleApproval = async (transactionId) => {
    try {
      // 1. Update the status in the 'cart' collection
      const transactionDoc = doc(db, "cart", transactionId);
      await updateDoc(transactionDoc, {
        status: "disetujui", // Update status to 'disetujui'
      });

      // 2. Fetch the transaction details from Firestore (for adding to 'transactions' collection)
      const transactionSnapshot = await getDocs(doc(db, "cart", transactionId));
      const transactionData = transactionSnapshot.data();

      // 3. Add the transaction to the 'transactions' collection
      if (transactionData) {
        await addDoc(collection(db, "transactions"), {
          order_id: transactionData.order_id,
          user_id: transactionData.user_id,
          userName: transactionData.userName,
          status: "disetujui", // Transaction is approved
          pesanan: transactionData.pesanan,
          gross_amount: transactionData.gross_amount,
          payment_type: transactionData.payment_type,
          timeStamp: transactionData.timeStamp,
          timestamp: new Date(), // Timestamp when added to transactions collection
        });
      }

      // 4. Perbarui status di state lokal
      setTransactions((prevTransactions) =>
        prevTransactions.map((transaction) =>
          transaction.id === transactionId
            ? { ...transaction, status: "disetujui" }
            : transaction
        )
      );
    } catch (error) {
      console.error("Error updating status or adding to transactions:", error);
    }
  };

  return (
    <div className="transaction-history">
      <h1 className="text-2xl font-bold mb-4">Riwayat Transaksi</h1>
      {transactions.length === 0 ? (
        <p>Belum ada transaksi.</p>
      ) : (
        transactions.map((transaction) => (
          <div key={transaction.id} className="mb-6 border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Order ID: {transaction.id}</h2>
            <p><strong>User Name:</strong> {transaction.userName || "Tidak Diketahui"}</p>
            <p><strong>Tanggal:</strong> {new Date(transaction.timeStamp?.toDate()).toLocaleString()}</p>
            <h3 className="text-lg font-medium mt-4">Pesanan:</h3>
            {transaction.pesanan ? (
              <table className="table-auto w-full border">
                <thead>
                  <tr>
                    <th>Judul</th>
                    <th>Kategori</th>
                    <th>Deskripsi</th>
                    <th>Harga</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {transaction.pesanan.map((item, index) => (
                    <tr key={index}>
                      <td>{item.title}</td>
                      <td>{item.category}</td>
                      <td>{item.description}</td>
                      <td>{item.price}</td>
                      <td>{transaction.status || "Belum Disetujui"}</td>
                      <td>
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                          onClick={() => handleApproval(transaction.id)}
                          disabled={transaction.status === "disetujui"} // Disable if already approved
                        >
                          {transaction.status === "disetujui"
                            ? "Sudah Disetujui"
                            : "Setujui"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Pesanan tidak tersedia.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionHistory;
