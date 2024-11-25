// import useAuth from "@/app/hooks/useAuth";
// import useProduct from "@/app/hooks/useProduct";
// import { numberToRupiah } from "@/utils/rupiah";
// import React,{useState, useEffect} from "react";
// import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";

// const CartDrawer = () => {
//   const { cart, removeFromCart } = useProduct();
//   const { userProfile,user } = useAuth();

//   const totalPrice = cart.reduce((acc, item) => acc + parseInt(item.price), 0);

//   useEffect(() => {
//     const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
//     const clientKey = process.env.NEXT_PUBLIC_CLIENT;
//     const script = document.createElement("script");
//     script.src = snapScript;
//     script.setAttribute("data-client-key", clientKey);
//     script.async = true;

//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const generateWhatsAppMessage = () => {
//     const message = cart
//       .map((item) => `- Pesanan ${item.title}: ${numberToRupiah(item.price)}`)
//       .join("\n");
//     const total = numberToRupiah(totalPrice);
//     return `*Pesanan Baru UEU Assets*\n-------------------------------------\nUser\nNama : _${userProfile.name}_\nEmail : _${userProfile.email}_\n-------------------------------------\nDetail pesanan\n-------------------------------------\n${message}\n-------------------------------------\n*Total*: ${total}`;
//   };

//   // const handlePesanClick = () => {
//   //   // const message = generateWhatsAppMessage();
//   //   // const phoneNumber = "6285817298071"; // Ganti dengan nomor WhatsApp yang diinginkan
//   //   // const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
//   //   //   message
//   //   // )}`;
//   //   // window.open(whatsappLink, "_blank");
//   //   if (cart.length > 5) {
//   //     // Jika jumlah pesanan lebih dari 5 kali, tampilkan alert
//   //     alert("Maaf, Anda hanya diperbolehkan melakukan pesanan maksimal 5 kali.");
//   //   } else {
//   //     const message = generateWhatsAppMessage();
//   //     const phoneNumber = "6285817298071"; // Ganti dengan nomor WhatsApp yang diinginkan
//   //     const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
//   //       message
//   //     )}`;
//   //     window.open(whatsappLink, "_blank");
//   //   }
//   // };
//   const [isPaymentLoading, setIsPaymentLoading] = useState(false);

//   const handlePesanClick = async () => {
//     if (cart.length > 5) {
//       alert("Maaf, Anda hanya diperbolehkan melakukan pesanan maksimal 5 kali.");
//     } else {
//       try {
//         setIsPaymentLoading(true);
//         if (!user || !user.uid) {
//           console.error("User is undefined or does not have UID property");
//           return;
//         }
//         // Prepare data for Midtrans payment
//         const data = {
//           id: "MS-" + user.uid + new Date().getTime(),
//           username: userProfile.username,
//           fullname: userProfile.fullname,
//           email: userProfile.email,
//           amount: totalPrice,
//         };
//         // Send payment request to server
//         const response = await fetch("/api/tokenizer", {
//           method: "POST",
//           body: JSON.stringify(data),
//         });
//         const requestData = await response.json();
//         // Open Midtrans payment popup
//         window.snap.pay(requestData.token, {
//           onSuccess: async (result) => {
//             // Payment success, send order details via WhatsApp
//             const message = generateWhatsAppMessage();
//             const phoneNumber = "6285817298071"; // Replace with desired WhatsApp number
//             const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
//             window.open(whatsappLink, "_blank");
//           },
//         });
//       } catch (error) {
//         console.error("Error processing payment:", error);
//         alert("Terjadi kesalahan dalam pemrosesan pembayaran.");
//       } finally {
//         setIsPaymentLoading(false);
//       }
//     }
//   };

//   return (
//     <>
//       <div className="drawer  drawer-end">
//         <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
//         <div className="drawer-content">
//           {/* Page content here */}
//           {cart.length != 0 ? (
//             <div className="indicator">
//               <span className="indicator-item badge badge-error text-white">
//                 {cart && cart.length}
//               </span>
//               <label
//                 htmlFor="my-drawer-4"
//                 className="drawer-button btn btn-accent text-teal-100"
//               >
//                 <FaShoppingCart size={25} />
//               </label>
//             </div>
//           ) : (
//             <label
//               htmlFor="my-drawer-4"
//               className="drawer-button btn btn-accent text-teal-100"
//             >
//               <FaShoppingCart size={25} />
//             </label>
//           )}
//         </div>
//         <div className="drawer-side z-50">
//           <label
//             htmlFor="my-drawer-4"
//             aria-label="close sidebar"
//             className="drawer-overlay"
//           ></label>
//           <ul className="menu p-4 w-[500px] min-h-full bg-base-200 text-base-content">
//             {/* Sidebar content here */}
//             {cart.length === 0 && (
//               <li className="text-center p-10">
//                 Anda Tidak Memiliki Pesanan...
//               </li>
//             )}
//             {cart &&
//               cart.map((data) => (
//                 <li
//                   key={data.id}
//                   className="flex flex-row items-center justify-between mt-4"
//                 >
//                   <img
//                     src={data.image}
//                     alt={data.title}
//                     width={70}
//                     height={70}
//                     className="object-cover rounded-2xl"
//                   />
//                   <p>{data.title}</p>
//                   <p>{numberToRupiah(data.price)}</p>
//                   <button
//                     className="bg-red-500 hover:bg-red-600 text-white"
//                     onClick={() => removeFromCart(data)}
//                   >
//                     <FaTrashAlt />
//                   </button>
//                 </li>
//               ))}
//             <hr className="mt-6" />
//             <li className="my-3 mx-3 text-2xl text-red-600">
//               Total: {numberToRupiah(totalPrice)}
//             </li>
//             <hr />
//             <button
//               className="btn btn-accent mt-6 w-full"
//               onClick={handlePesanClick}
//             >
//               Pesan
//             </button>
//           </ul>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CartDrawer;

