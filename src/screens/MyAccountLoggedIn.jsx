import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  Platform,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
//Redux imports
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../state/user";
import { showCategories } from "../state/categories";
import { addFavCategory } from "../state/user";

//Libraries imports
import { Avatar } from "react-native-elements";
import Svg, { Rect } from "react-native-svg";
import * as ImagePicker from 'expo-image-picker';
import { Chip } from 'react-native-paper';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import {Picker} from '@react-native-picker/picker';

//Icons import
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";


/* 
  - Cuando cambiamos la imagen de perfil de un usuario, ese cambio no persiste
*/



const MyAccountLoggedIn = ({ navigation }) => {

  const { me } = useSelector((store) => store.user);
  const { categories } = useSelector(store => store.categories)
  const dispatch = useDispatch();
  const [image, setImage] = React.useState(null);
  
  
  console.log("myAccount", me);

  /* React.useEffect(()=>{
    let mounted = true
    if(mounted){
      return console.log(me.categories)
    }
    else return mounted = false

  }, [me.categories]) */
  
  /* React.useEffect(()=>{
    let mounted = true
    if(mounted){
      dispatch(showCategories())
    }
    else return mounted = false
  }, [])

  console.log('ESTO ES CATEGORIES',categories) */



  const placeholder = {
    label: 'Seleccionar...',
    value: null,
  };

  console.log('ESTO ES ME.CATEGORIES', me.categories)


  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Necesitamos permiso para poder acceder a tus fotos');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('esto es la imagen que elegio el usuario-->',result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handlePress = (value) => {
    console.log(value)
    dispatch(addFavCategory(value))
  }

  
  

  return (
    <SafeAreaView>
      <ScrollView>

      
    <View style={styles.container}>
      <Svg height={180} width="100%">
        <Rect x="0" y="0" width="100%" height={180} fill="#23036A" />
      </Svg>

      <Avatar
        size={110}
        rounded
        title={(me.name[0] + me.lastName[0]).toUpperCase()}
        source={
          image
            ? {
                uri: image
              }
            : {uri: 'no-image'}
        }
        containerStyle={styles.avatar}
        placeholderStyle={{backgroundColor: "#D4B5FA"}}
        
      >
        <Avatar.Accessory name="pencil-alt" type="font-awesome-5" size={20} onPress={pickImage}/>
      </Avatar>

      <View style={styles.textContainer}>
        <Text style={styles.textTitle}>
          {me.name} {me.lastName}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.itemsStyle}>
          <MaterialIcons name="alternate-email" size={24} color="#985EFF" />
          <Text style={styles.paragTxt}>{me.email}</Text>
        </View>

        

          <TouchableOpacity style={styles.itemsStyle} onPress={()=>navigation.navigate('Contacts')}>
        
          <AntDesign name="contacts" size={24} color="#985EFF" />
          <Text style={styles.paragTxt}>Contactos</Text>
          <AntDesign name="right" size={18} color="#985EFF" style={{marginLeft:180}}/>
        
          </TouchableOpacity>

          

        <View style={styles.itemsStyle}>
          <Ionicons name="list-outline" size={24} color="#985EFF" />
            <Text style={styles.paragTxt}>Categorias</Text>
        </View>

        <View style={{backgroundColor:'blue', width:300, flexDirection:'row', flexWrap:'wrap', justifyContent:'center'}}>
        {categories.map(category => (
          <View style={{backgroundColor:'red', width:120}}>
            <Chip 
            key={category.id} 
            icon="check" 
            onPress={() => handlePress(category.id)}
            >
              {category.type}
            </Chip>
          </View>

            ))}
            </View>


       

        


        {/* <View style={{backgroundColor:'red'}}>
          {me.categories.length > 0 ?
          
          (
            me.categories.map(category => (
              <View key={category}>
                <Text>{category}</Text>
              </View>
            ))
          )

          :

          (
            <View>
              <Text>No hay categorias favoritas</Text>
            </View>
          )

          }
        </View> */}
        
        
        
        

        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            style={styles.btnStyle}
            onPress={() => dispatch(logoutUser())}
          >
            <Text style={styles.btnTxt}>Cerrar sesion</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>

    </ScrollView>
    </SafeAreaView>
  );
};

export default MyAccountLoggedIn;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
  },
  avatar: {
    position: "absolute",
    transform: [{ translateY: 15 }],
  },
  textTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
  },
  textContainer: {
    position: "absolute",
    transform: [{ translateY: 138 }],
  },
  btnStyle: {
    backgroundColor: "#23036A",
    padding: 7,
    borderRadius: 20,
    width: 150,
    marginTop: 20,
    marginBottom: 10,
  },
  btnTxt: {
    fontFamily: "Poppins_300Light",
    color: "#fff",
    textAlign: "center",
  },
  paragTxt: {
    fontFamily: "Poppins_300Light",
    fontSize: 13,
    color: "#23036A",
    marginLeft: 15,
  },
  infoContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  itemsStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: 300,
    marginBottom: 10,
  },
});


