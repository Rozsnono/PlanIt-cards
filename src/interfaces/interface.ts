export interface Icard{
    name: string;
    rank: number;
    suit: string;
    isJoker?: boolean;
}

export interface Iplayer {
    _id: string;
    name: string;
    rank: number;
}

export interface Ilobby {
    _id: string;
    players: Iplayer[];
    mutedPlayers: string[];
    settings: {
        numberOfPlayers: number;
        robberRummy: boolean;
        privateLobby: boolean;
        lobbyCode?: string | null;
        unranked: boolean;
        fillWithRobots: boolean;
        numberOfRobots?: number | null;
        type: "UNO" | "RUMMY";
    }
    chat: Imessage[];
    game_id?: string;
}

export interface Imessage {
    message: string;
    sender: string;
    time: string;
    type: string;
}

export interface Igame {
    _id: string;
    deck: Icard[];
    currentPlayer: string;
    playerCards: {[player_id: string]: Icard[]};
    playedCards: Icard[][];
    droppedCards: Icard[];
}
