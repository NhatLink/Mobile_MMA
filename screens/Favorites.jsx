import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { COLORS, SIZES, SHADOWS } from "../constants";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
const Favorites = ({ navigation }) => {
  const [favoritesData, setFavoritesData] = useState([]);
  useFocusEffect(
    useCallback(() => {
      checkFavorites();
      // Không cần trả về hàm dọn dẹp trong trường hợp này
      return () => {};
    }, [checkFavorites])
  );

  const checkFavorites = useCallback(async () => {
    const id = await AsyncStorage.getItem("id");
    if (id !== null) {
      const favoritesId = `favorites${JSON.parse(id)}`;
      console.log("fav", favoritesId);
      try {
        const favoritesObj = await AsyncStorage.getItem(favoritesId);
        if (favoritesObj !== null) {
          const favorites = JSON.parse(favoritesObj);
          const favoritesArray = Object.values(favorites);
          setFavoritesData(favoritesArray); // Đảm bảo bạn đã khai báo setFavoritesData
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  const deleteFavorite = async (id) => {
    const userId = await AsyncStorage.getItem("id");
    const favoritesId = `favorites${JSON.parse(userId)}`;
    console.log(favoritesId);
    let productId = id;

    console.log(productId);
    try {
      const existingItem = await AsyncStorage.getItem(favoritesId);
      let favoritesObj = existingItem ? JSON.parse(existingItem) : {};

      if (favoritesObj[productId]) {
        // Key exists, so delete it
        delete favoritesObj[productId];

        checkFavorites();
      } else {
        console.log(`Key does not exist: ${productId}`);
        navigation.navigate("Home");
      }

      await AsyncStorage.setItem(favoritesId, JSON.stringify(favoritesObj));
    } catch (error) {
      console.log(error);
    }
  };
  console.log(favoritesData);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperRow}>
        <TouchableOpacity
          style={{ paddingLeft: 0 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-circle" size={30} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.title}> Favorites </Text>
      </View>
      {favoritesData?.length > 0 ? (
        <FlatList
          data={favoritesData}
          renderItem={({ item }) => (
            // Render your favorite item here
            <View>
              <TouchableOpacity
                style={styles.favcontainer}
                onPress={() =>
                  navigation.navigate("Details", { product: item._id })
                }
              >
                <TouchableOpacity style={styles.imageContainer}>
                  <Image
                    source={{ uri: item?.image }}
                    resizeMode="cover"
                    style={styles.productImg}
                  />
                </TouchableOpacity>
                <View style={styles.textContainer}>
                  <Text style={styles.productTxt} numberOfLines={1}>
                    {item.productName}
                  </Text>
                  <Text style={styles.supplierTxt} numberOfLines={1}>
                    {item.description}
                  </Text>
                  <Text style={styles.supplierTxt} numberOfLines={1}>
                    $ {item.price}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => deleteFavorite(item._id)}>
                  <SimpleLineIcons name="trash" size={24} color="black" />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text>No favorite found</Text>
      )}
    </SafeAreaView>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  upperRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: SIZES.width - 50,
    marginBottom: SIZES.xSmall,
  },
  title: {
    fontSize: SIZES.xLarge,
    fontFamily: "bold",
    fontWeight: "500",
    letterSpacing: 2,
  },
  favcontainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: SIZES.xSmall,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    backgroundColor: "#FFF",
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
  },
  imageContainer: {
    width: 70,
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  productImg: {
    width: "100%",
    height: 65,
    borderRadius: SIZES.small,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: SIZES.medium,
  },
  productTxt: {
    fontSize: SIZES.medium,
    fontFamily: "bold",
    color: COLORS.primary,
  },
  supplierTxt: {
    fontSize: SIZES.small + 2,
    fontFamily: "regular",
    color: COLORS.gray,
    marginTop: 3,
    textTransform: "capitalize",
  },
});
