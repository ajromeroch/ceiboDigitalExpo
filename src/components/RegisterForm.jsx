import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  SafeAreaView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createUser } from "../state/user";

const RegisterForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onBlur" });

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(createUser(data));
    console.log(data);
  };



  return (
    <SafeAreaView>

        {/* 
      //ESTO ES PARA LAS VALIDACIONES
      rules={{
           required: {
             value: true,
             message: 'Field is required!'
           }
         }} */}

         
         <Text style={styles.textTitle}>Email</Text>
         <Controller
        control={control}
        name="Email"
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            style={styles.textSubtitle}
            placeholder="Ingresá tu Email"
            value={value}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
          />
        )}
      />
      <Text style={styles.textTitle}>Password</Text>
      <Controller
        control={control}
        name='Password'
        render={({ field: { onChange, value, onBlur } }) => (
          <TextInput
            style={styles.textSubtitle}
            placeholder="Ingresá tu password"
            value={value}
            onBlur={onBlur}
            onChangeText={(value) => onChange(value)}
          />
        )}
      />
    <View style={styles.button}>
        <Button title="Enviar" onPress={handleSubmit(onSubmit)} />
    </View>

    </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              style={styles.textSubtitle}
              placeholder="Ingresá tu Email"
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              style={styles.textSubtitle}
              placeholder="Ingresá tu password"
              value={value}
              onBlur={onBlur}
              onChangeText={(value) => onChange(value)}
            />
          )}
        />
        <View style={styles.button}>
          <Button title="Enviar" onPress={handleSubmit(onSubmit)} />
        </View>
      </View>

    </SafeAreaView>
  );
};

export default RegisterForm;

const styles = StyleSheet.create({

    container: {
      flex: 1,
      width:'100%',
      height: '100%',
      alignItems: "center",
      justifyContent: "flex-start",
    },
    textSubtitle: {
      fontFamily: "Poppins_500Medium",
      fontSize: 15,
      textAlign: "center",
      borderBottomWidth: 1,
      borderBottomColor: '#D4B5FA',
      width: 300,
    },
    textTitle: {
        fontFamily: "Poppins_300Light",
        fontSize: 15,
        width: 300,
        color: 'white',
        marginBottom:5,
      },
    button: {
        marginTop: 10,
        color: 'white',
        width: '50%',
      },
  });