//update tgl 3 november 2024
// import useAuth from "@/app/hooks/useAuth";
// import useProduct from "@/app/hooks/useProduct";
// import { numberToRupiah } from "@/utils/rupiah";
// import React, { useState, useEffect } from "react";
// import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
// import { generateOTP } from "@/utils/otp"; // Import fungsi untuk menghasilkan kode OTP acak


// const CartDrawer = () => {
//   const { cart, removeFromCart } = useProduct();
//   const { userProfile, user } = useAuth();

//   const totalPrice = cart.reduce((acc, item) => acc + parseInt(item.price), 0);

//   useEffect(() => {
//     const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
//     const clientKey = process.env.NEXT_PUBLIC_CLIENT;
//     const script = document.createElement("script");
//     script.src = snapScript;
//     script.setAttribute("data-client-key", clientKey);
//     script.async = true;

//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const generateWhatsAppMessage = () => {
//     const message = cart
//       .map((item) => `- Pesanan ${item.title}: ${numberToRupiah(item.price)}`)
//       .join("\n");
//     const total = numberToRupiah(totalPrice);
//     return `*Pesanan Baru UEU Assets*\n-------------------------------------\nUser\nNama : _${userProfile.name}_\nEmail : _${userProfile.email}_\n-------------------------------------\nDetail pesanan\n-------------------------------------\n${message}\n-------------------------------------\n*Total*: ${total}`;
//   };

//   const [isPaymentLoading, setIsPaymentLoading] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otpCode, setOtpCode] = useState('');
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [generatedOTP, setGeneratedOTP] = useState('');

//   // const sendOtp = async () => {
//   //   try {
//   //     // Kirim OTP ke nomor telepon pengguna
//   //     setIsOtpSent(true);
//   //     alert('OTP telah dikirim ke nomor telepon Anda.');
//   //   } catch (error) {
//   //     console.error('Error sending OTP:', error);
//   //     alert('Terjadi kesalahan dalam mengirim OTP.');
//   //   }
//   // };


//   // const sendOtp = async () => {
//   //   try {
//   //     // Kirim OTP ke nomor telepon pengguna (simulasi)
//   //     const otp = generateOTP(); // Generate kode OTP secara acak
//   //     console.log("OTP:", otp); // Cetak kode OTP untuk simulasi
  
//   //     setIsOtpSent(true);
//   //     alert('OTP telah dikirim ke nomor telepon Anda.');
//   //   } catch (error) {
//   //     console.error('Error sending OTP:', error);
//   //     alert('Terjadi kesalahan dalam mengirim OTP.');
//   //   }
//   // };

// //   const sendOtp = async () => {
// //     try {
// //         const otp = generateOTP(); // Generate kode OTP secara acak
// //         console.log("OTP:", otp); // Cetak kode OTP untuk simulasi

// //         setIsOtpSent(true);
// //         alert('OTP telah dikirim ke nomor telepon Anda.');
// //     } catch (error) {
// //         console.error('Error sending OTP:', error);
// //         alert('Terjadi kesalahan dalam mengirim OTP.');
// //     }
// // };

// const sendOtp = async () => {
//   try {
//       const otp = generateOTP(); // Generate kode OTP secara acak
//       console.log("OTP:", otp); // Cetak kode OTP untuk simulasi

//       // Simpan kode OTP yang dihasilkan ke dalam variabel
//       setGeneratedOTP(otp);

//       setIsOtpSent(true);
//       alert('OTP telah dikirim ke nomor telepon Anda.');
//   } catch (error) {
//       console.error('Error sending OTP:', error);
//       alert('Terjadi kesalahan dalam mengirim OTP.');
//   }
// };

// const verifyOtp = async () => {
//   try {
//       // Verifikasi OTP yang dimasukkan oleh pengguna
//       if (otpCode === generatedOTP) { // Bandingkan dengan kode OTP yang disimpan
//           alert('Verifikasi OTP berhasil.');
//           // Lanjutkan ke proses pembayaran setelah verifikasi berhasil
//           handlePayment();
//       } else {
//           alert('Kode OTP yang dimasukkan salah.');
//       }
//   } catch (error) {
//       console.error('Error verifying OTP:', error);
//       alert('Verifikasi OTP gagal. Silakan coba lagi.');
//   }
// };


