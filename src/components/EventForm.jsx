import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
//Redux import
import { useSelector, useDispatch } from "react-redux";
import { createUser } from "../state/user";
import { showCategories, addCategory } from "../state/categories";
//Form library import
import { useForm, Controller } from "react-hook-form";

const EventForm = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { categories } = useSelector((store) => store.categories);

  const dispatch = useDispatch();

  React.useEffect(() => {
    let mounted = true;
    if (mounted) {
      dispatch(showCategories());
    } else return (mounted = false);
  }, []);

  const itemsForDropdown = [];
  categories.forEach((item) => {
    if (item.type !== undefined) {
      itemsForDropdown.push({ label: item.type, value: item.type });
    }
  });

  const placeholder = {
    label: "Seleccionar...",
    value: null,
  };

  const onSubmit = (data) => {
    // dispatch(createUser(data)).then(() => navigation.goBack());
    console.log(data);
  };

  return (
    <SafeAreaView>
      <View>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textSubtitle}
              placeholder="Nombre Del Evento"
              placeholderTextColor="#23036A"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="name"
          defaultValue=""
        />
        {errors.name && <Text> is not a valid name</Text>}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textSubtitle}
              placeholderTextColor="#23036A"
              placeholder="Ubicacion"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="address"
          defaultValue=""
        />
        {errors.lastName && <Text> is not a valid last name.</Text>}
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textSubtitle}
              placeholder="Fecha"
              placeholderTextColor="#23036A"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="planDate"
          defaultValue=""
        />
        {errors.email && <Text>is not a valid mail</Text>}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <RNPickerSelect
              placeholder={placeholder}
              // onValueChange={(value) => console.log("OnValue", value)}
              onValueChange={onChange}
              onBlur={onBlur}
              items={itemsForDropdown}
            />
          )}
          name="categories"
        />

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textSubtitle}
              placeholder="Descripción del evento"
              placeholderTextColor="#23036A"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="name"
          defaultValue=""
        />

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#23036A",
              padding: 7,
              borderRadius: 20,
              width: 150,
              marginTop: 25,
            }}
            onPress={handleSubmit(onSubmit)}
          >
            <Text
              style={{
                fontFamily: "Poppins_300Light",
                color: "#fff",
                textAlign: "center",
              }}
            >
              Registrarse
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EventForm;
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
  },
  textSubtitle: {
    fontFamily: "Poppins_300Light",
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D4B5FA",
    width: 300,
    marginBottom: 15,
  },
});
