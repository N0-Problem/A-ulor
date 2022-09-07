import React, { useState } from 'react';
import { format } from "date-fns";
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Calendar } from "react-native-calendars";
import { TextInput, Button } from 'react-native-paper';

const stars = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]


function AddReview({ route }) {

    const reviewCenter = route.params;

    const [myValue, setMyValue] = useState(0);

    const [text, setText] = React.useState("");

    const posts = [];
    const markedDates = posts.reduce((acc, current) => {
        const formattedDate = format(new Date(current.date), 'yyyy-MM-dd');
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

    return (
        <View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                    <Text style={{ fontFamily: 'NanumSquare', fontSize: 17, color: 'black' }}>{reviewCenter.selectedCenter}</Text>
                </View>
                <View>
                    <Text style={styles.textDesign}>이용 일자를 입력해주세요.</Text>
                    <View>
                        <Calendar
                            style={{ marginTop: 20, padding: 10 }}
                            onDayPress={(day) => {
                                setSelectedDate(day.dateString);
                                console.log(day.dateString)
                            }}
                            monthFormat={'yyyy MM'}
                            onMonthChange={month => {
                                console.log('month changed', month);
                            }}

                            firstDay={1}
                            onPressArrowLeft={subtractMonth => subtractMonth()}
                            onPressArrowRight={addMonth => addMonth()}
                            enableSwipeMonths={true}
                            markedDates={markedSelectedDates}
                            theme={{
                                selectedDayBackgroundColor: '#FFB236',
                                arrowColor: '#FFDA36',
                                //   dotColor: '#009688',
                                todayTextColor: '#FFB236',
                            }}
                        />
                    </View>
                </View>
                <View>
                    <Text style={styles.textDesign}>
                        평점을 매겨주세요.
                    </Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text> {stars[myValue - 1]} </Text>
                        <Slider
                            style={{ height: 40, width: 250 }}
                            thumbTintColor="#FFB236"
                            minimumTrackTintColor='#FFB236'
                            value={myValue}
                            onValueChange={(value) => setMyValue(value)}
                            minimumValue={1}
                            maximumValue={5}
                            step={1}
                        />
                        <Text style={{ fontWeight: 'bold' }}>1            2             3             4            5</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.textDesign}>후기 내용을 작성해주세요.</Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            value={text}
                            onChangeText={text => setText(text)}
                            mode="outlined"
                            placeholder='여기에 후기를 작성해주세요!'
                            activeOutlineColor='#FFB236'
                            multiline={true}
                            style={{ width: 380, height: 380, fontFamily: 'NanumSquare_0', }}
                        />
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                    <Button mode="contained" onPress={() => console.log('Pressed')} style={{ width: 130, backgroundColor: "#FFB236" }}>
                        <Text style={{ fontFamily: 'NanumSquare_0' }}>완료</Text>
                    </Button>
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
        marginTop: 30,
        marginLeft: 10,
        color: "black",
        fontFamily: 'NanumSquare_0',
    }

});

export default AddReview;
