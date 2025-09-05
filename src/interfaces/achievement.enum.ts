export const achievements = [
    {
        "_id": "MG01",
        "image": "/assets/achievements/MG.png",
        "name": "Master of Groups",
        "description": "Win the game by only laying down sets (same value achievements of different suits).",
        "check": function (playedCards: any[][]) {
            let isMaster = true;
            playedCards.forEach((cards) => {
                if (cards.length) {
                    const values = cards.map((card) => card.value);
                    const uniqueValues = [...new Set(values)];
                    if (uniqueValues.length !== 1) {
                        isMaster = false;
                    }
                }
            });
            return isMaster;
        }
    },
    {
        "_id": "SR02",
        "image": "/assets/achievements/SR.png",
        "name": "Speed Runner",
        "description": "Finish the game in three rounds or less!",
        "check": function (numberOfRounds: number) {
            return numberOfRounds <= 3;
        }
    },
    {
        "_id": "SL03",
        "image": "/assets/achievements/SL.png",
        "name": "Master of Sequences",
        "description": "Win the game by only laying down sequences (same suit achievements of consecutive values).",
        "check": function (playedCards: any[][]) {
            let isMaster = true;
            playedCards.forEach((cards) => {
                if (cards.length) {
                    const values = cards.map((card) => card.value);
                    const uniqueValues = [...new Set(values)];
                    if (uniqueValues.length !== cards.length) {
                        isMaster = false;
                    }
                }
            });
            return isMaster;
        },
    },
    {
        "_id": "FS04",
        "image": "/assets/achievements/FS.png",
        "name": "First Strike",
        "description": "Lay down a combination on the table in the very first round.",
        "check": function (playedCards: any) {
            return playedCards.length > 0;
        }
    },
    {
        "_id": "WJ05",
        "image": "/assets/achievements/WJ.png",
        "name": "Without any Joker",
        "description": "Win a game without using any joker.",
        "check": function (playedCards: any[][]) {
            let isWithoutJoker = true;
            playedCards.forEach((cards) => {
                if (cards.length) {
                    const joker = cards.find((card) => card.isJoker);
                    if (joker) {
                        isWithoutJoker = false;
                    }
                }
            });
            return isWithoutJoker;
        }
    }

];
