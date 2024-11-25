// "use client";
// import CardItem from "@/components/CardItem";
// import DivisionItem from "@/components/DivisionItem";
// import Navbar from "@/components/Navbar";
// import Image from "next/image";
// import Footer from "@/components/Footer";
// import useAuth from "../hooks/useAuth";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function Home() {
//   const { user, userProfile } = useAuth();
//   const router = useRouter();
//   const [userName, setUserName] = useState(""); // Inisialisasi state userName dengan nilai awal kosong
//   useEffect(() => {
//     if (user && userProfile.role === "admin") {
//       router.push("/admin");
//     }else if (user && userProfile.role === "user") {
//       // Jika user adalah admin, kita dapat menampilkan alert selamat datang
//       // dan menampilkan nama admin dari userProfile
//       alert("Selamat datang, " + userProfile.name);
//       setUserName(userProfile.name);
//     }
//   }, [user, userProfile, router]);
//   return (
//     <div>
//       <Navbar />
//       <div className="relative">
//         <Image
//           src={"/assets/BG1.jpg"}
//           width={3000 / 3}
//           height={2000 / 3}
//           className="relative w-full h-screen object-cover"
//           alt="Home Page"
//           priority
//         />
//         <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center flex flex-col gap-3 w-3/4 md:w-fit">
//           <h1 className="text-5xl font-extrabold text-orange-950">
//             UEU ASSETS
//           </h1>
//           <p className="text-xl">Choose Your Favorite ASSET</p>
//           <button className="bg-white p-4 rounded-lg font-bold text-xl">
//             RIZKI PRODUCTION
//           </button>
//         </div>
//       </div>
//       <div className="p-5 md:p-24">
//         <DivisionItem
//           title={"PRESIDENT DIRECTOR"}
//           description={
//             "bertanggung jawab secara penuh diamnco, membangun visi, misi, tujuan, serta program kerja diamnco, bertanggung jawab untuk memberikan arah perkembangan tujuan jangka pendek dan panjang, kebijakan, anggaran dan rencana operasional perusahaan dan mengawasi interpretasi yang konsisten dan penerapannya, serta rencana pencapaiannya, membangun tim sesuai rencana dan arah agency."
//           }
//           image1={"/assets/IconPD.jpeg"}
//           image2={"/assets/gilang.jpeg"}
//         />
//         <DivisionItem
//           title={"VICE PRESIDENT"}
//           description={
//             "membantu dalam pengambilan keputusan diamnco, membantu dan mengembangkan tim sesuai visi, misi, tujuan, serta arah agency yang telah di setujuin president director, bertanggung jawab atas operasional tim dan produksi terutama dibidang media entertainment, meningkatkan efisiensi dan produktivitas tim, menganalisa arah media entertainment agency."
//           }
//           image1={"/assets/IconVD.jpeg"}
//           image2={"/assets/bahtiar.jpeg"}
//           align="left"
//         />
//         <DivisionItem
//           title={"INFOMATION TECHNOLOGY"}
//           description={
//             "membangun sistem IT diamnco, mengerjakan setiap project IT, membangun portofolio IT, membangun branding diamnco."
//           }
//           image1={"/assets/IconIT.PNG"}
//           image2={"/assets/iki.jpg"}
//         />
//         <DivisionItem
//           title={"CONTENT CREATOR"}
//           description={
//             "memproduksi konten yang akan dipasarkan, menganalisa target pasar, membangun branding, menyusun strategi konten diamnco dan konsumen."
//           }
//           image1={"/assets/IconCC.PNG"}
//           image2={"/assets/henry.PNG"}
//           align="left"
//         />
//         <DivisionItem
//           title={"CREATIVE"}
//           description={
//             "menganalisa produk dan jasa apa yang perlu dihasilkan oleh diamnco, menentukan konsep produk dan jasa yang dihasilkan, menentukan script acara, mengerjakan project design graphic,"
//           }
//           image1={"/assets/IconDC.PNG"}
//           image2={"/assets/sila.PNG"}
//         />
//         <DivisionItem
//           title={"DIGITAL MARKETING"}
//           description={
//             "membangun kemitraan dengan pihak luar, menjaring konsumen potensial, membangun branding diamnco, meriset pasar sesuai target diamnco."
//           }
//           image1={"/assets/IconDM.PNG"}
//           image2={"/assets/najwa.PNG"}
//           align="left"
//         />
//         <div className="text-center my-10 ">
//           <h2 className="text-3xl mb-3">Our Products</h2>
//           <p>Product Offer from DIAM Production</p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
//           <CardItem
//             judul={"DKV"}
//             deskripsi={"Desain Komunikasi Visual"}
//             imageUrl={"/assets/IconDM.PNG"}
//           />
//           <CardItem
//             judul={"FIKOM"}
//             deskripsi={"Fakultas Ilmu Komunikasi"}
//             imageUrl={"/assets/IconDM.PNG"}
//           />
//           <CardItem
//             judul={"FASILKOM"}
//             deskripsi={"Fakultas Ilmu Komputer"}
//             imageUrl={"/assets/IconDM.PNG"}
//           />
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }


"use client";
import CardItem from "@/components/CardItem";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Footer from "@/components/Footer";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProductInti from "./productinti/page";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import useProduct from "@/app/hooks/useProduct";

export default function Home() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const [orderLocations, setOrderLocations] = useState([]);
  const [newAssetNotification, setNewAssetNotification] = useState(false);
  const [assetNotification, setAssetNotification] = useState(false);
  const { isInCart, removeFromCart, addToCart } = useProduct();
  const [userName, setUserName] = useState(""); // Inisialisasi state userName dengan nilai awal kosong
  useEffect(() => {
    if (user && userProfile.role === "admin") {
      router.push("/admin");
    }else if (user && userProfile.role === "user") {
      // Jika user adalah admin, kita dapat menampilkan alert selamat datang
      // dan menampilkan nama admin dari userProfile
      alert("Selamat datang, " + userProfile.name);
      setUserName(userProfile.name);
    }
  }, [user, userProfile, router]);

    // Fetch products from Firestore
    useEffect(() => {
      const unsubProduct = onSnapshot(
        collection(db, "products"),
        (snapshot) => {
          let productList = [];
          snapshot.docs.forEach((doc) => {
            productList.push({ id: doc.id, ...doc.data() });
          });
          setData(productList);
        },
        (error) => console.log(error)
      );
      return () => unsubProduct();
    }, []);
  
    // Fetch order locations from Firestore
    useEffect(() => {
      const unsubOrders = onSnapshot(
        collection(db, "users"),
        (snapshot) => {
          let locations = [];
          snapshot.docs.forEach((doc) => {
            const location = doc.data().companyAddress;
            if (location) locations.push(location);
          });
          setOrderLocations(locations);
        },
        (error) => console.log(error)
      );
      return () => unsubOrders();
    }, []);
  
    // Filter products based on category and order locations
    const filteredData = data.filter((product) => {
      const productCategory = product.category.toLowerCase().trim();
      const locationMatch = orderLocations.some(
        (location) => location.toLowerCase().trim() === productCategory
      );
  
      if (categoryFilter === "all") {
        return locationMatch; // Show products that match any order location
      }
      
      return productCategory === categoryFilter;
    });
  
    // Debug filtered results
    console.log("Filtered Products:", filteredData);
  
    const handleSearchInputChange = (e) => {
      setSearchInput(e.target.value.toLowerCase());
    };
  
    useEffect(() => {
      const selectElement = document.querySelector(".select");
      selectElement.childNodes.forEach((option) => {
        if (option.value.toLowerCase().includes(searchInput)) {
          option.selected = true;
        }
      });
      setCategoryFilter(searchInput);
    }, [searchInput]);
  
    useEffect(() => {
      const notificationTimeout = setTimeout(() => {
        setNewAssetNotification(false);
      }, 5000);
      return () => clearTimeout(notificationTimeout);
    }, [newAssetNotification]);
  
    useEffect(() => {
      const notificationTimeout = setTimeout(() => {
        setAssetNotification(false);
      }, 5000);
      return () => clearTimeout(notificationTimeout);
    }, [assetNotification]);
  // return (
  //   <div>
  //     <Navbar />
  //     <div className="relative">
  //       <Image
  //         src={"/assets/BG1.jpg"}
  //         width={3000 / 3}
  //         height={2000 / 3}
  //         className="relative w-full h-screen object-cover"
  //         alt="Home Page"
  //         priority
  //       />
  //       <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center flex flex-col gap-3 w-3/4 md:w-fit">
  //         <h1 className="text-5xl font-extrabold text-orange-950">
  //           BALEHO
  //         </h1>
  //         <p className="text-xl">Choose the product according to your wishes</p>
  //         <button className="bg-white p-4 rounded-lg font-bold text-xl">
  //           R +
  //         </button>
  //       </div>
  //     </div>
  //     <div className="p-5 md:p-24">
  //       <div className="text-center my-10 ">
  //         <h2 className="text-3xl mb-3">Our Products</h2>
  //         <p>Product Offer from DIAM Production</p>
  //       </div>
  //       {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
  //         <CardItem
  //           judul={"DKV"}
  //           deskripsi={"Desain Komunikasi Visual"}
  //           imageUrl={"/assets/IconDM.PNG"}
  //         />
  //         <CardItem
  //           judul={"FIKOM"}
  //           deskripsi={"Fakultas Ilmu Komunikasi"}
  //           imageUrl={"/assets/IconDM.PNG"}
  //         />
  //         <CardItem
  //           judul={"FASILKOM"}
  //           deskripsi={"Fakultas Ilmu Komputer"}
  //           imageUrl={"/assets/IconDM.PNG"}
  //         />
  //       </div> */}
  //               <div className="flex justify-between mb-10">
  //         <h2 className="text-3xl mb-3">All Products</h2>
  //         {assetNotification && (
  //           <div className="notification-3xl mb-3">
  //             Happy Hunting
  //           </div>
  //         )}
  //         <input
  //           type="text"
  //           className="input input-bordered"
  //           value={searchInput}
  //           onChange={handleSearchInputChange}
  //         />
  //         <select
  //           className="select select-bordered w-full max-w-xs"
  //           onChange={(e) => setCategoryFilter(e.target.value.toLowerCase())}
  //         >
  //           <option value={"all"}>All</option>
  //           <option value={"fikom"}>Fikom</option>
  //           <option value={"dkv"}>DKV</option>
  //           <option value={"fasilkom"}>Fasilkom</option>
  //           <option value={"baleho 1"}>Baleho</option>
  //           <option value={"baleho 2"}>Baleho</option>
  //           <option value={"baleho 3"}>Baleho</option>
  //           <option value={"baleho 4"}>Baleho</option>
  //           <option value={"baleho 5"}>Baleho</option>
  //           <option value={"baleho 6"}>Baleho</option>
  //           <option value={"baleho 7"}>Baleho</option>
  //           <option value={"baleho 8"}>Baleho</option>
  //           <option value={"baleho 9"}>Baleho</option>
  //           <option value={"baleho 10"}>Baleho</option>
  //         </select>
  //       </div>
  //       <div className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-6">
  //         {filteredData.map((product) => (
  //           <CardItem
  //             key={product.id}
  //             imageUrl={product.image}
  //             fakultas={product.category}
  //             judul={product.title}
  //             deskripsi={product.description}
  //             harga={product.price}
  //             addToCart={() => addToCart(product)}
  //             addToMutasi={() => addToMutasi(product)}
  //             removeFromCart={() => removeFromCart(product)}
  //             isInCart={isInCart(product.id)}
  //           />
  //         ))}
  //       </div>        
  //     </div>
  //     <Footer />
  //   </div>
  // );

  return (
    <div>
      <Navbar />
      <div className="relative">
        <Image
          src={"/assets/BG1.jpg"}
          width={3000 / 3}
          height={2000 / 3}
          className="relative w-full h-screen object-cover"
          alt="Home Page"
          priority
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center flex flex-col gap-3 w-3/4 md:w-fit">
          <h1 className="text-5xl font-extrabold text-orange-950">
            BALEHO
          </h1>
          <p className="text-xl">Choose the product according to your wishes</p>
          <button className="bg-white p-4 rounded-lg font-bold text-xl">
            R +
          </button>
        </div>
      </div>
      <div className="p-5 md:p-24">
        <div className="text-center my-10">
          <h2 className="text-3xl mb-3">Our Products</h2>
          <p>Product Offer from DIAM Production</p>
        </div>
        
        <div className="flex justify-between mb-10">
          <h2 className="text-3xl mb-3">Product</h2>
          {assetNotification && (
            <div className="notification-3xl mb-3">
              Happy Hunting
            </div>
          )}
          <input
            type="text"
            className="input input-bordered"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <select
            className="select select-bordered w-full max-w-xs"
            onChange={(e) => setCategoryFilter(e.target.value.toLowerCase())}
          >
            <option value={"all"}>All</option>
            {/* Tambahkan opsi lain sesuai kebutuhan */}
          </select>
        </div>
        
        {/* Loader sederhana untuk menunggu data */}
        {data.length === 0 ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-6">
            {filteredData.map((product) => (
              <CardItem
                key={product.id}
                imageUrl={product.image}
                fakultas={product.category}
                judul={product.title}
                deskripsi={product.description}
                harga={product.price}
                addToCart={() => addToCart(product)}
                addToMutasi={() => addToMutasi(product)}
                removeFromCart={() => removeFromCart(product)}
                isInCart={isInCart(product.id)}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
  
}