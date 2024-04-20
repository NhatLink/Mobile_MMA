import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import { baseUrl } from "../utils/IP";
import React, { useState, useEffect } from "react";
import { COLORS, SIZES, images } from "../constants";
import {
  SimpleLineIcons,
  Ionicons,
  MaterialCommunityIcons,
  Fontisto,
} from "@expo/vector-icons";
import { ColorList, StarRating } from "../components";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import addToCart from "../hook/addToCart";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import Carousel from "react-native-snap-carousel";
const Details = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params;
  const [paymentUrl, setPaymentUrl] = useState("");
  const [favorites, setFavorites] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [count, setCount] = useState(1);
  const [data, setData] = useState({});
  const [dataFeedback, setDataFeedback] = useState({});
  const [dataStore, setDataStore] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userLogin, setUserLogin] = useState(false);
  const [currentImage, setCurrentImage] = useState();
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStore, setSelectedStore] = useState();
  const createCheckoutSession = async () => {
    const id = await AsyncStorage.getItem("id");

    const response = await fetch(
      "https://paymentorders-production.up.railway.app/stripe/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: JSON.parse(id),
          cartItems: [
            // Add your cart items here
            {
              name: data?.productName,
              id: data?._id,
              price: data?.price,
              cartQuantity: count,
              // store: selectedStore
            },
          ],
        }),
      }
    );

    const { url } = await response.json();
    setPaymentUrl(url);
  };
  const onNavigationStateChange = (webViewState) => {
    const { url } = webViewState;
    if (url && url.includes("checkout-success")) {
      navigation.navigate("Bottom Navigation");
      console.log("Payment successful!");
    } else if (url && url.includes("cancel")) {
      navigation.navigate("Bottom Navigation");
      console.log("Payment canceled!");
    }
  };

  useEffect(() => {
    checkUserExistence();
    checkFavorites();
    checkIdInAsyncStorage();
    handleGetDetailProduct();
    handleGetFeedbackProduct();
    handleGetStoreProduct();
  }, []);
  const checkUserExistence = async () => {
    const id = await AsyncStorage.getItem("id");
    const accessToken = await AsyncStorage.getItem("accessToken");
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
  const handleGetDetailProduct = async () => {
    if (!item || !item._id) {
      setError("No item ID provided");
      return;
    }
    try {
      const response = await axios.get(
        `${baseUrl}/product/getProductById/${item._id}`
      );
      setData(response.data);
      setCurrentImage(response.data.image[0]);
      setError("");
    } catch (error) {
      setError("Failed to fetch data");
      console.log("response data", error);
    }
  };

  const handleGetFeedbackProduct = async () => {
    if (!item || !item._id) {
      setError("No item ID provided");
      return;
    }
    try {
      const response = await axios.get(
        `${baseUrl}/feedback/getFeedback/${item._id}`
      );
      setDataFeedback(response.data.feedbacks);
      setError("");
    } catch (error) {
      setError("Failed to fetch data");
      console.log("response data", error);
    }
  };
  const handleGetStoreProduct = async () => {
    if (!item || !item._id) {
      setError("No item ID provided");
      return;
    }
    try {
      const response = await axios.get(
        `${baseUrl}/productInStore/getListStoreHaveProduct/${item._id}`
      );
      setDataStore(response.data.stores);
      console.log("Store", response.data.stores);
      setSelectedStore(response.data.stores[0]);
      setError("");
    } catch (error) {
      setError("Failed to fetch data");
      console.log("response data", error);
    }
  };

  const selectStore = (store) => {
    setSelectedStore(store);
    setModalVisible(false);
  };

  const checkFavorites = async () => {
    const userId = await AsyncStorage.getItem("id");
    const favoritesId = `favorites${JSON.parse(userId)}`;
    try {
      const favoritesObj = await AsyncStorage.getItem(favoritesId);
      if (favoritesObj !== null) {
        const favorites = JSON.parse(favoritesObj);
        if (favorites[item._id]) {
          setFavorites(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIdInAsyncStorage = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      setIsLoggedIn(true);

      userId = id;
    } catch (error) {
      console.error(error);
    }
  };

  const addFavorites = async () => {
    const userId = await AsyncStorage.getItem("id");
    const favoritesId = `favorites${JSON.parse(userId)}`;
    let productId = data?._id;
    let productObj = {
      productName: data?.productName,
      _id: data?._id,
      description: data?.description,
      image: data?.image.toString(),
      price: data?.price,
    };

    try {
      const existingItem = await AsyncStorage.getItem(favoritesId);
      let favoritesObj = existingItem ? JSON.parse(existingItem) : {};

      if (favoritesObj[productId]) {
        // Key already exists, so delete it
        delete favoritesObj[productId];

        console.log(`Deleted key: ${productId}`);
        setFavorites(false);
      } else {
        favoritesObj[productId] = productObj;
        console.log(`Added key: ${productId}`);
        setFavorites(true);
      }

      await AsyncStorage.setItem(favoritesId, JSON.stringify(favoritesObj));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePress = () => {
    if (userLogin) {
      createCheckoutSession();
    } else {
      // Navigate to the Login page when hasId is false
      navigation.navigate("Login");
    }
  };

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  useEffect(() => {
    setFilteredFeedbacks(dataFeedback);
  }, [dataFeedback]);
  const filterFeedbacksByRating = (rating) => {
    setSelectedRating(rating);
    if (rating === null) {
      setFilteredFeedbacks(dataFeedback);
    } else {
      setFilteredFeedbacks(
        dataFeedback.filter((feedback) => feedback.rating === rating)
      );
    }
  };
  return (
    <ScrollView style={styles.container}>
      {paymentUrl ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={onNavigationStateChange}
          />
        </SafeAreaView>
      ) : (
        <View style={styles.wrapper}>
          <View style={styles.upperRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back-circle"
                size={30}
                color={COLORS.black}
              />
            </TouchableOpacity>
            {userLogin === true && (
              <TouchableOpacity onPress={() => addFavorites()}>
                {favorites ? (
                  <Ionicons name="heart" size={30} color="green" />
                ) : (
                  <Ionicons
                    name="heart-outline"
                    size={30}
                    color={COLORS.black}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* {
            data?.image?.length > 0 ? (
              <Image source={{ uri: data.image[0] }} style={styles.image} />
            ) : (
              <Text>No image available</Text>
            ) // Or some default image or other placeholder
          } */}
          <View style={styles.containerImg}>
            <Image source={{ uri: currentImage }} style={styles.image} />
          </View>
          <View style={styles.details}>
            <ScrollView horizontal={true} style={styles.imageScrollView}>
              {data?.image?.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentImage(img)}
                >
                  <Image source={{ uri: img }} style={styles.thumbnailImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.titleRow(20, 20, SIZES.width - 44)}>
              <Text style={styles.title("bold", SIZES.large)}>
                {data?.productName}
              </Text>
              <View style={styles.priceWrapper}>
                <Text style={styles.title("semibold", SIZES.large, 10)}>
                  {" "}
                  $ {data?.price}
                </Text>
              </View>
            </View>
            <View style={styles.titleRow(0, 5, SIZES.width - 10)}>
              {/* <View style={styles.rating}> */}
              {/* <View style={{ flexDirection: "row" }}>
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Ionicons key={index} name="star" size={24} color="gold" />
                  ))}
                </View>
                <StarRating rating={data?.rating} />
                <Text style={{ color: COLORS.gray, fontSize: SIZES.medium }}>
                  {" "}
                  (4.9){" "}
                </Text> */}
              {/* <Text> Quantity: {selectedStore?.quantity} </Text> */}
              {/* </View> */}

              <View style={styles.rating}>
                <TouchableOpacity onPress={() => increment()}>
                  <SimpleLineIcons name="plus" size={20} color="black" />
                </TouchableOpacity>
                <Text>
                  {count}/{selectedStore?.quantity}{" "}
                </Text>
                <TouchableOpacity onPress={() => decrement()}>
                  <SimpleLineIcons name="minus" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.descriptionWrapper}>
            <Text style={styles.description}>Description</Text>
            <Text style={styles.descriptionText}>{data?.description}</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <View style={{ marginBottom: 10 }}>
                <View style={styles.location}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons name="location-outline" size={20} color="black" />
                    <Text> {data?.product_location}</Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* <MaterialCommunityIcons
                    name="truck-delivery-outline"
                    size={20}
                    color="black"
                  />
                  <Text> Free Delivery </Text> */}

                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {/* <MaterialCommunityIcons
                        name="truck-delivery-outline"
                        size={20}
                        color="black"
                      /> */}
                      <Text>
                        {selectedStore?.location},{selectedStore?.district},
                        {selectedStore?.province}{" "}
                      </Text>
                      {/* <Text> {selectedStore?.quantity} </Text> */}
                    </View>

                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={() => {
                        setModalVisible(!modalVisible);
                      }}
                    >
                      <View style={styles.modalView}>
                        <ScrollView>
                          {dataStore?.map((store, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => selectStore(store)}
                              style={styles.storeItemModal}
                            >
                              <Text style={styles.textModal}>
                                {store?.location}, {store?.district},{" "}
                                {store?.province}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                        <TouchableOpacity
                          style={[styles.buttonModal, styles.buttonCloseModal]}
                          onPress={() => setModalVisible(!modalVisible)}
                        >
                          <Text style={styles.textStyleModal}>Close</Text>
                        </TouchableOpacity>
                      </View>
                    </Modal>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View>
              <ColorList colors={data?.product_colors} />
            </View>

            <View style={styles.titleRow(0, 0)}>
              {/* onPress={handlePress} */}
              <TouchableOpacity style={styles.cartBtn} onPress={handlePress}>
                <Text
                  style={styles.title(
                    "bold",
                    SIZES.large,
                    10,
                    COLORS.lightWhite
                  )}
                >
                  BUY NOW
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addToCart}
                onPress={() => addToCart(data?._id, 1)}
              >
                <Fontisto
                  name="shopping-bag"
                  size={22}
                  color={COLORS.lightWhite}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.feedbackHeader}
            onPress={() => setFeedbackVisible(!feedbackVisible)}
          >
            <Text style={styles.feedbackTitle}>Feedback</Text>
            <FontAwesome5
              name={feedbackVisible ? "chevron-down" : "chevron-up"}
              size={18}
              color="#000"
            />
          </TouchableOpacity>
          {feedbackVisible && (
            <>
              <View style={styles.ratingContainer}>
                <StarRating
                  rating={
                    dataFeedback?.length > 0
                      ? dataFeedback?.reduce(
                          (acc, curr) => acc + curr.rating,
                          0
                        ) / dataFeedback?.length
                      : 0
                  }
                />
                <Text style={styles.averageRatingText}>
                  {dataFeedback?.length > 0
                    ? (
                        dataFeedback?.reduce(
                          (acc, curr) => acc + curr.rating,
                          0
                        ) / dataFeedback?.length
                      ).toFixed(1) + "/5.0"
                    : "No ratings"}
                </Text>
                <Text style={styles.totalFeedbackText}>
                  {dataFeedback?.length > 0
                    ? "(" + dataFeedback?.length + " reviews)"
                    : "(0 review)"}
                </Text>
              </View>

              <View style={styles.filtersContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => filterFeedbacksByRating(null)}
                  >
                    <View style={styles.filterContent}>
                      <FontAwesome name="star" size={16} color="gold" />
                      <Text style={styles.filterText}>All</Text>
                    </View>
                  </TouchableOpacity>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      style={[
                        styles.filterButton,
                        selectedRating === rating &&
                          styles.selectedFilterButton,
                      ]}
                      onPress={() => filterFeedbacksByRating(rating)}
                    >
                      <View style={styles.filterContent}>
                        <FontAwesome name="star" size={16} color="gold" />
                        <Text style={styles.filterText}>
                          {rating} Star{rating > 1 ? "s" : ""}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.feedbackSection}>
                <Text style={styles.totalFeedbackText}>
                  Feedbacks: {filteredFeedbacks?.length}
                </Text>
                {filteredFeedbacks?.map((feedback, index) => (
                  <View key={index} style={styles.feedback}>
                    <View style={styles.feedbackName}>
                    <Text style={styles.author}>{feedback?.userName}</Text>
                    <Text style={styles.date}>
                      {new Date(feedback?.timestamp).toLocaleDateString()}
                    </Text>
                    </View>
                    <StarRating rating={feedback?.rating} />
                    <Text style={styles.feedbackText}>{feedback?.content}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  location: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    padding: 5,
    borderRadius: SIZES.xLarge,
  },
  upperRow: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    width: SIZES.width - 44,
    top: SIZES.xxLarge,
    zIndex: 999,
  },
  titleRow: (marginHorizontal, top, width) => ({
    marginHorizontal: marginHorizontal,
    paddingBottom: SIZES.xSmall,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: width,
    top: top,
  }),

  image: {
    aspectRatio: 1,
    resizeMode: "cover",
    width: "100%",
  },
  details: {
    marginTop: -SIZES.large,
    backgroundColor: COLORS.lightWhite,
    width: SIZES.width,
    borderTopLeftRadius: SIZES.medium,
    borderTopRightRadius: SIZES.medium,
  },
  title: (fam, fz, padding, color) => ({
    fontFamily: fam,
    fontSize: fz,
    paddingHorizontal: padding,
    color: color ?? COLORS.black,
  }),

  priceWrapper: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.large,
  },
  rating: {
    top: SIZES.large,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginHorizontal: SIZES.large,
  },
  description: {
    fontFamily: "medium",
    fontSize: SIZES.large - 2,
  },
  descriptionWrapper: {
    marginTop: SIZES.large * 2,
    marginHorizontal: SIZES.large,
  },
  descriptionText: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    textAlign: "justify",
    marginBottom: SIZES.small,
  },
  addToCart: {
    width: 37,
    height: 37,
    borderRadius: 50,
    margin: SIZES.small,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },

  cartBtn: {
    width: "auto",
    backgroundColor: COLORS.black,
    padding: SIZES.xSmall / 2,
    borderRadius: SIZES.large,
  },
  containerImg: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  mainImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  imageScrollView: {
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 10,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "left",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  feedbackSection: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  feedbackName: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: "10px"
  },
  feedback: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  totalFeedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedbackText: {
    fontSize: 14,
    color: "#666",
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  icon: { position: "absolute", top: 10, right: 10 },
  filterButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  filtersContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#f0f0f0",
  },

  filterButton: {
    padding: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    backgroundColor: "#fff",
  },

  selectedFilterButton: {
    borderColor: "blue",
    backgroundColor: "#e0e0ff",
  },

  filterContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  filterText: {
    marginLeft: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
  },
  averageRatingText: {
    marginLeft: 5,
    marginRight: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  storeItemModal: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  textModal: {
    fontSize: 16,
  },
  buttonModal: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonCloseModal: {
    backgroundColor: "#2196F3",
  },
  textStyleModal: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Details;
