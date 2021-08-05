/** @format */

import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  Button,
  View,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import * as Facebook from "expo-facebook";
// import { logOutAsync, setUserDataAsync, getUserIDAsync } from "expo-facebook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../state/user";

// const id = "588827002106865"
// const secretKey = "31b0617b3eb5843ea53856fe232c44c2"

export default function Login() {
  const [user, setUser] = useState(null);
  const id = "2075898539247474";
  const dispatch = useDispatch();

  async function logIn() {
    try {
      await Facebook.initializeAsync({
        appId: `${id}`,
      });
      const { type, token, expirationDate, permissions, declinedPermissions } =
        await Facebook.logInWithReadPermissionsAsync({
          permissions: ["public_profile", "email"],
        });
      if (type === "success") {
        const response = await fetch(
          `https://graph.facebook.com/me?fields=id,name,first_name,last_name,middle_name,picture&type=large,email&access_token=${token}`
        );
        const data = await response.json();
        // Alert.alert("Logged in!", `Hi ${(await response.json()).name}!`);

        const usuario = {
          email: data.email,
          password: data.id,
        };
         setUser(usuario);
      }
    } catch ({ message }) {
    }
  }
  dispatch(loginUser(user));

  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        style={{
          backgroundColor: "#23036A",
          padding: 7,
          borderRadius: 20,
          width: 150,
          marginTop: 25,
        }}
        onPress={logIn}
      >
        <Text
          style={{
            fontFamily: "Poppins_300Light",
            color: "#fff",
            textAlign: "center",
          }}
        >
          Inicia sesion con Facebook
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
    fontFamily: "Poppins_500Medium",
    color: "#23036A",
  },
  textSubtitle: {
    fontFamily: "Poppins_300Light",
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D4B5FA",
    width: 300,
    marginBottom: 20,
  },
  button: {
    fontSize: 15,
    color: "white",
    width: 200,
    borderRadius: 50,
    overflow: "hidden",
  },
});
