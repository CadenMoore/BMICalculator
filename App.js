import React, { Component } from 'react';
import { SafeAreaView, Text, ScrollView, TextInput, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const BMIKey = '@bmi:key';
const heightKey = '@height:key';

export default class App extends Component {
  state = {
    height: '',
    weight: '',
    BMI: '',
  }

  constructor(props){
    super(props);
    this.onLoad();
  }

  onLoad = async () => {
    try {
      const BMI = await AsyncStorage.getItem(BMIKey);
      this.setState({ BMI });
      const height = await AsyncStorage.getItem(heightKey);
      this.setState({ height });
    } catch(error){
      //Alert.alert('Error', 'There was an error while loading the data')
    }
  }

  getBMI = async () => {
    const { weight, height } = this.state;

    let numBMI = ((weight / (height * height)) * 703).toFixed(1);
    this.setState({ BMI: numBMI }, () => {
      this.onSave();
    })
  }

  onSave = async () => {
    const { BMI, height } = this.state;
    try {
      await AsyncStorage.setItem(BMIKey, BMI);
      await AsyncStorage.setItem(heightKey, height);
    } catch(error) {
      
    }
  }

  onChangeHeight = (height) => {
    this.setState({height});
  }

  onChangeWeight = (weight) => {
    this.setState({weight});
  }

  render() {
    const { BMI, weight, height } = this.state;

    return(
      <SafeAreaView style={styles.container}>
        <Text style={styles.toolbar}>BMI Calculator</Text>
        <ScrollView style={styles.content}>
          <TextInput 
            style={styles.input}
            onChangeText={this.onChangeWeight}
            value={weight}
            placeholder="Weight in Pounds"
          />
          <TextInput 
            style={styles.input}
            onChangeText={this.onChangeHeight}
            value={height}
            placeholder="Height in Inches"
          />
          <Pressable style={styles.button} onPress={this.getBMI}>
            <Text style={styles.buttonText}>Compute BMI</Text>
          </Pressable>
          <Text style={styles.output}>
          {BMI != '' && BMI != 'null' && BMI != 'NaN' ? 'Body Mass Index is ' + BMI : ''}
          </Text>
          <Text style={styles.assessmentHeader}>
            Assessing Your BMI
          </Text>
          <Text style={styles.assessmentText}>
            Underweight: less than 18.5{"\n"}
            Healthy: 18.5 to 24.9{"\n"}
            Overweight: 25.0 to 29.9{"\n"}
            Obese: 30.0 to higher
          </Text>
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    backgroundColor: '#f4511e',
    color: '#fff',
    textAlign: 'center',
    padding: 25,
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  input: {
    backgroundColor: '#ecf0f1',
    height: 40,
    padding: 5,
    marginBottom: 10,
    fontSize: 24,
  },
  button: {
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 3,
    marginBottom: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
  output: {
    fontSize: 28,
    textAlign: 'center',
  },
  assessmentHeader: {
    marginTop: 100,
    fontSize: 20,
    paddingLeft: 10,
  },
  assessmentText: {
    fontSize: 20,
    paddingLeft: 30,
  }
});
