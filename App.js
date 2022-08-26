import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Pushy from 'pushy-react-native';
import PushNotification from 'react-native-push-notification';
function displayNotification(title, message) {
  PushNotification.createChannel(
    {
      channelId: 'special_id', // (required)
      channelName: 'Special message', // (required)
      channelDescription: 'Notification for special message', // (optional) default: undefined.
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
  PushNotification.localNotification({
    channelId: 'special_id', //his must be same with channel id in create channel
    title,
    message,
  });
}
// Please place this code in App.js,
// After the import statements, and before the Component class

// Enable in-app notification banners (iOS 10+)
Pushy.toggleInAppBanner(true);

Pushy.setNotificationListener(async data => {
  console.log('Received notification: ', data);
  Alert.alert(data.message);
  let notificationTitle = data.title || 'Title';
  let notificationText = data.message || 'Test notification';

  displayNotification(notificationTitle, notificationText);

  Pushy.setNotificationClickListener(async clickedData => {
    // Display basic alert
    Alert.alert('Notification click: ' + clickedData.message);

    // Navigate the user to another page or
    // execute other logic on notification click
  });
});

const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Register the user for push notifications
    Pushy.register()
      .then(async deviceToken => {
        // Display an alert with device token
        console.log('Device Token: ', deviceToken);
        // Send the token to your backend server via an HTTP GET request
        //await fetch('https://your.api.hostname/register/device?token=' + deviceToken);

        // Succeeded, optionally do something to alert the user
      })
      .catch(err => {
        // Handle registration errors
        console.error(err);
      });
  }, []);

  useEffect(() => {
    Pushy.listen();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