//   // const verifyOtp = async () => {
//   //   try {
//   //     // Verifikasi OTP yang dimasukkan oleh pengguna
//   //     alert('Verifikasi OTP berhasil.');
//   //     // Lanjutkan ke proses pembayaran setelah verifikasi berhasil
//   //     handlePayment();
//   //   } catch (error) {
//   //     console.error('Error verifying OTP:', error);
//   //     alert('Verifikasi OTP gagal. Silakan coba lagi.');
//   //   }
//   // };

//   // const verifyOtp = async () => {
//   //   try {
//   //     // Verifikasi OTP yang dimasukkan oleh pengguna
//   //     if (otpCode === "123456") { // Ganti "123456" dengan kode OTP yang sebenarnya dikirimkan
//   //       alert('Verifikasi OTP berhasil.');
//   //       // Lanjutkan ke proses pembayaran setelah verifikasi berhasil
//   //       handlePayment();
//   //     } else {
//   //       alert('Kode OTP yang dimasukkan salah.');
//   //     }
//   //   } catch (error) {
//   //     console.error('Error verifying OTP:', error);
//   //     alert('Verifikasi OTP gagal. Silakan coba lagi.');
//   //   }
//   // };
//   // const verifyOtp = async () => {
//   //   try {
//   //     // Verifikasi OTP yang dimasukkan oleh pengguna
//   //     if (otpCode === generateOTP()) {
//   //       alert('Verifikasi OTP berhasil.');
//   //       // Lanjutkan ke proses pembayaran setelah verifikasi berhasil
//   //       handlePayment();
//   //     } else {
//   //       alert('Kode OTP yang dimasukkan salah.');
//   //     }
//   //   } catch (error) {
//   //     console.error('Error verifying OTP:', error);
//   //     alert('Verifikasi OTP gagal. Silakan coba lagi.');
//   //   }
//   // };
  

//   // const generateOTP = () => {
//   //   // Menghasilkan kode OTP acak dengan panjang 6 digit
//   //   return Math.floor(100000 + Math.random() * 900000).toString();
//   // };

//   const handlePesanClick = async () => {
//     if (cart.length > 5) {
//       alert("Maaf, Anda hanya diperbolehkan melakukan pesanan maksimal 5 kali.");
//     } else {
//       try {
//         setIsPaymentLoading(true);
//         if (!user || !user.uid) {
//           console.error("User is undefined or does not have UID property");
//           return;
//         }
//         if (!isOtpSent) {
//           // Jika OTP belum dikirim, kirim OTP terlebih dahulu
//           sendOtp();
//           return;
//         }
//         if (!phoneNumber || !otpCode) {
//           alert('Mohon lengkapi nomor telepon dan kode OTP.');
//           return;
//         }
//         // Verifikasi OTP sebelum melakukan pembayaran
//         verifyOtp();
//       } catch (error) {
//         console.error("Error processing payment:", error);
//         alert("Terjadi kesalahan dalam pemrosesan pembayaran.");
//       } finally {
//         setIsPaymentLoading(false);
//       }
//     }
//   };

//   // const handlePayment = async () => {
//   //   try {
//   //     // Prepare data for Midtrans payment
//   //     const data = {
//   //       id: "MS-" + user.uid + new Date().getTime(),
//   //       username: userProfile.username,
//   //       fullname: userProfile.fullname,
//   //       email: userProfile.email,
//   //       amount: totalPrice,
//   //     };
//   //     // Send payment request to server
//   //     const response = await fetch("/api/tokenizer", {
//   //       method: "POST",
//   //       body: JSON.stringify(data),
//   //     });
//   //     const requestData = await response.json();
//   //     // Open Midtrans payment popup
//   //     window.snap.pay(requestData.token, {
//   //       onSuccess: async (result) => {
//   //         // Payment success, send order details via WhatsApp
//   //         const message = generateWhatsAppMessage();
//   //         const phoneNumber = "6285817298071"; // Replace with desired WhatsApp number
//   //         const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
//   //         window.open(whatsappLink, "_blank");
//   //       },
//   //     });
//   //   } catch (error) {
//   //     console.error("Error processing payment:", error);
//   //     alert("Terjadi kesalahan dalam pemrosesan pembayaran.");
//   //   }
//   // };

//   const handlePayment = async () => {
//     try {
//       // Prepare data for Midtrans payment
//       const data = {
//         id: "MS-" + user.uid + new Date().getTime(),
//         username: userProfile.username,
//         fullname: userProfile.fullname,
//         email: userProfile.email,
//         amount: totalPrice,
//       };
//       // Send payment request to server
//       const response = await fetch("/api/tokenizer", {
//         method: "POST",
//         body: JSON.stringify(data),
//       });
//       const requestData = await response.json();
//       // Open Midtrans payment popup
//       window.snap.pay(requestData.token, {
//         onSuccess: async (result) => {
//           // Payment success, send order details via WhatsApp
//           const message = generateWhatsAppMessage();
//           const phoneNumber = prompt("Masukkan nomor WhatsApp Anda:");
//           if (!phoneNumber) return; // If user cancels, do nothing
//           const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
//           window.open(whatsappLink, "_blank");
//         },
//       });
//     } catch (error) {
//       console.error("Error processing payment:", error);
//       alert("Terjadi kesalahan dalam pemrosesan pembayaran.");
//     }
//   };
  
