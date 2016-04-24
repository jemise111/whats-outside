import React, {
  AppRegistry,
  ActivityIndicatorIOS,
  Component,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  ProgressBarAndroid,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

const data = [
  {
    name: 'Space Station',
    text: 'Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff'
  },
  {
    name: 'Weather Forecast',
    text: 'Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff'
  },
  {
    name: 'Asteroid Prediction',
    text: 'Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff'
  },
  {
    name: 'Special Report',
    text: 'Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff Lorem Ipsum Space Stuff'
  },
]

const colors = ['rgb(0,210,172)', 'rgb(254,149,0)', 'rgb(0,179,234)', 'rgb(255,212,0)'];

class Mobile extends Component {
  constructor(props) {
    super(props);
    StatusBar.setHidden(true);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    fetch('http://localhost:3000')
    .then((response) => response.json())
    .then((json) => {
      this.setState({data: json});
    })
    .catch((error) => {
      console.log('There was an error', error);
    });
  }

  render() {
    if (!this.state.data) {
      const Loader = Platform.OS === 'ios' ? ActivityIndicatorIOS : ProgressBarAndroid;
      return (
        <View style={styles.noResultsContainer}>
          <Loader />
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollView}>
        <Image
          source={{uri: 'http://www.ilikewallpaper.net/iphone-5-wallpapers/download/20206/Spiral-Galaxy-World-iphone-5-wallpaper-ilikewallpaper_com.jpg'}}
          style={{
            height: 400,
            width: Dimensions.get('window').width
          }}
        >
          <View style={styles.header}>
            <Text style={styles.headerText}>Star Gazer</Text>
            <Text style={styles.dateText}>April 24</Text>
          </View>
        </Image>
        <View style={styles.diagonal} />
        {
          this.state.data.map( (d, i) => (
            <View key={i} style={styles.contentContainer}>
              <View style={styles.row}>
                <View style={[styles.numberContainer, {borderColor: colors[i]}]}>
                  <Text style={[styles.numberText, {color: colors[i]}]}>{i}</Text>
                </View>
                <Text style={[styles.contentHeaderText, {color: colors[i]}]}>{d.name}</Text>
              </View>
              <View style={styles.bodyContainer}>
                <Text style={styles.bodyText}>
                  {d.text}
                </Text>
              </View>
            </View>
          ))
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0)'
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Gill Sans',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  dateText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Gill Sans',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  diagonal: {
    backgroundColor: 'black',
    height: 50,
    width: Dimensions.get('window').width + 20,

    transform: [
      {rotateZ: '7deg'},
      {translateY: -25},
      {translateX: -20}
    ],
    marginBottom: -50
  },
  scrollView: {
    backgroundColor: 'black'
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  contentContainer: {
    padding: 20,
    paddingLeft: 30,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#333'
  },
  numberContainer: {
    height: 30,
    width: 30,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  numberText: {
    color: 'green'
  },
  contentHeaderText: {
    color: 'green',
    fontSize: 18,
    fontFamily: 'Gill Sans',
  },
  bodyContainer: {
    marginTop: 20,
  },
  bodyText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Gill Sans',
  }

});

AppRegistry.registerComponent('mobile', () => Mobile);
