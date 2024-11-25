// "use client"
// import React, { useEffect, useState } from "react";
// import { doc, onSnapshot } from "firebase/firestore";
// import { db } from "@/firebase/firebase";
// import { numberToRupiah } from "@/utils/rupiah"; // Utility to format prices in Rupiah
// import useAuth from "@/app/hooks/useAuth"; // Custom hook to get user info
// import Navbar from "@/components/Navbar";

// const Mutasi = () => {
//   const { user } = useAuth();
//   const [cartItems, setCartItems] = useState([]);
//   const [totalMutasi, setTotalMutasi] = useState(0);

//   // Fetch cart data in real-time from Firestore
//   useEffect(() => {
//     if (user) {
//       const cartDocRef = doc(db, "cart", user.uid);

//       // Listen to cart changes in Firestore
//       const unsubscribe = onSnapshot(cartDocRef, (docSnapshot) => {
//         if (docSnapshot.exists()) {
//           const cartData = docSnapshot.data().pesanan || [];
//           setCartItems(cartData);

//           // Calculate total, using 0 as a fallback for missing or invalid `price`
//           const total = cartData.reduce((sum, item) => {
//             const itemPrice = parseInt(item.price) || 0;
//             return sum + itemPrice;
//           }, 0);
//           setTotalMutasi(total);
//         } else {
//           setCartItems([]);
//           setTotalMutasi(0);
//         }
//       });

//       // Clean up the listener on unmount
//       return () => unsubscribe();
//     }
//   }, [user]);

//   return (
//     <>
//     <Navbar/>
//     <div className="mb-30" style={{ paddingTop: '150px', paddingLeft: '100px' }}>
//       <h2>Detail Pembayaran</h2>
//       {cartItems.length === 0 ? (
//         <p>Tidak ada item dalam mutasi.</p>
//       ) : (
//         <ul>
//           {cartItems.map((item) => (
//             <li key={item.id}>
//               <p>
//                 {item.title}: {numberToRupiah(parseInt(item.price) || 0)}
//               </p>
//               <p>Kategori: {item.category}</p>
//               <p>Deskripsi: {item.description}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//       <p>Total: {numberToRupiah(totalMutasi)}</p>
//     </div>
//     </>
//   );
// };

// export default Mutasi;



"use client";
import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { numberToRupiah } from "@/utils/rupiah"; // Utility to format prices in Rupiah
import useAuth from "@/app/hooks/useAuth"; // Custom hook to get user info
import Navbar from "@/components/Navbar";

const Mutasi = () => {
  const { user } = useAuth(); // Ambil data user yang sedang login
  const [cartItems, setCartItems] = useState([]);
  const [totalMutasi, setTotalMutasi] = useState(0);

  // Fetch cart data in real-time from Firestore
  useEffect(() => {
    if (user) {
      // Query the 'cart' collection for the user's items
      const cartQuery = query(
        collection(db, "cart"),
        where("user_id", "==", user.uid) // Filter by user_id
      );

      // Listen to cart changes in Firestore
      const unsubscribe = onSnapshot(cartQuery, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const cartData = querySnapshot.docs.map(doc => doc.data()); // Get data from each document

          setCartItems(cartData);

          // Calculate total, using 0 as a fallback for missing or invalid `price`
          const total = cartData.reduce((sum, item) => {
            const itemPrice = parseInt(item.price) || 0;
            return sum + itemPrice;
          }, 0);
          setTotalMutasi(total);
        } else {
          setCartItems([]);
          setTotalMutasi(0);
        }
      });

      // Clean up the listener on unmount
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="transaction-history" style={{ paddingTop: '150px', paddingLeft: '100px' }}>
        <h1 className="text-2xl font-bold mb-4">Detail Pembayaran untuk {user ? user.displayName : "Pengguna Tidak Diketahui"}</h1>
        {cartItems.length === 0 ? (
          <p>Tidak ada item dalam mutasi.</p>
        ) : (
          <div className="mb-6 border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Pesanan Anda:</h2>
            <table className="table-auto w-full border">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Deskripsi</th>
                  <th>Harga</th>
                  <th>Status</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{item.description}</td>
                    <td>{numberToRupiah(parseInt(item.price) || 0)}</td>
                    <td>{item.status || "Status Tidak Diketahui"}</td>
                    <td>{item.userName || "Tidak Diketahui"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-4">Total: {numberToRupiah(totalMutasi)}</p>
      </div>
    </>
  );
};

export default Mutasi;