//   return (
//     <>
//       <div className="drawer  drawer-end">
//         <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
//         <div className="drawer-content">
//           {/* Page content here */}
//           {cart.length != 0 ? (
//             <div className="indicator">
//               <span className="indicator-item badge badge-error text-white">
//                 {cart && cart.length}
//               </span>
//               <label
//                 htmlFor="my-drawer-4"
//                 className="drawer-button btn btn-accent text-teal-100"
//               >
//                 <FaShoppingCart size={25} />
//               </label>
//             </div>
//           ) : (
//             <label
//               htmlFor="my-drawer-4"
//               className="drawer-button btn btn-accent text-teal-100"
//             >
//               <FaShoppingCart size={25} />
//             </label>
//           )}
//         </div>
//         <div className="drawer-side z-50">
//           <label
//             htmlFor="my-drawer-4"
//             aria-label="close sidebar"
//             className="drawer-overlay"
//           ></label>
//           <ul className="menu p-4 w-[500px] min-h-full bg-base-200 text-base-content">
//             {/* Sidebar content here */}
//             {cart.length === 0 && (
//               <li className="text-center p-10">
//                 Anda Tidak Memiliki Pesanan...
//               </li>
//             )}
//             {cart &&
//               cart.map((data) => (
//                 <li
//                   key={data.id}
//                   className="flex flex-row items-center justify-between mt-4"
//                 >
//                   <img
//                     src={data.image}
//                     alt={data.title}
//                     width={70}
//                     height={70}
//                     className="object-cover rounded-2xl"
//                   />
//                   <p>{data.title}</p>
//                   <p>{numberToRupiah(data.price)}</p>
//                   <button
//                     className="bg-red-500 hover:bg-red-600 text-white"
//                     onClick={() => removeFromCart(data)}
//                   >
//                     <FaTrashAlt />
//                   </button>
//                 </li>
//               ))}
//             <hr className="mt-6" />
//             <li className="my-3 mx-3 text-2xl text-red-600">
//               Total: {numberToRupiah(totalPrice)}
//             </li>
//             <hr />
//             {!isOtpSent && (
//               <input
//                 type="text"
//                 placeholder="Masukkan Nomor Telepon"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 className="border p-2 mb-4"
//               />
//             )}
//             {isOtpSent && (
//               <input
//                 type="text"
//                 placeholder="Masukkan Kode OTP"
//                 value={otpCode}
//                 onChange={(e) => setOtpCode(e.target.value)}
//                 className="border p-2 mb-4"
//               />
//             )}
//             <button
//               className="btn btn-accent mt-2 w-full"
//               onClick={handlePesanClick}
//             >
//               {!isOtpSent ? 'Kirim OTP' : 'Verifikasi OTP'}
//             </button>
//           </ul>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CartDrawer;

//tgl 25 november 2024
// import useAuth from "@/app/hooks/useAuth";
// import useProduct from "@/app/hooks/useProduct";
// import { numberToRupiah } from "@/utils/rupiah";
// import React, { useState, useEffect } from "react";
// import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
// import { generateOTP } from "@/utils/otp"; // Import function to generate OTP
// import Mutasi from "./Mutasi"; // Import the Mutasi component

// const CartDrawer = () => {
//   const { cart, removeFromCart } = useProduct();
//   const { userProfile, user } = useAuth();

//   const totalPrice = cart.reduce((acc, item) => acc + parseInt(item.price), 0);

//   useEffect(() => {
//     const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
//     const clientKey = process.env.NEXT_PUBLIC_CLIENT;
//     const script = document.createElement("script");
//     script.src = snapScript;
//     script.setAttribute("data-client-key", clientKey);
//     script.async = true;

//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const generateWhatsAppMessage = () => {
//     const message = cart
//       .map((item) => `- Pesanan ${item.title}: ${numberToRupiah(item.price)}`)
//       .join("\n");
//     const total = numberToRupiah(totalPrice);
//     return `*Pesanan Baru UEU Assets*\n-------------------------------------\nUser\nNama : _${userProfile.name}_\nEmail : _${userProfile.email}_\n-------------------------------------\nDetail pesanan\n-------------------------------------\n${message}\n-------------------------------------\n*Total*: ${total}`;
//   };

//   const [isPaymentLoading, setIsPaymentLoading] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otpCode, setOtpCode] = useState('');
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [generatedOTP, setGeneratedOTP] = useState('');

//   const sendOtp = async () => {
//     try {
//       const otp = generateOTP(); // Generate random OTP
//       console.log("OTP:", otp); // Print OTP for simulation
//       setGeneratedOTP(otp);
//       setIsOtpSent(true);
//       alert('OTP telah dikirim ke nomor telepon Anda.');
//     } catch (error) {
//       console.error('Error sending OTP:', error);
//       alert('Terjadi kesalahan dalam mengirim OTP.');
//     }
//   };

