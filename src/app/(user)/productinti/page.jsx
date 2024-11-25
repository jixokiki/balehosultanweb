"use client";
import useAuth from "@/app/hooks/useAuth";
import useProduct from "@/app/hooks/useProduct";
import CardItem from "@/components/CardItem";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProductInti = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const [orderLocations, setOrderLocations] = useState([]);
  const [newAssetNotification, setNewAssetNotification] = useState(false);
  const [assetNotification, setAssetNotification] = useState(false);
  const { isInCart, removeFromCart, addToCart } = useProduct();

  useEffect(() => {
    if (user && userProfile.role === "admin") {
      router.push("/admin");
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

  return (
    <div>
      <Navbar />
      <div className="p-8 md:p-24 mt-10">
        <div className="flex justify-between mb-10">
          <h2 className="text-3xl mb-3">All Products</h2>
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
            <option value={"fikom"}>Fikom</option>
            <option value={"dkv"}>DKV</option>
            <option value={"fasilkom"}>Fasilkom</option>
            <option value={"baleho 1"}>Baleho</option>
            <option value={"baleho 2"}>Baleho</option>
            <option value={"baleho 3"}>Baleho</option>
            <option value={"baleho 4"}>Baleho</option>
            <option value={"baleho 5"}>Baleho</option>
            <option value={"baleho 6"}>Baleho</option>
            <option value={"baleho 7"}>Baleho</option>
            <option value={"baleho 8"}>Baleho</option>
            <option value={"baleho 9"}>Baleho</option>
            <option value={"baleho 10"}>Baleho</option>
          </select>
        </div>
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
      </div>
      <Footer />
    </div>
  );
};

export default ProductInti;
