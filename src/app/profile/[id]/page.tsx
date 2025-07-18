"use client";
import Icon from "@/assets/icons";
import Chart, { LineChart } from "@/components/chart";
import { getColorByInitials, getUserInitials } from "@/functions/user.function";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "react-query";
import Image from "next/image";
import { getCurrentRank, getRankName } from "@/interfaces/rank.enum";
import Pagination from "@/components/pagination";
import React, { useContext } from "react";
import { achievements } from "@/interfaces/achievement.enum";
import ProfileService from "@/services/profile.service";
import { UserContext } from "@/contexts/user.context";
import { GameHistoryService } from "@/services/game.history.service";
import Link from "next/link";
import Loader from "@/components/loader.component";
import Loading from "@/app/loading";

// export function ProfilePage2() {

//     const player_id = useParams().id;

//     const [page, setPage] = React.useState(1);

//     const { user } = useContext(UserContext);
//     const profileService = new ProfileService();
//     const gameHistoryService = new GameHistoryService();

//     function getPlayer() {
//         return profileService.getProfileData(player_id as string).then(res => res.json());
//     }

//     const player = useQuery("player", getPlayer, { enabled: !!player_id, refetchOnWindowFocus: false });

//     const GameHistory = useQuery("gameHistory", async () => { return gameHistoryService.getGameHistoryByUser(player_id as string) }, { enabled: !!player_id, refetchOnWindowFocus: false });


//     if (player.isLoading || player!.data.length == 0) return <Loader></Loader>
//     if (!user) return <div className="text-zinc-400 text-center w-full h-full flex items-center justify-center">Please login to see this page</div>
//     return (
//         <main className="flex gap-2 p-4 h-full">
//             <main className="w-full flex flex-col gap-3 items-center justify-start border-2 rounded-lg border-zinc-500">
//                 <div className="h-fit w-full p-2">
//                     {
//                         player.data.gamesStats.numberOfGames &&
//                         <Chart data={{ wins: Object.values(player.data.gamesStats.numberOfGames).map((c: any) => c.wins).reduce((acc, num) => acc + num, 0), loses: Object.values(player.data.gamesStats.numberOfGames).map((c: any) => c.losses).reduce((acc, num) => acc + num, 0) }}></Chart>
//                     }
//                 </div>
//                 <div className="text-xl p-2 flex gap-2 items-center text-zinc-100">
//                     Replays
//                 </div>
//                 <div className="w-full gap-2 flex flex-col h-full p-2">
//                     {!GameHistory.isLoading && GameHistory.data.length > 0 && GameHistory.data.map((game: any, i: number) => {
//                         return (
//                             <GameReplays link={`/games/${game.lobbyId}/${game.gameId}/${game.type ? game.type.toLowerCase() : ''}/replay`} key={i} pos={game.position.find((p: any) => p.player = user._id)} type={game.type} date={game.date}></GameReplays>
//                         )
//                     })}
//                     {
//                         !GameHistory.isLoading && GameHistory.data.length == 0 &&
//                         <div className="text-zinc-400 text-center w-full h-full flex items-center justify-center">
//                             No game history found
//                         </div>
//                     }
//                 </div>
//                 <Pagination total={1} page={page} setPage={setPage}></Pagination>
//             </main>
//             <main className="lg:w-1/2 w-full bg-zinc-800 rounded-md p-3 h-full text-zinc-200">
//                 <div className="flex gap-2 p-6">
//                     <div style={{ backgroundColor: getColorByInitials().background, color: getColorByInitials().text }} className="min-w-32 min-h-32 bg-red-600 rounded-full flex items-center justify-center text-4xl">{getUserInitials()}</div>
//                     <div className="flex flex-col justify-center gap-3">
//                         <div className="text-4xl">{player.data.firstName} {player.data.lastName}</div>
//                         {
//                             player.data.customId == user?.customId &&
//                             <button className="text-zinc-300 bg-zinc-900 text-sm w-max hover:bg-zinc-950 rounded-lg flex items-center gap-1 p-2" ><Icon name="pen" size={16}></Icon> Edit profile</button>
//                         }

//                         {
//                             player.data.customId != user?.customId &&
//                             <button onClick={() => { profileService.createFriendRequest(player.data.customId) }} className="text-zinc-300 bg-zinc-900 text-sm w-max hover:bg-zinc-950 rounded-lg flex items-center gap-1 p-2" ><Icon name="add" size={16}></Icon> Add friend</button>
//                         }