//   const verifyOtp = async () => {
//     try {
//       if (otpCode === generatedOTP) {
//         alert('Verifikasi OTP berhasil.');
//         handlePayment();
//       } else {
//         alert('Kode OTP yang dimasukkan salah.');
//       }
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//       alert('Verifikasi OTP gagal. Silakan coba lagi.');
//     }
//   };

//   const handlePesanClick = async () => {
//     if (cart.length > 5) {
//       alert("Maaf, Anda hanya diperbolehkan melakukan pesanan maksimal 5 kali.");
//     } else {
//       try {
//         setIsPaymentLoading(true);
//         if (!user || !user.uid) {
//           console.error("User is undefined or does not have UID property");
//           return;
//         }
//         if (!isOtpSent) {
//           sendOtp();
//         } else {
//           if (!phoneNumber || !otpCode) {
//             alert('Mohon lengkapi nomor telepon dan kode OTP.');
//             return;
//           }
//           verifyOtp();
//         }
//       } catch (error) {
//         console.error("Error processing payment:", error);
//         alert("Terjadi kesalahan dalam pemrosesan pembayaran.");
//       } finally {
//         setIsPaymentLoading(false);
//       }
//     }
//   };

//   const handlePayment = async () => {
//     try {
//       const data = {
//         id: "MS-" + user.uid + new Date().getTime(),
//         username: userProfile.username,
//         fullname: userProfile.fullname,
//         email: userProfile.email,
//         amount: totalPrice,
//       };
//       const response = await fetch("/api/tokenizer", {
//         method: "POST",
//         body: JSON.stringify(data),
//       });
//       const requestData = await response.json();
//       window.snap.pay(requestData.token, {
//         onSuccess: async (result) => {
//           const message = generateWhatsAppMessage();
//           const whatsappNumber = prompt("Masukkan nomor WhatsApp Anda:");
//           if (!whatsappNumber) return; // If user cancels, do nothing
//           const whatsappLink = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
//           window.open(whatsappLink, "_blank");
//         },
//       });
//     } catch (error) {
//       console.error("Error processing payment:", error);
//       alert("Terjadi kesalahan dalam pemrosesan pembayaran.");
//     }
//   };

//   return (
//     <>
//       <div className="drawer drawer-end">
//         <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
//         <div className="drawer-content">
//           {cart.length !== 0 ? (
//             <div className="indicator">
//               <span className="indicator-item badge badge-error text-white">
//                 {cart.length}
//               </span>
//               <label
//                 htmlFor="my-drawer-4"
//                 className="drawer-button btn btn-accent text-teal-100"
//               >
//                 <FaShoppingCart size={25} />
//               </label>
//             </div>
//           ) : (
//             <label
//               htmlFor="my-drawer-4"
//               className="drawer-button btn btn-accent text-teal-100"
//             >
//               <FaShoppingCart size={25} />
//             </label>
//           )}
//         </div>
//         <div className="drawer-side z-50">
//           <label
//             htmlFor="my-drawer-4"
//             aria-label="close sidebar"
//             className="drawer-overlay"
//           ></label>
//           <ul className="menu p-4 w-[500px] min-h-full bg-base-200 text-base-content">
//             {cart.length === 0 && (
//               <li className="text-center p-10">
//                 Anda Tidak Memiliki Pesanan...
//               </li>
//             )}
//             {cart.map((data) => (
//               <li
//                 key={data.id}
//                 className="flex flex-row items-center justify-between mt-4"
//               >
//                 <img
//                   src={data.image}
//                   alt={data.title}
//                   width={70}
//                   height={70}
//                   className="object-cover rounded-2xl"
//                 />
//                 <p>{data.title}</p>
//                 <p>{numberToRupiah(data.price)}</p>
//                 <button
//                   className="bg-red-500 hover:bg-red-600 text-white"
//                   onClick={() => removeFromCart(data)}
//                 >
//                   <FaTrashAlt />
//                 </button>
//               </li>
//             ))}
//             <hr className="mt-6" />
//             <li className="my-3 mx-3 text-2xl text-red-600">
//               Total: {numberToRupiah(totalPrice)}
//             </li>
//             <hr />
//             {!isOtpSent ? (
//               <input
//                 type="text"
//                 placeholder="Masukkan Nomor Telepon"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 className="border p-2 mb-4"
//               />
//             ) : (
//               <input
//                 type="text"
//                 placeholder="Masukkan Kode OTP"
//                 value={otpCode}
//                 onChange={(e) => setOtpCode(e.target.value)}
//                 className="border p-2 mb-4"
//               />
//             )}
//             <button
//               className="btn btn-accent mt-2 w-full"
//               onClick={handlePesanClick}
//             >
//               {!isOtpSent ? 'Kirim OTP' : 'Verifikasi OTP'}
//             </button>
//           </ul>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CartDrawer;

//TERBARUUU
// import useAuth from "@/app/hooks/useAuth";
// import useProduct from "@/app/hooks/useProduct";
// import { numberToRupiah } from "@/utils/rupiah";
// import React, { useState, useEffect } from "react";
// import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
// import { generateOTP } from "@/utils/otp";
// import { db } from "@/firebase/firebase";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// const CartDrawer = () => {
//   const { cart, removeFromCart } = useProduct();
//   const { userProfile, user } = useAuth();
//   const totalPrice = cart.reduce((acc, item) => acc + parseInt(item.price), 0);

