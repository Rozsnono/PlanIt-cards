export interface Icard{
    name: string;
    rank: number;
    suit: string;
    isJoker?: boolean;
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
        [date: string]: {wins: number, losses: number};
    };
    auth: string[];
    friends: string[];
    peddingFriends: string[] | number;
    customId: string;
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
    bots: {_id: string, name: string}[];
    mutedPlayers: string[];
    settings: {
        numberOfPlayers: number;
        robberRummy: boolean;
        privateLobby: boolean;
        lobbyCode?: string | null;
        unranked: boolean;
        fillWithRobots: boolean;
        numberOfRobots?: number | null;
        cardType: "UNO" | "RUMMY";
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
    playerCards: {[player_id: string]: Icard[]};
    playedCards: Icard[][];
    droppedCards: Icard[];
}
