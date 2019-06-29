import { createAppContainer, createStackNavigator } from "react-navigation";
import BooruGallery from './BooruGallery';
import BooruImage from './BooruImage';
import BooruInfo from './BooruInfo';
import BooruMenu from './BooruMenu';

const BooruNavigator = createStackNavigator({
  Gallery: {
    screen: BooruGallery
  },
  Image: {
    screen: BooruImage
  },
  Info: {
    screen: BooruInfo
  },
  Menu: {
    screen: BooruMenu
  }
},{
  defaultNavigationOptions: {
    header: () => null,
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    }
  }
});

export default createAppContainer(BooruNavigator);