//   useEffect(() => {
//     const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
//     const clientKey = process.env.NEXT_PUBLIC_CLIENT;
//     const script = document.createElement("script");
//     script.src = snapScript;
//     script.setAttribute("data-client-key", clientKey);
//     script.async = true;

//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const generateWhatsAppMessage = () => {
//     const message = cart
//       .map((item) => `- Pesanan ${item.title}: ${numberToRupiah(item.price)}`)
//       .join("\n");
//     const total = numberToRupiah(totalPrice);
//     return `*Pesanan Baru UEU Assets*\n-------------------------------------\nUser\nNama : _${userProfile.name}_\nEmail : _${userProfile.email}_\n-------------------------------------\nDetail pesanan\n-------------------------------------\n${message}\n-------------------------------------\n*Total*: ${total}`;
//   };

//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otpCode, setOtpCode] = useState('');
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [generatedOTP, setGeneratedOTP] = useState('');

//   const sendOtp = async () => {
//     const otp = generateOTP();
//     console.log("OTP:", otp);
//     setGeneratedOTP(otp);
//     setIsOtpSent(true);
//     alert('OTP telah dikirim ke nomor telepon Anda.');
//   };

//   const verifyOtp = async () => {
//     if (otpCode === generatedOTP) {
//       alert('Verifikasi OTP berhasil.');
//       handlePayment();
//     } else {
//       alert('Kode OTP yang dimasukkan salah.');
//     }
//   };

//   const handlePaymentSuccess = async (result) => {
//     const transactionData = {
//       user_id: user.uid,
//       order_id: result.order_id,
//       transaction_id: result.transaction_id,
//       status: result.transaction_status,
//       gross_amount: result.gross_amount,
//       payment_type: result.payment_type,
//       timestamp: serverTimestamp(),
//       cart: cart,
//     };

//     try {
//       await addDoc(collection(db, "transactions"), transactionData);
//       alert("Pembayaran berhasil, data transaksi telah dicatat.");
//     } catch (error) {
//       console.error("Gagal mencatat transaksi:", error);
//       alert("Terjadi kesalahan saat mencatat transaksi.");
//     }
//   };

//   const handlePayment = async () => {
//     try {
//       const data = {
//         id: "MS-" + user.uid + new Date().getTime(),
//         username: userProfile.username,
//         fullname: userProfile.fullname,
//         email: userProfile.email,
//         amount: totalPrice,
//       };
//       const response = await fetch("/api/tokenizer", {
//         method: "POST",
//         body: JSON.stringify(data),
//       });
//       const requestData = await response.json();
//       window.snap.pay(requestData.token, {
//         onSuccess: (result) => handlePaymentSuccess(result),
//         onError: (error) => {
//           console.error("Error during payment:", error);
//           alert("Pembayaran gagal. Silakan coba lagi.");
//         },
//       });
//     } catch (error) {
//       console.error("Error processing payment:", error);
//       alert("Terjadi kesalahan dalam pemrosesan pembayaran.");
//     }
//   };

//   // const handlePesanClick = () => {
//   //   if (!isOtpSent) {
//   //     sendOtp();
//   //   } else {
//   //     verifyOtp();
//   //   }
//   // };

//   const handlePesanClick = async () => {
//     if (!isOtpSent) {
//       sendOtp();
//     } else {
//       if (otpCode === generatedOTP) {
//         alert("Verifikasi OTP berhasil.");
//         try {
//           const data = {
//             id: "MS-" + user.uid + new Date().getTime(),
//             username: userProfile.username,
//             fullname: userProfile.fullname,
//             email: userProfile.email,
//             amount: totalPrice,
//           };
//           console.log("Sending data to tokenizer API:", data);
  
//           const response = await fetch("/api/tokenizer", {
//             method: "POST",
//             body: JSON.stringify(data),
//           });
//           const requestData = await response.json();
//           console.log("Received token from tokenizer API:", requestData);
  
//           window.snap.pay(requestData.token, {
//             onSuccess: async (result) => {
//               console.log("Midtrans payment success result:", result);
//               const transactionData = {
//                 user_id: user.uid,
//                 order_id: result.order_id,
//                 transaction_id: result.transaction_id,
//                 status: result.transaction_status,
//                 gross_amount: result.gross_amount,
//                 payment_type: result.payment_type,
//                 timestamp: serverTimestamp(),
//                 cart: cart,
//               };
//               console.log("Saving transaction to Firestore:", transactionData);
  
//               try {
//                 await addDoc(collection(db, "transactions"), transactionData);
//                 alert("Pembayaran berhasil, data transaksi telah dicatat.");
//               } catch (error) {
//                 console.error("Gagal mencatat transaksi:", error);
//                 alert("Terjadi kesalahan saat mencatat transaksi.");
//               }
//             },
//             onError: (error) => {
//               console.error("Error during payment:", error);
//               alert("Pembayaran gagal. Silakan coba lagi.");
//             },
//           });
//         } catch (error) {
//           console.error("Error processing payment:", error);
//           alert("Terjadi kesalahan dalam pemrosesan pembayaran.");
//         }
//       } else {
//         alert("Kode OTP yang dimasukkan salah.");
//       }
//     }
//   };
  

