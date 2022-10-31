import React, { useState, useEffect } from 'react';
import { format, startOfSecond } from "date-fns";
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Calendar } from "react-native-calendars";
import { TextInput, Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const stars = [[1], [1, 1], [1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1, 1]]
let tempValue;
let tempDate;

function AddReview({ navigation, route }) {

    const reviewCenter = route.params.reviewedCenter;

    const [myValue, setMyValue] = useState(1);

    const [countStars, setCountStars] = useState(stars[0]);

    function setRateValues(value) {
        setMyValue(value);
        tempValue = value;
        setCountStars(stars[value - 1]);
    }

    const [text, setText] = React.useState("");

    const posts = [];
    const markedDates = posts.reduce((acc, current) => {
        const curr = new Date();
        const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        const today = new Date(utc + (KR_TIME_DIFF));
        const formattedDate = format(new Date(today), 'yyyy-MM-dd');
        acc[formattedDate] = { marked: true };
        return acc;
    }, {});

    const [selectedDate, setSelectedDate] = useState(
        format(new Date(), "yyyy-MM-dd"),
    );
    const markedSelectedDates = {
        ...markedDates,
        [selectedDate]: {
            selected: true,
            marked: markedDates[selectedDate]?.marked,
        }
    }

    const [maximumDate, setMaximumDate] = useState("");

    function calMaximumDate() {
        const curr = new Date();
        const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        const today = new Date(utc + (KR_TIME_DIFF));

        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);
        tempDate = year + '-' + month + '-' + day;
        setMaximumDate(tempDate);
    }

    useEffect(() => {
        calMaximumDate()
    }, [])

    async function addReview() {
        let user_id;
        let user_name;

        // 현재 유저 정보 가져오기
        auth().onAuthStateChanged(user => {
            if (user) {
                user_id = user.uid;
                user_name = user.displayName;
            }
        });
        // review_id 생성 및 중복 확인
        let review_id = Math.random().toString(36).substring(2, 16);
        let doc;
        do {
            const ref = firestore().collection('Review').doc(review_id);
            doc = await ref.get();
            review_id = Math.random().toString(36).substring(2, 16);
        } while (doc.exists);

        // 오늘 날짜 가져와 포맷에 맞게 편집
        const curr = new Date();
        const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        const today = new Date(utc + (KR_TIME_DIFF));

        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const day = ('0' + today.getDate()).slice(-2);
        const now_date = year + '-' + month + '-' + day;
        
        setMyValue(tempValue);

        let review = {
            review_id: review_id,
            user_id: user_id,
            user_name: user_name,
            center_id: reviewCenter.id,
            center_name: reviewCenter.name,
            used_date: selectedDate,
            posted_date: now_date,
            rate: myValue,
            feedback: text,
        };

        firestore().collection('Review').doc(review_id).set(review);

        navigation.navigate('CenterInfo2', {selectedCenter : reviewCenter})
    }

    return (
        <View style={{ backgroundColor: 'white' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 0, paddingTop: 20, paddingBottom: 15, backgroundColor: '#FFDA36' }}>
                    <Text style={{ fontFamily: 'NanumSquare', fontSize: 20, color: '#4E4E4E', marginBottom: 10 }}>후기 작성</Text>
                    <Text style={{ fontFamily: 'NanumSquare_0', fontSize: 13, color: '#4E4E4E' }}>{reviewCenter.name}</Text>
                </View>
                <View>
                    <Text style={styles.textDesign}>이용 일자를 입력해주세요.</Text>
                    <View>
                        <Calendar
                            style={{ marginTop: 10, padding: 10 }}
                            onDayPress={(day) => {
                                setSelectedDate(day.dateString);
                            }}
                            monthFormat={'yyyy-MM'}
                            onMonthChange={month => {
                                console.log('month changed', month);
                            }}
                            maxDate={maximumDate}
                            firstDay={1}
                            onPressArrowLeft={subtractMonth => subtractMonth()}
                            onPressArrowRight={addMonth => addMonth()}
                            enableSwipeMonths={true}
                            markedDates={markedSelectedDates}
                            theme={{
                                selectedDayBackgroundColor: '#FFB236',
                                arrowColor: '#FFDA36',
                                todayTextColor: '#FFB236',
                            }}
                        />
                    </View>
                </View>
                <View>
                    <Text style={styles.textDesign}>
                        평점을 매겨주세요.
                    </Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            {countStars.map((item, idx) => {
                                return (
                                    <FontAwesome name="star" color='#FFC021' size={25} style={{ marginLeft: 5, marginRight: 5 }} key={idx} />
                                )
                            })}

                        </View>
                        <Slider
                            style={{ height: 40, width: 250 }}
                            thumbTintColor="#FFB236"
                            minimumTrackTintColor='#FFB236'
                            value={myValue}
                            onValueChange={(value) => setRateValues(value)}
                            minimumValue={1}
                            maximumValue={5}
                            step={1}
                        />
                        <Text style={{ fontWeight: 'bold' }}>1            2             3             4            5</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.textDesign}>후기 내용을 작성해주세요.</Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            value={text}
                            onChangeText={text => setText(text)}
                            mode="outlined"
                            placeholder='여기에 후기를 작성해주세요!'
                            activeOutlineColor='#FFB236'
                            outlineColor='white'
                            multiline={true}
                            style={{ width: 380, height: 380, fontFamily: 'NanumSquare_0', marginTop: -10 }}
                        />
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                    {text == "" ? (
                        <Button mode="contained" onPress={() => addReview()} style={{ width: 130, backgroundColor: "#FFDA36" }} disabled={true}>
                            <Text style={{ fontFamily: 'NanumSquare_0' }}>완료</Text>
                        </Button>
                    ) : (
                        <Button mode="contained" onPress={() => addReview()} style={{ width: 130, backgroundColor: "#FFDA36" }}>
                            <Text style={{ fontFamily: 'NanumSquare_0' }}>완료</Text>
                        </Button>
                    )}

                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    textDesign: {
        marginTop: 25,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 15,
        paddingBottom: 10,
        color: "black",
        fontFamily: 'NanumSquare_0',
        borderBottomWidth: 1,
        borderBottomColor: '#DDD',
    }

});

export default AddReview;