//                     </div>
//                 </div>

//                 <div className="flex gap-3 p-3 flex-col">
//                     <h1>Statistics</h1>
//                     <div className="flex gap-2 justify-between items-center font-bold">
//                         <div className="flex items-center gap-1 text-lg">
//                             {
//                                 player.data.gamesStats.numberOfGames &&
//                                 <>
//                                     <Icon name="game" size={24} stroke></Icon>
//                                     {Object.values(player.data.gamesStats.numberOfGames).map((c: any) => c.wins).reduce((acc, num) => acc + num, 0) + Object.values(player.data.gamesStats.numberOfGames).map((c: any) => c.losses).reduce((acc, num) => acc + num, 0)} Games
//                                 </>
//                             }
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex gap-3 p-3 flex-col">
//                     <h1>Rank</h1>
//                     <div className="flex gap-2 justify-between items-center font-bold">
//                         {player.data &&
//                             <div style={{ color: getRankName(player.data.rank).color }} className="flex items-center gap-1 text-lg">
//                                 <div dangerouslySetInnerHTML={{ __html: getRankName(player.data.rank).icon }}></div>
//                                 {getRankName(player.data.rank).title}
//                             </div>}

//                         <div className="font-thin text-md">{player.data.rank} {getRankName(player.data.rank).max && "/"} <span className="text-[0.7rem]">{getRankName(player.data.rank).max + 1}</span></div>
//                     </div>
//                     <div className="flex gap-2 flex-wrap font-thin relative">
//                         <div className="rounded-full h-2 w-full bg-gray-500 absolute"></div>
//                         <div style={{ width: `${getCurrentRank(player.data.rank)}%` }} className="rounded-full h-2 bg-green-400 z-50"></div>
//                     </div>
//                 </div>

//                 <div className="flex gap-3 p-3 flex-col">
//                     <h1>Achievements</h1>
//                     <div className="grid 2xl:grid-cols-9 xl:grid-cols-6 grid-cols-4 gap-2 max-h-[40vh] overflow-y-auto">
//                         {
//                             player.data.achievements &&
//                             player.data.achievements.map((achievement: any, i: number) => {
//                                 return (
//                                     <Achievements key={i} imageSrc={achievement.image} name={achievement.name} description={achievement.description}></Achievements>
//                                 )
//                             })
//                         }

//                     </div>
//                     {
//                         !player.data.achievements &&
//                         <div className="text-zinc-400 text-center w-full h-full flex items-center justify-center">
//                             No achievements found
//                         </div>
//                     }
//                 </div>


//                 <div className="flex gap-3 p-3 flex-col">
//                     <h1>Friends</h1>
//                     <div className="flex gap-2 flex-wrap">
//                         {
//                             player.data.friends &&
//                             player.data.friends.map((friend: any, i: number) => {
//                                 return (
//                                     <Link key={i} href={`/profile/${friend.customId}`}>
//                                         <Friends name={friend.username} color={getColorByInitials(friend).background}></Friends>
//                                     </Link>
//                                 )
//                             })
//                         }
//                         {
//                             !player.data.friends &&
//                             <div className="text-zinc-400 text-center w-full h-full flex items-center justify-center">
//                                 No friends found
//                             </div>
//                         }
//                     </div>
//                 </div>
//             </main>
//         </main>
//     )
// }

function GameReplays({ pos, type, date, link }: { pos: any, type: string, date: string, link: string }) {
    function getGameTypeImage() {
        switch (type) {
            case "UNO":
                return "/assets/images/uno.png";
            case "RUMMY":
                return "/assets/images/rummy.png";
            default:
                return "/assets/images/rummy.png";
        }
    }
    const { user } = useContext(UserContext);

    return (
        <div className={`w-full bg-zinc-700 rounded-md p-3 text-zinc-200 flex justify-between ${pos == 1 ? "border border-green-700" : ""}`}>
            <Image className="hidden md:flex" src={getGameTypeImage()} width={100} height={100} alt={'cardType'}></Image>
            <div className="flex flex-col gap-3 items-center justify-center">
                <div className="text-2xl">
                    #{pos.pos}
                </div>
            </div>
            <div className="flex flex-col gap-3 items-center justify-center">
                <div>
                    <Link href={link}>
                        <button className="flex justify-center items-center gap-1 bg-green-700 text-white p-2 px-2 rounded-xl justify-center hover:bg-green-600 flex items-center gap-1 duration-200"><Icon name="watch"></Icon>Watch</button>
                    </Link>
                </div>
                <div className="flex gap-1 justify-between items-end select-none">
                    <div className="font-thin text-xs">{new Date(date).toLocaleTimeString()}</div>
                    <div className="font-thin text-xs">-</div>
                    <div className="font-thin text-[0.5rem]">{new Date(date).toLocaleDateString()}</div>
                </div>
            </div>
        </div>
    )
}

