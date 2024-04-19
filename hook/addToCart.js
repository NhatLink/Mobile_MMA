import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
const addToCart = async (productId, quantity) => {
  const [userLogin, setUserLogin] = useState(false);
  useEffect(() => {
    checkUserExistence();
  }, []);
  const checkUserExistence = async () => {
    const id = await AsyncStorage.getItem("id");
    const accessToken = await AsyncStorage.getItem("accessToken");
    console.log("token", accessToken);
    console.log("id", id);
    const userID = `user${JSON.parse(id)}`;
    try {
      const userData = await AsyncStorage.getItem(userID);
      if (userData !== null) {
        setUserLogin(true);
      }
      // else {
      //   navigation.navigate("Login");
      // }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };
  try {
    const id = await AsyncStorage.getItem("id");
    const endpoint = "http://localhost:3000/api/cart";
    const data = {
      cartItem: productId,
      quantity: quantity,
      userId: JSON.parse(id),
    };
    await axios.post(endpoint, data);
  } catch (error) {
    throw new Error(error.message);
  }
};

export default addToCart;
