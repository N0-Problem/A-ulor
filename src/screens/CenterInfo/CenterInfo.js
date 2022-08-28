import React from 'react'
import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';

function CenterInfo() {
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View>
                    <Card style={styles.cardDesign}>
                        <Card.Content style={{ justifyContent: 'center', alignItems: 'center', flexDirection: "row" }}>
                            <Text style={styles.titleDesign}>🏬</Text>
                            <Title style={styles.titleDesign}>의정부시시설관리공단 이동지원센터</Title>
                            <Text style={styles.titleDesign}>🏬</Text>
                        </Card.Content>
                        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                        <View style={styles.paragraphDesign}>
                            <Text style={styles.textDesign}>주소 : </Text>
                        </View>
                        <View style={styles.paragraphDesign}>
                            <Text style={styles.textDesign}>전화번호 : </Text>
                            <Text>
                                <Pressable>
                                    {({ pressed }) => (
                                        <Text style={{ color: pressed ? '#000000' : '#999999' }}
                                        >
                                            123-4567
                                        </Text>
                                    )}
                                </Pressable>
                            </Text>
                        </View>
                        <View style={styles.paragraphDesign}>
                            <Text style={styles.textDesign}>예약가능시간 : </Text>
                        </View>
                        <View style={styles.paragraphDesign}>
                            <Text style={styles.textDesign}>운행시간 : </Text>
                        </View>
                        <View style={styles.paragraphDesign}><Text style={styles.textDesign}>...</Text></View>
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', }}>
                            {/* <Button style={styles.buttonDesign} mode="text" color="#FFB236" onPress={() => console.log("1 pressed!")}>
                                전화하기
                            </Button> */}
                            <Button style={styles.buttonDesign} mode="text" color="#FFB236" onPress={() => console.log("2 pressed!")}>
                                예약하러 하기
                            </Button>
                            <Button style={styles.buttonDesign} mode="text" color="#FFB236" onPress={() => console.log("3 pressed!")}>
                                후기 작성
                            </Button>
                        </View>
                    </Card>
                </View>
                <View>
                    <View style={{ marginLeft: 10, marginBottom: 5, marginTop: 15 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 25, color: "black" }}>후기</Text>
                    </View>
                    <View style={styles.reviewDesign}>
                        <View style={{ flexDirection: "row", marginBottom: 5 }}>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ textAlign: "left" }}>⭐⭐⭐⭐⭐</Text>
                            </View>
                            <View>
                                <Text style={{ marginLeft: 140, fontSize: 13 }}>이용 일자 : 2022-08-24</Text>
                            </View>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ marginLeft: 10, fontSize: 13 }}>김아무개</Text>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ marginLeft: 10, fontWeight: "bold", color: "black" }}>
                                리뷰 내용
                            </Text>
                        </View>
                        <View>
                            <Text style={{ textAlign: "right", marginRight: 10, fontSize: 13 }}>작성 일자 : 2022-08-26</Text>
                        </View>
                    </View>
                    <View style={styles.reviewDesign}>
                        <View style={{ flexDirection: "row", marginBottom: 5 }}>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ textAlign: "left" }}>⭐⭐⭐⭐⭐</Text>
                            </View>
                            <View>
                                <Text style={{ marginLeft: 140, fontSize: 13 }}>이용 일자 : 2022-08-24</Text>
                            </View>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ marginLeft: 10, fontSize: 13 }}>김아무개</Text>
                        </View>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ marginLeft: 10, fontWeight: "bold", color: "black" }}>
                                리뷰 내용
                            </Text>
                        </View>
                        <View>
                            <Text style={{ textAlign: "right", marginRight: 10, fontSize: 13 }}>작성 일자 : 2022-08-26</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    cardDesign: {
        width: 380,
        marginTop: 15,
        padding: 20
    },

    titleDesign: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: -10,
        marginBottom: 10
    },

    paragraphDesign: {
        marginTop: 15,
        flexDirection: 'row'
    },

    textDesign: {
        color: "black"
    },

    buttonDesign: {
        marginBottom: 10
    },

    reviewDesign: {
        borderRadius: 10,
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: "#FFB236",
        marginTop: 10,
        width: 380
    }

});

export default CenterInfo