function Achievements({ imageSrc, name, description }: { imageSrc: string, name: string, description?: string }) {

    const [show, setShow] = React.useState(false);
    return (
        <main className="flex">
            {show &&
                <main className="flex justify-center items-center w-screen h-screen fixed top-0 left-0 bg-[#00000050] z-[10000]">
                    <div className="bg-zinc-700 rounded-lg flex p-4 w-[30rem] h-64 relative">
                        <Image className="z-[100]" src={imageSrc} width={200} height={200} alt={name}></Image>

                        <div className="flex flex-col gap-3 px-8 justify-center">
                            <div className="font-bold text-3xl">{name}</div>
                            <div>{description}</div>
                        </div>

                        <div className="absolute top-3 right-3 cursor-pointer" onClick={() => { setShow(!show) }}>
                            <Icon name="close" size={24}></Icon>
                        </div>
                    </div>
                </main>
            }
            <Image onClick={() => { setShow(!show) }} className="z-[100] cursor-pointer" src={imageSrc} width={64} height={64} alt={name}></Image>
        </main>
    )
}

function Friends({ name, color }: { name: string, color: string }) {
    return (
        <main style={{ backgroundColor: color }} className={"flex justify-center items-center w-16 h-16 rounded-full text-xl"}>
            {name.toUpperCase()[0]}
        </main>
    )
}

