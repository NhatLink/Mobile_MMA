import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, SHADOWS } from "../../constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const OrderTile = ({ item }) => {
  return (
    <View>
      <TouchableOpacity onPress={() => {}} style={styles.container}>
        <View style={styles.containerProduct}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item?.order?.product_id?.image[0] }}
              resizeMode="cover"
              style={styles.productImg}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.productTxt} numberOfLines={1}>
              {item?.order?.product_id?.productName}
            </Text>
            <Text style={styles.supplierTxt} numberOfLines={1}>
              Quantity: {item?.order?.quantity}
            </Text>
            <Text style={styles.supplierTxt} numberOfLines={1}>
              Total Price: {item?.order?.totalPrice}
            </Text>
          </View>
        </View>

        <View style={styles.containerDelivery}>
          <View style={styles.checkoutBtn}>
            <Text style={styles.checkOutText}>{item?.delivery?.status}</Text>
          </View>

          <View style={styles.orderRow}>
            <MaterialCommunityIcons
              name="truck-fast-outline"
              size={16}
              color="gray"
            />
            <Text style={styles.totalText}>
              {item?.shipper?.shipperName} - {item?.shipper?.phone}{" "}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default OrderTile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "column",
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    backgroundColor: "#FFF",
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
  },
  containerProduct: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  containerDelivery: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    maxWidth: 200,
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
  checkOutText: {
    paddingHorizontal: 10,
    fontSize: SIZES.small,
    fontWeight: "500",
    letterSpacing: 1,
    color: COLORS.lightWhite,
    textTransform: "uppercase",
  },
  checkoutBtn: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 140,
    maxHeight: 20,
  },
  orderRow: {
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalText: {
    fontFamily: "medium",
    fontSize: SIZES.small,
    color: COLORS.gray,
    textTransform: "uppercase",
  },
});
