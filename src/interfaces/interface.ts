export interface Icard {
    name: string;
    rank: number;
    suit: string;
    isJoker?: boolean;
    value?: number;
    pack: number;
    showedBy?: string | null;
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
    gameInvites: {
        _id: string;
        gameId: string;
        gameType: "UNO" | "RUMMY" | "SOLITAIRE";
        invitedBy: any;
        lobbyCode?: string | null;
    }[];
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
    bots: { _id: string, name: string, customId: string }[];
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
        cardType: "UNO" | "RUMMY" | "SOLITAIRE" | "SCHNAPPS";
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
    currentPlayer: { playerId: string, time: number };
    playerCards: { [player_id: string]: Icard[] };
    playedCards: { playedBy: string, cards: Icard[] }[];
    drawedCard: { lastDrawedBy: string };
    droppedCards: { droppedBy: string, card: Icard }[];
    lastAction: {
        playerId: string;
        actions: number;
        isUno?: boolean;
        trump?: { suit: string, card: string } | null;
        trumpWith?: string | null;
        points?: { [playerId: string]: number };
    },
    secretSettings: {
        timeLimit: number;
        gameType: string,
        robotDifficulty: string,
        isGameOver: boolean,
        gameTurn: number,
        maxGameTurns: number,
        currentTurn: number,
        pointsByTurns?: { [turn: number]: { [playerId: string]: number } }
    },
    allCards: { [playerId: string]: number };
}
