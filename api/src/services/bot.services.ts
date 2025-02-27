
export default class Bot {
    private rummyBotNames = {
        'EASY': {
            first: ["Cardy", "Dealy", "Robo", "Acey", "Meldy", "Drawy", "Decko", "Handy", "Ginny"],
        },
        'MEDIUM': {
            first: ["Shuffo", "Genie", "Husty", "Dexy", "Dyno", "Pal", "Jokey", "Melds", "Playo"],
        },
        'HARD': {
            first: ["Crafty", "Master", "Daemon", "Juggly", "Ranger", "Tactic", "Tricky", "Acey", "Whizy"],
        }
    };




    constructor() {

    }

    getRobotName(difficulty: 'EASY' | 'MEDIUM' | 'HARD', number: number) {
        console.log(difficulty, number);
        const name = this.rummyBotNames[difficulty].first[number];
        return `${name}`;
    }

    getRobotDifficultyFromName(name: string) {
        for (let i = 0; i < 3; i++) {
            if (this.rummyBotNames[Object.keys(this.rummyBotNames)[i] as 'EASY' | 'MEDIUM' | 'HARD'].first.includes(name)) {
                return Object.keys(this.rummyBotNames)[i];
            }
        }

        return Object.keys(this.rummyBotNames)[0];

    }

}