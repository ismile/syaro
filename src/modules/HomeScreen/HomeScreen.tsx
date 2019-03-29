import React, {useState} from 'react';
import { View, Text, Button } from "react-native";

export default function() {
  let [counter, setCounter] = useState(0)

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen {counter}</Text>

      <Button title='add' onPress={()=> {setCounter((counter+1))}} />
    </View>
  );
}