export default function ProfilePage() {

    const player_id = useParams().id;

    const [page, setPage] = React.useState(1);

    const { user } = useContext(UserContext);
    const profileService = new ProfileService();
    const gameHistoryService = new GameHistoryService();

    function getPlayer() {
        return profileService.getProfileData(player_id as string).then(res => res.json());
    }

    const player = useQuery("player", getPlayer, { enabled: !!player_id, refetchOnWindowFocus: false });

    const GameHistory = useQuery("gameHistory", async () => { return gameHistoryService.getGameHistoryByUser(player_id as string) }, { enabled: !!player_id, refetchOnWindowFocus: false });


    if (player.isLoading || player!.data.length == 0) return <Loading />;

    return (
        <main className="flex flex-col md:flex-row gap-8 justify-center w-full md:w-3/4 mx-auto h-full overflow-y-auto">
            <div className="flex flex-col gap-8 w-full">
                <Card className="w-full flex flex-col items-center justify-center gap-5">
                    <div className="flex justify-between items-center w-full">
                        <div className="font-bold text-2xl">Game Stats</div>
                        <div className="flex gap-4 items-center">
                            <div className="flex gap-1 items-center">
                                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                <span className="text-sm text-zinc-400">Wins</span>
                                <span className="orbitron">{player.data.gamesStats.totalWins || 0}</span>
                            </div>

                            <div className="flex gap-1 items-center">
                                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                <span className="text-sm text-zinc-400">Losses</span>
                                <span className="orbitron">{player.data.gamesStats.totalLosses || 0}</span>
                            </div>
                        </div>
                    </div>

                    {
                        false &&
                        <div className="flex flex-col w-full items-center justify-center">
                            <Icon name="game" size={128} stroke className="text-zinc-400 w-fit h-fit p-8 bg-zinc-700/50 rounded-full"></Icon>
                            <div className="text-zinc-300 text-center w-full h-full flex flex-col items-center justify-center">
                                <span className="text-lg ">
                                    No game stats found
                                </span>
                                <span className="text-sm text-zinc-500">
                                    <span className="text-sm">Play a game to see your history here.</span>
                                </span>
                            </div>
                        </div>
                    }

                    <div className="w-full h-64">
                        <LineChart labels={Object.keys(player.data.gamesStats.gamesPerDate)}
                            wins={Object.values(player.data.gamesStats.gamesPerDate).map((e: any) => e.wins)}
                            losses={Object.values(player.data.gamesStats.gamesPerDate).map((e: any) => e.losses)}
                        />
                    </div>


                </Card>

                <Card className="w-full flex flex-col items-center justify-center gap-5">
                    <div className="flex justify-between items-center w-full">
                        <div className="font-bold text-2xl">Replays</div>
                    </div>

                    <div className="flex flex-col w-full items-center justify-center gap-2">

                        {
                            GameHistory.isLoading && <div className="text-zinc-400 text-center w-full h-full flex items-center justify-center">Loading...</div>
                        }

                        {
                            !GameHistory.isLoading && (!GameHistory.data || GameHistory.data.length == 0) ?
                                <div className="flex flex-col w-full items-center justify-center">
                                    <Icon name="game" size={128} stroke className="text-zinc-400 w-fit h-fit p-8 bg-zinc-700/50 rounded-full"></Icon>
                                    <div className="text-zinc-300 text-center w-full h-full flex flex-col items-center justify-center">
                                        <span className="text-lg ">
                                            No game history found
                                        </span>
                                        <span className="text-sm text-zinc-500">
                                            <span className="text-sm">Play a game to see your history here.</span>
                                        </span>
                                    </div>
                                </div>
                                :
                                !GameHistory.isLoading && GameHistory.data.map((game: any, i: number) => {
                                    return (
                                        <ReplayCard
                                            key={i}
                                            index={i + 1}
                                            pos={(game.position.find((p: any) => p.player = user!._id) || { pos: 0 }).pos}
                                            type={game.type}
                                            date={game.date}
                                            link={`/games/${game.lobbyId}/${game.gameId}/${game.type ? game.type.toLowerCase() : ''}/replay`}
                                            resultLink={`/games/${game.lobbyId}/${game.gameId}/end`}
                                            isFinished={game.endedAt}
                                            isCorrupted={game.endedAt && game.position.length == 0 || !game.endedAt && !game.gameId}
                                        ></ReplayCard>
                                    )
                                })
                        }

                    </div>
                </Card>
            </div>

            <div className="flex flex-col gap-8 w-1/2">
                <Card className="w-full flex flex-col gap-3 px-4 py-4">
                    <div className="flex gap-2 p-4">
                        <div style={{ backgroundColor: getColorByInitials(player.data).background, color: getColorByInitials(player.data).text }}
                            className="min-w-16 min-h-16 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-xl shadow-md shadow-zinc-500 hover:scale-105">
                            {getUserInitials(player.data.firstName, player.data.lastName)}
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                            <div className="text-3xl font-bold">{player.data.firstName} {player.data.lastName}</div>
                            {
                                player.data.customId == user?.customId &&
                                <button className="text-zinc-300 hover:text-zinc-200/60 text-sm w-max rounded-lg flex items-center gap-1" ><Icon name="pen" size={16}></Icon> Edit profile</button>
                            }
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 p-6 w-full">
                        <div className="text-lg text-zinc-400">Statistics</div>
                        <div className="flex gap-2 justify-between items-center font-bold">
                            <div className="flex items-center gap-3 text-lg">
                                {
                                    player.data.gamesStats &&
                                    <>
                                        <div className="p-2 rounded-xl bg-zinc-600/50 text-zinc-200">
                                            <Icon name="game" size={24} stroke className=""></Icon>
                                        </div>
                                        {
                                            player.data.gamesStats.numberOfGames
                                        }
                                        <span className="-ms-1">Games</span>
                                    </>
                                }
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 justify-center items-end font-bold w-full">
                            <div className="flex gap-2 justify-between items-center font-bold w-full">
                                <div className="text-lg text-zinc-400">Rank</div>
                                {player.data &&
                                    <div style={{ color: getRankName(player.data.rank).color }} className="flex items-center gap-1 text-lg">
                                        <div dangerouslySetInnerHTML={{ __html: getRankName(player.data.rank).icon }}></div>
                                        {getRankName(player.data.rank).title}
                                    </div>}
                            </div>
                            <div className="flex gap-2 flex-wrap font-thin relative w-full">
                                <div className="rounded-full h-2 w-full bg-gray-500 absolute"></div>
                                <div style={{ width: `${getCurrentRank(player.data.rank)}%` }} className="rounded-full h-2 bg-gradient-to-r from-purple-500/70 to-orange-600 z-50"></div>
                            </div>
                            <div className="font-thin text-md">{player.data.rank} {getRankName(player.data.rank).max && "/"} <span className="text-[0.7rem]">{getRankName(player.data.rank).max + 1}</span></div>
                        </div>
                    </div>

                    <hr className="w-full border-zinc-500/50" />

                    <div className="flex flex-col items-center justify-center">
                        <div className="text-lg text-zinc-400 font-bold">Achievements</div>
                        <div className="flex gap-2 gap-2 max-h-[40vh] overflow-y-auto p-4">
                            {
                                player.data.achievements &&
                                player.data.achievements.map((achievement: any, i: number) => {
                                    return (
                                        <Achievements key={i} imageSrc={achievement.imageUrl} name={achievement.name} description={achievement.description}></Achievements>
                                    )
                                })
                            }
                            {
                                !player.data.achievements || player.data.achievements.length == 0 &&
                                <div className="text-zinc-400 text-center w-full h-full flex items-center justify-center">
                                    No achievements found
                                </div>
                            }
                        </div>
                    </div>

                    <hr className="w-full border-zinc-500/50" />

                    <div className="flex flex-col items-center justify-center">
                        <div className="text-lg text-zinc-400 font-bold">Friends</div>
                        <div className="flex flex-col gap-2 gap-2 max-h-[40vh] overflow-y-auto p-4">
                            {
                                player.data.friends &&
                                player.data.friends.map((friend: any, i: number) => {
                                    return (
                                        <Link key={i} href={`/profile/${friend.customId}`}>
                                            <Friends name={friend.username} color={getColorByInitials(friend).background}></Friends>
                                        </Link>
                                    )
                                })
                            }
                            {
                                !player.data.friends || player.data.friends.length == 0 &&
                                <div className="text-zinc-400 text-center w-full h-full flex items-center justify-center">
                                    No friends found
                                </div>
                            }
                        </div>
                    </div>
                </Card>

                <Card className="w-full flex flex-col items-center justify-center gap-5">
                    <div className="flex justify-between items-center w-full">
                        <div className="font-bold text-2xl">Detailed Stats</div>
                    </div>

                    <div className="grid grid-cols-2 w-full gap-4">
                        <StatCard icon={<Icon name="game" stroke size={12} />} title={'Game played'} number={player.data.gamesStats.numberOfGames || 0} format={(num) => { return num.toString() }} />
                        <StatCard icon={<Icon name="trophy" stroke size={12} />} title={'Win rate'} number={player.data.gamesStats.winRate || 0} format={(num) => { return num.toString() + "%" }} />
                        <StatCard icon={<Icon name="trophy" stroke size={12} />} title={'Highest rank'} number={player.data.gamesStats.highestRank || 0} format={(num) => { return num.toString() }} />
                        <StatCard icon={<Icon name="timer" stroke size={12} />} title={'Total playtime'} number={player.data.gamesStats.totalPlayTime || 0} format={(num) => {
                            const time = [Math.floor(num / (3600 * 24)), Math.floor(Math.floor(num % 3600) / 60), Math.floor((num % 3600) / 60)];
                            return time.join(':').replace(/(\d+):(\d+):(\d+)/, (_, d, h, m) => `${d > 0 ? d + "d" : ''} ${h}h ${d > 100 ? '' : m + 'm'}`);
                        }} />
                    </div>

                    <hr className="border-zinc-500/50 w-full" />

                    <div className="flex flex-col gap-6 w-full items-center justify-center">
                        <div className="text-zinc-200 font-bold">
                            Quick Actions
                        </div>

                        <div className="flex flex-col w-full gap-2">

                            {
                                user && user.customId === player_id ?
                                    <Link href={`/games`}>
                                        <button className="bg-purple-600/70 text-zinc-200 rounded-lg p-2 px-5 flex items-center justify-center gap-1 hover:bg-purple-500/80 transition-all duration-200 w-full">
                                            <Icon name="game" size={16} stroke></Icon>Start New Game
                                        </button>
                                    </Link> :
                                    <button className="bg-indigo-600/70 text-zinc-200 rounded-lg p-2 px-5 flex items-center justify-center gap-1 hover:bg-indigo-500/80 transition-all duration-200 w-full">
                                        <Icon name="send" size={16}></Icon>Invite to Game
                                    </button>
                            }

                            {
                                user && user.customId != player_id &&
                                <button className="bg-zinc-600/70 text-zinc-200 rounded-lg p-2 px-5 flex items-center justify-center gap-1 hover:bg-zinc-500/80 transition-all duration-200 w-full">
                                    <Icon name="users" size={16}></Icon>Add Friends
                                </button>
                            }


                        </div>
                    </div>

                </Card>
            </div>
        </main>
    )
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`bg-zinc-950/50 border border-purple-600/50 text-zinc-200 rounded-xl p-8 ${className}`}>
            {children}
        </div>
    )
}