//   return (
//     <>
//       <div className="drawer drawer-end">
//         <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
//         <div className="drawer-content">
//           {cart.length !== 0 ? (
//             <div className="indicator">
//               <span className="indicator-item badge badge-error text-white">
//                 {cart.length}
//               </span>
//               <label
//                 htmlFor="my-drawer-4"
//                 className="drawer-button btn btn-accent text-teal-100"
//               >
//                 <FaShoppingCart size={25} />
//               </label>
//             </div>
//           ) : (
//             <label
//               htmlFor="my-drawer-4"
//               className="drawer-button btn btn-accent text-teal-100"
//             >
//               <FaShoppingCart size={25} />
//             </label>
//           )}
//         </div>
//         <div className="drawer-side z-50">
//           <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
//           <ul className="menu p-4 w-[500px] min-h-full bg-base-200 text-base-content">
//             {cart.length === 0 && (
//               <li className="text-center p-10">
//                 Anda Tidak Memiliki Pesanan...
//               </li>
//             )}
//             {cart.map((data) => (
//               <li
//                 key={data.id}
//                 className="flex flex-row items-center justify-between mt-4"
//               >
//                 <img
//                   src={data.image}
//                   alt={data.title}
//                   width={70}
//                   height={70}
//                   className="object-cover rounded-2xl"
//                 />
//                 <p>{data.title}</p>
//                 <p>{numberToRupiah(data.price)}</p>
//                 <button
//                   className="bg-red-500 hover:bg-red-600 text-white"
//                   onClick={() => removeFromCart(data)}
//                 >
//                   <FaTrashAlt />
//                 </button>
//               </li>
//             ))}
//             <hr className="mt-6" />
//             <li className="my-3 mx-3 text-2xl text-red-600">
//               Total: {numberToRupiah(totalPrice)}
//             </li>
//             <hr />
//             {!isOtpSent ? (
//               <input
//                 type="text"
//                 placeholder="Masukkan Nomor Telepon"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 className="border p-2 mb-4"
//               />
//             ) : (
//               <input
//                 type="text"
//                 placeholder="Masukkan Kode OTP"
//                 value={otpCode}
//                 onChange={(e) => setOtpCode(e.target.value)}
//                 className="border p-2 mb-4"
//               />
//             )}
//             <button
//               className="btn btn-accent mt-2 w-full"
//               onClick={handlePesanClick}
//             >
//               {!isOtpSent ? "Kirim OTP" : "Verifikasi OTP"}
//             </button>
//           </ul>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CartDrawer;



import useAuth from "@/app/hooks/useAuth";
import useProduct from "@/app/hooks/useProduct";
import { numberToRupiah } from "@/utils/rupiah";
import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaTrashAlt } from "react-icons/fa";
import { generateOTP } from "@/utils/otp";
import { db } from "@/firebase/firebase";
import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";

