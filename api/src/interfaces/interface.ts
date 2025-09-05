export interface Icard {
    name: string;
    rank: number;
    suit: string;
    isJoker?: boolean;
    pack: number;
    value: number;
    showedBy?: string;
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
    friends: string[];
    pendingFriends: string[] | number;
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
    bots: { _id: string, name: string }[];
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
    playedCards: Icard[][];
    drawedCard: { lastDrawedBy: string };
    droppedCards: { droppedBy: string, card: Icard }[];
    secretSettings: {
        timeLimit: number,
        gameType: string,
        robotDifficulty: string,
        isGameOver: boolean,
        gameTurn: number,
        maxGameTurns: number,
        currentTurn: number,
        pointsByTurns: any
    }
    lastAction: {
        playerId: string;
        actions: number;
        isUno?: boolean;
        trump?: { suit: string, card: string } | null;
        trumpWith?: string | null;
    }
}
