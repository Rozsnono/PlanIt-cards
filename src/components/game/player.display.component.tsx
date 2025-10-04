"use client";
import { Igame, Ilobby, Iplayer } from "@/interfaces/interface";
import React from "react";
import GameUser, { GameBot } from "../user/game.user.component";
export default function PlayerDisplay({ lobby, game, user, isDisplay = false }: { lobby: Ilobby; game: Igame; user: Iplayer | null; isDisplay?: boolean }) {

    function getUsers() {
        const userCount = (lobby?.users.length || 0) + (lobby?.bots.length || 0);
        const userIndex = Object.keys(game.allCards).indexOf(user!._id) + userCount;
        const users = [...(lobby?.users || []), ...(lobby?.bots || []), ...(lobby?.users || []), ...(lobby?.bots || []), ...(lobby?.users || []), ...(lobby?.bots || [])];
        if (!isDisplay) {
            return { before: users.slice(userIndex - userCount / 2, userIndex), after: users.slice(userIndex + 1, userIndex + userCount / 2) };
        }
        return { before: users.slice(userIndex - userCount / 2, userIndex), after: users.slice(userIndex, userIndex + userCount / 2) };
    }

    return (
        <React.Fragment>
            <div className="absolute top-0 left-2 h-full flex flex-col justify-between items-center">
                <div></div>
                {
                    getUsers().after.map((user, j) => {
                        if (user._id.includes('bot')) {
                            return (
                                <GameBot key={j} bot={user} currentPlayer={game.currentPlayer.playerId} cardNumber={game.allCards[user.customId.replace('-', '')]}></GameBot>
                            )
                        }
                        return (
                            <GameUser key={j} user={user as any} currentPlayer={game.currentPlayer.playerId} cardNumber={game.allCards[user._id]}></GameUser>
                        )
                    })
                }
                <div></div>
            </div>

            <div className="absolute top-0 right-2 h-full flex flex-col justify-between items-center">
                <div></div>
                {
                    getUsers().before.reverse().map((user, j) => {
                        if (user._id.includes('bot')) {
                            return (
                                <GameBot key={j} bot={user} currentPlayer={game.currentPlayer.playerId} cardNumber={game.allCards[user.customId.replace('-', '')]}></GameBot>
                            )
                        }
                        return (
                            <GameUser key={j} user={user as any} currentPlayer={game.currentPlayer.playerId} cardNumber={game.allCards[user._id]}></GameUser>
                        )
                    })
                }
                <div></div>
            </div>

        </React.Fragment>
    )

}