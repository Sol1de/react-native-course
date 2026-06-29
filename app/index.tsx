import {
    Text,
    View,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback, Keyboard, Button
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Home screen</Text>
        <View style={styles.subContainer}>
            <Text style={styles.subTitle}>This is my image</Text>
            <Image style={styles.displayImage} source={require("../assets/images/react-logo.png")}></Image>
        </View>

        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <Text style={styles.header}>Header</Text>
                    <TextInput placeholder="Username" style={styles.textInput} />
                    <View style={styles.btnContainer}>
                        <Button title="Submit" onPress={() => null} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
    },
    subTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#922dba"
    },
    displayImage: {
        width: 200,
        height: 200,
    },
    keyboardContainer: {
        flex: 1,
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "space-around",
    },
    header: {
        fontSize: 36,
        marginBottom: 48,
    },
    textInput: {
        height: 40,
        borderColor: "#000000",
        borderBottomWidth: 1,
        marginBottom: 36,
    },
    btnContainer: {
        backgroundColor: "white",
        marginTop: 12,
    },
})
