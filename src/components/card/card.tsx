import { StyleSheet } from "react-native";
import { View } from "react-native-animatable";
import { useWindowDimensions } from "react-native";


const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;

type CardProps = {
    title: String
    
}

const Card: React.FC<CardProps> = ({
    title,
}) => {
    return (
        <View style={ isLargeScreen ? [style.cardContainerMobile] : [style.cardContainerWeb] }>
            
        </View>
    );
}

const style = StyleSheet.create({
    cardContainerMobile: {

    },
    cardContainerWeb: {

    }
});