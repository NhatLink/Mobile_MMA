import { useState } from "react";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Button, // Import Button
} from "react-native";
import { COLORS, SIZES } from "../../constants";
import useFetch from "../../hook/useFetch";
import ProductCardView from "../ProductViewCard";

const ProductRow = () => {
  const { data, isLoading, error } = useFetch();
  const [numItemsToShow, setNumItemsToShow] = useState(4);

  const loadMoreItems = () => setNumItemsToShow(numItemsToShow + 4);

  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" colors={COLORS.primary} />
        ) : (
          <>
            <FlatList
              data={data.slice(0, numItemsToShow)}
              renderItem={({ item }) => <ProductCardView item={item} />}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ columnGap: SIZES.medium }}
              numColumns={2}
            />
            {numItemsToShow < data.length ? (
              <TouchableOpacity style={styles.loadMoreBtn} onPress={loadMoreItems}>
                <Text style={styles.btnText}>Load more</Text>
              </TouchableOpacity>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
};

export default ProductRow;


const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.small,
    marginBottom: 200,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: SIZES.large,
    fontFamily: "medium",
    color: COLORS.primary,
  },
  headerBtn: {
    fontSize: SIZES.medium,
    fontFamily: "medium",
    color: COLORS.gray,
  },
  cardsContainer: {
    marginTop: SIZES.medium,
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
  },
});
