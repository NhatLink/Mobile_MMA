import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import fetchOrders from "../../hook/fetchOrders";
import OrderTile from "./OrderTile";
import { useNavigation } from "@react-navigation/native";

const OrdersList = () => {
  const navigation = useNavigation();
  const { data, isLoading, error, refetch } = fetchOrders();
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Image
          source={{
            uri: "https://rsrc.easyeat.ai/mweb/no-orders2.webp",
          }} // Đường dẫn tới ảnh bạn muốn hiển thị
          style={styles.emptyImage}
        />
        <View style={styles.buttonContainer}>
          <Button
            title="Go to Shopping"
            onPress={() => navigation.navigate("Bottom Navigation")} // Thay 'Home' bằng tên màn hình chính xác trong stack navigator của bạn
          />
        </View>
      </View>
    );
  }
  return (
    <View>
      {/* Render cart item list */}
      <FlatList
        data={data}
        keyExtractor={(item) => item?.delivery?._id}
        renderItem={({ item }) => <OrderTile item={item} />}
        vertical={true}
        contentContainerStyle={styles.container}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },

  separator: {
    // width: 16,
    height: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // hoặc màu nền tùy chọn của bạn
  },
  emptyImage: {
    width: 300, // Chiều rộng của màn hình
    height: 300, // Chiều cao của màn hình
    resizeMode: "cover", // Điều chỉnh ảnh để vừa vặn không gian hiển thị mà không bị méo
  },
  buttonContainer: {
    position: "absolute", // Đặt nút ở trên cùng màn hình
    bottom: 20, // Cách đáy màn hình 20 pixel
    left: 20, // Cách mép trái màn hình 20 pixel
    right: 20, // Cách mép phải màn hình 20 pixel
  },
});

export default OrdersList;
