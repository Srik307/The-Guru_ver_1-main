import JournelView from "./JournelView";
import React,{useState} from "react";
import { View } from "react-native";

const JournelListView = ({data}) => {
    const [show,setShow]=useState(null);
    return (
        <View>
        {Object.keys(data).map((date,ind) => {
            return <JournelView journel={data[date]} date={date} index={ind} show={show} setShow={setShow}/>;
        })}
        </View>
    );
    }

export default JournelListView;