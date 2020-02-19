import Dictionary from "../interface/Dictionary"
import { CharacterData } from "../interface/RoomData"

const CharacterData: Dictionary<CharacterData> = {
    1: {
        code: 1,
        name: "엘리",
        description: "귀여운 엘리<br/>별똥별로 광역 공격을 한다.",
        preview: "idle.gif"
    },
    2: {
        code: 2,
        name: "다이노",
        description: "매서운 다이노<br/>빠른 파이어볼 공격을 한다.",
        preview: "idle.gif"
    },
};

export default CharacterData;