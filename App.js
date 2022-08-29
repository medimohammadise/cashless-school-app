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
  Platform,
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

// function displayNotification(title, message) {
//   PushNotification.createChannel(
//     {
//       channelId: 'special_id', // (required)
//       channelName: 'Special message', // (required)
//       channelDescription: 'Notification for special message', // (optional) default: undefined.
//       importance: 4, // (optional) default: 4. Int value of the Android notification importance
//       vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
//     },
//     created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
//   );
//   PushNotification.localNotification({
//     channelId: 'special_id', //his must be same with channel id in create channel
//     title,
//     message,
//   });
// }
// Please place this code in App.js,
// After the import statements, and before the Component class

// Enable in-app notification banners (iOS 10+)
Pushy.toggleInAppBanner(true);

Pushy.setNotificationListener(async data => {
  console.log('Received notification: ', data);
  let notificationTitle = data.title || 'Title';
  let notificationText = data.message || 'Test notification';
  let notificationCategory = data.category;

  if (notificationCategory === 'PIN_CODE') {
    Pushy.notify('Private Message', 'You have a private message', data);
  } else if (notificationCategory === 'CONFIRMATION') {
    Pushy.notify('Confirmation', 'We need your confirmation', data);
  } else {
    Pushy.notify(notificationTitle, notificationText, data);
  }
});
Pushy.setNotificationClickListener(async clickedData => {
  console.log('Clicked=============', clickedData);
  if (clickedData?.category === 'PIN_CODE') {
    Alert.alert(`Heare is your PIN code: ${clickedData?.pincode}`);
  } else if (clickedData?.category === 'CONFIRMATION') {
    Alert.alert('Private', 'Your daughter want to pay for pizza, is it okay?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
  }
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
    Pushy.listen();

    // Register the device for push notifications
    Pushy.register()
      .then(async deviceToken => {
        // Write device token to device logs
        console.log('Pushy device token: ' + deviceToken);

        // Send the token to your backend server via an HTTP GET request
        //await fetch('https://your.api.hostname/register/device?token=' + deviceToken);

        // Succeeded, optionally do something to alert the user
      })
      .catch(err => {
        // Update UI

        // Handle registration errors
        console.error(err);
      });

    // Android-only code
    if (Platform.OS === 'android') {
      // Set system status bar color
      StatusBar.setBackgroundColor('#000000');
    }

    // Light system status bar text
    StatusBar.setBarStyle('light-content', true);
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