function ReplayCard({ pos, type, date, link, resultLink, index, isCorrupted, isFinished }: { pos: any, type: string, date: string, link: string, resultLink: string, index: number, isCorrupted?: boolean, isFinished?: boolean }) {

    function getGameTypeImage() {
        switch (type) {
            case "UNO":
                return "/assets/images/uno.png";
            case "RUMMY":
                return "/assets/images/rummy.png";
            default:
                return "/assets/images/rummy.png";
        }
    }

    return (
        <div key={index} className="bg-zinc-800/50 border border-purple-600/50 text-zinc-200 rounded-xl p-4 w-full h-full flex items-center justify-between gap-4 hover:scale-[103%] transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-4">
                <Image className="hidden md:flex" src={getGameTypeImage()} width={100} height={100} alt={'cardType'}></Image>

                <div className="flex flex-col items-center justify-center">
                    <div className="text-zinc-100">Game #{index}</div>
                    <div className="text-zinc-400 text-xs">{new Date(date).toLocaleDateString()} - {new Date(date).toLocaleTimeString()}</div>
                </div>
            </div>

            <div className="flex gap-2 items-center" >

                {
                    isCorrupted ?
                        <div className="px-2 p-1 rounded-full bg-red-500/50 border border-red-500/70 text-xs flex items-center gap-1"> <Icon name="warning" size={12}></Icon>Corrupted</div>
                        :
                        isFinished ?
                            <>
                                {
                                    pos == 1 ?
                                        <div className="px-2 p-1 rounded-full bg-green-500/50 border border-green-500/70 text-xs flex items-center gap-1"> <Icon name="trophy" stroke size={12}></Icon>Won</div>
                                        :
                                        <div className="px-2 p-1 rounded-full bg-red-500/50 border border-red-500/70 text-xs flex items-center gap-1"> <Icon name="close" stroke size={12}></Icon>Lost</div>
                                }

                                {
                                    type !== 'SOLITAIRE' &&
                                    <Link href={resultLink}>
                                        <button className="bg-gradient-to-r from-indigo-600 to-blue-800 text-zinc-200 rounded-lg p-2 px-5 flex items-center gap-1 hover:shadow-lg hover:shadow-zinc-700 hover:-translate-y-1 transition-all duration-200">
                                            <Icon name="results" size={16}></Icon>Results
                                        </button>
                                    </Link>
                                }

                                {
                                    type !== 'SOLITAIRE' &&
                                    <Link href={link}>
                                        <button className="bg-gradient-to-r from-purple-600 to-purple-800 text-zinc-200 rounded-lg p-2 px-5 flex items-center gap-1 hover:shadow-lg hover:shadow-zinc-700 hover:-translate-y-1 transition-all duration-200">
                                            <Icon name="watch" size={16}></Icon>Replay
                                        </button>
                                    </Link>
                                }
                            </> :
                            <div className="px-2 p-1 rounded-full bg-yellow-500/50 border border-yellow-500/70 text-xs flex items-center gap-1"> <Icon name="loader" className="animate-spin" size={12}></Icon>In Progress</div>
                }
            </div>

        </div>
    )
}

function StatCard({ icon, title, number, format }: { icon: React.ReactNode, title: string, number: number, format: (number: number) => string }) {
    return (
        <div className="bg-zinc-800/50 border border-purple-600/50 text-zinc-200 rounded-xl p-4 w-full h-full flex flex-col items-center justify-center gap-2 hover:scale-[103%] transition-all duration-200 cursor-pointer">
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
                {icon}
                {title}
            </div>
            <div className="text-zinc-200 text-2xl font-bold">
                {format(number)}
            </div>
        </div>
    )
}

