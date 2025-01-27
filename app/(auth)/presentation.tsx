import {View, Text, Image} from 'react-native'

export default function Presentation() {
    return (
        <View>
            <Image style={{width: 200, height:200}} source={require('~/assets/girlHeart.png')} />
        </View>
    )
}
