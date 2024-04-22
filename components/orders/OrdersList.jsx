import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Image,
  Button,
  ScrollView,
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import fetchOrders from "../../hook/fetchOrders";
import OrderTile from "./OrderTile";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const OrdersList = () => {
  const navigation = useNavigation();
  const { data, isLoading, error, refetch } = fetchOrders();
  const [filteredData, setFilteredData] = useState(data);
  const [selectedStatus, setSelectedStatus] = useState(null);
  useEffect(() => {
    setFilteredData(data); // Cập nhật filteredData mỗi khi data thay đổi
  }, [data]); // Phụ thuộc vào data

  const filterOrder = (status) => {
    setSelectedStatus(status);
    if (status === null) {
      setFilteredData(data);
    } else if (status === "Cho xac nhan") {
      setFilteredData(data.filter((item) => !item?.delivery));
    } else {
      setFilteredData(
        data.filter(
          (item) =>
            item?.delivery?.status?.toLowerCase() === status.toLowerCase()
        )
      );
    }
  };
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => filterOrder(null)}
        >
          <View style={styles.filterContent}>
            <MaterialCommunityIcons
              name="truck-fast-outline"
              size={16}
              color="gray"
            />
            <Text style={styles.filterText}>All</Text>
          </View>
        </TouchableOpacity>
        {["Cho xac nhan", "Dang giao hang", "Da giao hang"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              selectedStatus === status && styles.selectedFilterButton,
            ]}
            onPress={() => filterOrder(status)}
          >
            <View style={styles.filterContent}>
              <MaterialCommunityIcons
                name="truck-fast-outline"
                size={16}
                color="gray"
              />
              <Text style={styles.filterText}>{status}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {filteredData.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={{ uri: "https://rsrc.easyeat.ai/mweb/no-orders2.webp" }}
            style={styles.emptyFilterImage}
          />
          {/* <View style={styles.buttonContainer}>
            <Button
              title="Go to Shopping"
              onPress={() => navigation.navigate("Bottom Navigation")}
            />
          </View> */}
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item?.delivery?.order?._id}
          renderItem={({ item }) => <OrderTile item={item} />}
          vertical={true}
          contentContainerStyle={styles.container}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
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
  emptyFilterImage: {
    marginTop: 500,
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
  filterButton: {
    padding: 10,
    marginRight: 3,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  filtersContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#f0f0f0",
  },
});

export default OrdersList;