const CartDrawer = () => {
  const { cart, removeFromCart } = useProduct();
  const { userProfile, user } = useAuth();
  const totalPrice = cart.reduce((acc, item) => acc + parseInt(item.price), 0);

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_CLIENT;
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const generateWhatsAppMessage = () => {
    const message = cart
      .map((item) => `- Pesanan ${item.title}: ${numberToRupiah(item.price)}`)
      .join("\n");
    const total = numberToRupiah(totalPrice);
    return `*Pesanan Baru UEU Assets*\n-------------------------------------\nUser\nNama : _${userProfile.name}_\nEmail : _${userProfile.email}_\n-------------------------------------\nDetail pesanan\n-------------------------------------\n${message}\n-------------------------------------\n*Total*: ${total}`;
  };

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');

  const sendOtp = async () => {
    const otp = generateOTP();
    console.log("OTP:", otp);
    setGeneratedOTP(otp);
    setIsOtpSent(true);
    alert('OTP telah dikirim ke nomor telepon Anda.');
  };

  const verifyOtp = async () => {
    if (otpCode === generatedOTP) {
      alert('Verifikasi OTP berhasil.');
      handlePayment();
    } else {
      alert('Kode OTP yang dimasukkan salah.');
    }
  };

  const handlePaymentSuccess = async (result) => {
    const transactionData = {
      user_id: user.uid,
      order_id: result.order_id,
      transaction_id: result.transaction_id,
      status: result.transaction_status,
      gross_amount: result.gross_amount,
      payment_type: result.payment_type,
      timestamp: serverTimestamp(),
      cart: cart,
    };

    try {
      await addDoc(collection(db, "transactions"), transactionData);
      alert("Pembayaran berhasil, data transaksi telah dicatat.");
    } catch (error) {
      console.error("Gagal mencatat transaksi:", error);
      alert("Terjadi kesalahan saat mencatat transaksi.");
    }
  };

  const handlePayment = async () => {
    try {
      const data = {
        id: "MS-" + user.uid + new Date().getTime(),
        username: userProfile.username,
        fullname: userProfile.fullname,
        email: userProfile.email,
        amount: totalPrice,
      };
      const response = await fetch("/api/tokenizer", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const requestData = await response.json();
      window.snap.pay(requestData.token, {
        onSuccess: (result) => handlePaymentSuccess(result),
        onError: (error) => {
          console.error("Error during payment:", error);
          alert("Pembayaran gagal. Silakan coba lagi.");
        },
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Terjadi kesalahan dalam pemrosesan pembayaran.");
    }
  };

  const handlePesanClick = async () => {
    if (!isOtpSent) {
      sendOtp();
    } else {
      if (otpCode === generatedOTP) {
        alert("Verifikasi OTP berhasil.");
        try {
          const data = {
            id: "MS-" + user.uid + new Date().getTime(),
            username: userProfile.username,
            fullname: userProfile.fullname,
            email: userProfile.email,
            amount: totalPrice,
          };
          console.log("Sending data to tokenizer API:", data);
  
          const response = await fetch("/api/tokenizer", {
            method: "POST",
            body: JSON.stringify(data),
          });
          const requestData = await response.json();
          console.log("Received token from tokenizer API:", requestData);
  
          window.snap.pay(requestData.token, {
            onSuccess: async (result) => {
              console.log("Midtrans payment success result:", result);
              const transactionData = {
                user_id: user.uid,
                order_id: result.order_id,
                transaction_id: result.transaction_id,
                status: result.transaction_status,
                gross_amount: result.gross_amount,
                payment_type: result.payment_type,
                timestamp: serverTimestamp(),
                cart: cart,
              };
              console.log("Saving transaction to Firestore:", transactionData);
  
              try {
                await addDoc(collection(db, "transactions"), transactionData);
                alert("Pembayaran berhasil, data transaksi telah dicatat.");
              } catch (error) {
                console.error("Gagal mencatat transaksi:", error);
                alert("Terjadi kesalahan saat mencatat transaksi.");
              }
            },
            onError: (error) => {
              console.error("Error during payment:", error);
              alert("Pembayaran gagal. Silakan coba lagi.");
            },
          });
        } catch (error) {
          console.error("Error processing payment:", error);
          alert("Terjadi kesalahan dalam pemrosesan pembayaran.");
        }
      } else {
        alert("Kode OTP yang dimasukkan salah.");
      }
    }
  };

  const handleRemoveFromCart = async (item) => {
    // Remove item from the UI (state)
    removeFromCart(item);

    // Check if the item is already in the database
    const cartQuery = query(
      collection(db, "cart"),
      where("user_id", "==", user.uid),
      where("product_id", "==", item.id)
    );
    const cartSnapshot = await getDocs(cartQuery);
    if (!cartSnapshot.empty) {
      // If item is found, don't delete it from the database
      console.log("Item found in database, just removing from UI");
    } else {
      // If not found, add the item again to the cart collection in the database
      const newCartData = {
        user_id: user.uid,
        product_id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        timestamp: serverTimestamp(),
      };

      try {
        await addDoc(collection(db, "cart"), newCartData);
        console.log("Item added back to the database.");
      } catch (error) {
        console.error("Failed to add item to the database:", error);
      }
    }
  };

  return (
    <>
      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {cart.length !== 0 ? (
            <div className="indicator">
              <span className="indicator-item badge badge-error text-white">
                {cart.length}
              </span>
              <label
                htmlFor="my-drawer-4"
                className="drawer-button btn btn-accent text-teal-100"
              >
                <FaShoppingCart size={25} />
              </label>
            </div>
          ) : (
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-accent text-teal-100"
            >
              <FaShoppingCart size={25} />
            </label>
          )}
        </div>
        <div className="drawer-side z-50">
          <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
          <ul className="menu p-4 w-[500px] min-h-full bg-base-200 text-base-content">
            {cart.length === 0 && (
              <li className="text-center p-10">
                Anda Tidak Memiliki Pesanan...
              </li>
            )}
            {cart.map((data) => (
              <li
                key={data.id}
                className="flex flex-row items-center justify-between mt-4"
              >
                <img
                  src={data.image}
                  alt={data.title}
                  width={70}
                  height={70}
                  className="object-cover rounded-2xl"
                />
                <p>{data.title}</p>
                <p>{numberToRupiah(data.price)}</p>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => handleRemoveFromCart(data)}
                >
                  <FaTrashAlt />
                </button>
              </li>
            ))}
            <hr className="mt-6" />
            <li className="my-3 mx-3 text-2xl text-red-600">
              Total: {numberToRupiah(totalPrice)}
            </li>
            <hr />
            {!isOtpSent ? (
              <input
                type="text"
                placeholder="Masukkan Nomor Telepon"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border p-2 mb-4"
              />
            ) : (
              <input
                type="text"
                placeholder="Masukkan Kode OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="border p-2 mb-4"
              />
            )}
            <button
              className="btn btn-accent mt-2 w-full"
              onClick={handlePesanClick}
            >
              {!isOtpSent ? "Kirim OTP" : "Verifikasi OTP"}
            </button>
          </ul>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
