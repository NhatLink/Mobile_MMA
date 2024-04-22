import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import axios from "axios";
import Input from "../components/auth/input";
import Button from "../components/auth/Button";
import BackButton from "../components/auth/BackButton";
// import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import * as ImagePicker from "react-native-image-picker";
const Signup = ({ navigation }) => {
  const [loader, setLoader] = React.useState(false);
  const [responseData, setResponseData] = useState(null);
  const [image, setImage] = useState(null);
  const [inputs, setInput] = React.useState({
    username: "",
    email: "",
    location: "",
    password: "",
  });

  const chooseImage = () => {
    const options = {
      title: "Select Avatar",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
      mediaType: "photo",
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setImage(source);
        setInput((prevState) => ({ ...prevState, image: response.assets[0] }));
      }
    });
  };

  const [errors, setErrors] = React.useState({});

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  // INPUT VALIDATION
  const validate = () => {
    Keyboard.dismiss();
    let valid = true;

    if (!inputs.email) {
      handleError("Provide a valid email", "email");
      valid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError("Provide a valid email", "email");
      valid = false;
    }

    if (!inputs.location) {
      handleError("Please input location", "location");
      valid = false;
    } else if (inputs.location.length < 3) {
      handleError("At least 3 characters are required", "location");
      valid = false;
    }

    if (!inputs.username) {
      handleError("Please input username", "username");
      valid = false;
    } else if (inputs.location.length < 5) {
      handleError("At least 3 characters are required", "username");
      valid = false;
    }

    if (!inputs.password) {
      handleError("Please input password", "password");
      valid = false;
    } else if (inputs.password.length < 8) {
      handleError("At least 8 characters are required", "password");
      valid = false;
    }

    if (valid) {
      register();
    }
  };

  // const register = async () => {
  //   setLoader(true);
  //   try {
  //     const endpoint = "http://localhost:3000/api/register";
  //     const data = inputs;
  //     console.log(data);

  //     const response = await axios.post(endpoint, data);

  //     if (response.status === 201) {
  //       setResponseData(response.data);

  //       navigation.replace("Login");
  //     }
  //   } catch (error) {
  //     Alert.alert("Error", error);
  //   }
  // };
  const register = async () => {
    setLoader(true);
    const endpoint = "http://localhost:3000/api/register"; // Đảm bảo URL này đúng
    const data = new FormData();
    data.append("username", inputs.username);
    data.append("email", inputs.email);
    data.append("location", inputs.location);
    data.append("password", inputs.password);

    if (inputs.image) {
      data.append("image", {
        name: "avatar.jpg",
        type: "image/jpeg",
        uri:
          Platform.OS === "android"
            ? inputs.image.uri
            : inputs.image.uri.replace("file://", ""),
      });
    }

    try {
      const response = await axios.post(endpoint, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setResponseData(response.data);
        navigation.replace("Login");
      }
    } catch (error) {
      console.error("Registration error: ", error);
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoader(false);
    }
  };

  const handleChanges = (text, input) => {
    setInput((prevState) => ({ ...prevState, [input]: text }));
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ marginHorizontal: 20 }}>
        <KeyboardAvoidingView>
          <View>
            <BackButton onPress={() => navigation.goBack()} />
            <Image
              source={require("../assets/images/bk.png")}
              style={styles.img}
            />
            {/* WELCOME TEXT */}

            <Text style={styles.motto}>Sign up and start shopping</Text>

            <Input
              placeholder="Username"
              icon="face-man-profile"
              label={"Username"}
              error={errors.username}
              onFocus={() => {
                handleError(null, "username");
              }}
              onChangeText={(text) => handleChanges(text, "username")}
            />

            <Input
              placeholder="Enter email"
              icon="email-outline"
              label={"Email"}
              error={errors.email}
              onFocus={() => {
                handleError(null, "email");
              }}
              onChangeText={(text) => handleChanges(text, "email")}
            />

            <Input
              placeholder="Location"
              label={"Location"}
              error={errors.location}
              onFocus={() => {
                handleError(null, "location");
              }}
              onChangeText={(text) => handleChanges(text, "location")}
            />

            <Input
              placeholder="Password"
              icon="lock-outline"
              label={"Password"}
              error={errors.password}
              onFocus={() => {
                handleError(null, "password");
              }}
              onChangeText={(text) => handleChanges(text, "password")}
            />
            {image && (
              <Image
                source={{ uri: image.uri }}
                style={{ width: 100, height: 100, marginBottom: 10 }}
              />
            )}
            <Button
              title="Choose Image"
              onPress={() => {
                chooseImage();
              }}
            />
            <Button title={"SIGNUP"} onPress={validate} />
            <Text style={styles.registered} onPress={() => navigation.goBack()}>
              Already have an acount? Login
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  scroll: {
    // paddingTop: 30,
    paddingHorizontal: 20,
  },
  inputView: {
    marginHorizontal: 20,
  },
  registered: {
    marginTop: 10,
    color: COLORS.black,
    textAlign: "center",
  },
  img: {
    height: SIZES.height / 3,
    width: SIZES.width - 60,
    resizeMode: "contain",
    marginBottom: SIZES.xxLarge,
  },

  motto: {
    marginBottom: 20,
    fontFamily: "bold",
    textAlign: "center",
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
  },
});
