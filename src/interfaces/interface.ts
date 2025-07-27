export interface Icard {
    name: string;
    rank: number;
    suit: string;
    isJoker?: boolean;
    value?: number;
    pack: number;
}

export interface Iplayer {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    rank: number;
    numberOfGames: {
        [date: string]: { wins: number, losses: number };
    };
    auth: string[];
    friends: string[];
    pendingFriends: any[] | number;
    customId: string;
    settings: {
        backgroundColor: string;
        textColor: string;
        hasPicture: boolean,
        selectedPicture: string,
        borderWidth?: number,
        borderColor?: string,
        hidden?: boolean,
        canInvite?: boolean,
    };
    gameHistory: {
        [date: string]: {
            playerCards: Icard[],
            playedCards: Icard[][],
            droppedCards: Icard[]
        }
    };
}

export interface Ilobby {
    _id: string;
    users: Iplayer[];
    bots: { _id: string, name: string }[];
    mutedPlayers: string[];
    settings: {
        numberOfPlayers: number;
        robberRummy: boolean;
        privateLobby: boolean;
        lobbyCode?: string | null;
        unranked: boolean;
        fillWithRobots: boolean;
        numberOfRobots?: number | null;
        robotsDifficulty?: "EASY" | "MEDIUM" | "HARD";
        cardType: "UNO" | "RUMMY" | "SOLITAIRE";
    }
    chat: Imessage[];
    game_id?: string;
    createdBy: string;
}

export interface Imessage {
    message: string;
    sender: string;
    time: string;
    type: string;
}

export interface Igame {
    _id: string;
    shuffledCards: Icard[];
    currentPlayer: string;
    playerCards: { [player_id: string]: Icard[] };
    playedCards: { playedBy: string, cards: Icard[] }[];
    droppedCards: { droppedBy: string, card: Icard }[];
}
