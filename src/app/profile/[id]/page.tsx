"use client";
import Icon from "@/assets/icons";
import Chart, { LineChart } from "@/components/chart";
import { getColorByInitials, getUserInitials } from "@/functions/user.function";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getCurrentRank, getRankName } from "@/interfaces/rank.enum";
import Pagination from "@/components/pagination";
import React, { useContext, useEffect, useState } from "react";
import { achievements } from "@/interfaces/achievement.enum";
import ProfileService from "@/services/profile.service";
import { UserContext } from "@/contexts/user.context";
import { GameHistoryService } from "@/services/game.history.service";
import Link from "next/link";
import Loader from "@/components/loader.component";
import Loading from "@/app/loading";
import ProfilePicture, { ProfileIcon } from "@/assets/profile-pics";
import { Iplayer } from "@/interfaces/interface";


export default function ProfilePage() {

    const player_id = useParams().id;

    const [page, setPage] = React.useState(1);
    const [profileSettings, setProfileSettings] = React.useState(false);

    const { user } = useContext(UserContext);
    const profileService = new ProfileService();
    const gameHistoryService = new GameHistoryService();

    function formatDates(dates: string[]): string[] {
        return dates.map(date => {
            const [month, day] = date.split('-').map(Number);
            return `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1]}. ${day.toString().padStart(2, '0')}.`; // Format to MM-DD
        });
    }

    function getPlayer() {
        return profileService.getProfileData(player_id as string).then(res => res.json());
    }

    const player = useQuery(
        {
            queryKey: ['player', player_id],
            queryFn: getPlayer,
            enabled: !!player_id, refetchOnWindowFocus: false
        }
    );

    const GameHistory = useQuery(
        {
            queryKey: ['gameHistory', player_id],
            queryFn: async () => { return gameHistoryService.getGameHistoryByUser(player_id as string) },
            enabled: !!player_id, refetchOnWindowFocus: false
        }
    );

    if (player.isLoading || player!.data.length == 0) return <Loading />;

    return (
        <main className="flex flex-col md:flex-row gap-8 justify-center w-full md:w-3/4 mx-auto h-full">
            <div className="flex flex-col gap-8 w-full">
                <Card className="w-full flex-col items-center justify-center gap-5 3xl:hidden flex">
                    <div className="flex justify-between items-center w-full">
                        <div className="font-bold text-2xl">Detailed Stats</div>
                    </div>

                    <div className="grid grid-cols-4 w-full gap-4">
                        <StatCard icon={<Icon name="game" stroke size={12} />} title={'Game played'} number={player.data.gamesStats.numberOfGames || 0} format={(num) => { return num.toString() }} />
                        <StatCard icon={<Icon name="trophy" stroke size={12} />} title={'Win rate'} number={player.data.gamesStats.winRate || 0} format={(num) => { return num.toString() + "%" }} />
                        <StatCard icon={<Icon name="trophy" stroke size={12} />} title={'Highest rank'} number={player.data.gamesStats.highestRank || 0} format={(num) => { return getRankName(num).title }} />
                        <StatCard icon={<Icon name="timer" stroke size={12} />} title={'Total playtime'} number={player.data.gamesStats.totalPlayTime || 0} format={(num) => {
                            const time = [Math.floor(num / (3600 * 24)), Math.floor(Math.floor(num % 3600) / 60), Math.floor((num % 3600) / 60)];
                            return time.join(':').replace(/(\d+):(\d+):(\d+)/, (_, d, h, m) => `${d > 0 ? d + "d" : ''} ${h}h ${d > 100 ? '' : m + 'm'}`);
                        }} />
                    </div>
                </Card>

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

                    {player.data.gamesStats && player.data.gamesStats.gamesPerDate &&
                        <div className="w-full h-64">
                            <LineChart labels={formatDates(Object.keys(player.data.gamesStats.gamesPerDate))}
                                wins={Object.values(player.data.gamesStats.gamesPerDate).map((e: any) => e.wins)}
                                losses={Object.values(player.data.gamesStats.gamesPerDate).map((e: any) => e.losses)}
                            />
                        </div>
                    }


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
                                            date={game.createdAt}
                                            link={`/games/${game.lobbyId}/${game.gameId}/${game.type ? game.type.toLowerCase() : ''}/replay`}
                                            resultLink={`/games/${game.lobbyId}/${game.gameId}/result`}
                                            isFinished={game.endedAt}
                                            isCorrupted={game.endedAt && game.position[0] == 0 || !game.endedAt && new Date(game.createdAt).getDate() + new Date(game.createdAt).getMonth() < new Date().getDate() + new Date().getMonth()}
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
                        <ProfileIcon settings={player.data.settings} size={4} className="text-[2rem]" />
                        <div className="flex flex-col justify-center gap-2">
                            <div className="text-3xl font-bold">{player.data.firstName} {player.data.lastName}</div>
                            {
                                player.data.customId == user?.customId &&
                                <button onClick={() => { setProfileSettings(true) }} className="text-zinc-300 hover:text-zinc-200/60 text-sm w-max rounded-lg flex items-center gap-1" ><Icon name="pen" size={16}></Icon> Edit profile</button>
                            }
                        </div>

                        {
                            profileSettings &&
                            <PlayerSettings user={player.data} onClose={() => { setProfileSettings(false); player.refetch() }} />
                        }

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
                        <div className="flex gap-2 gap-2 max-h-[40vh] overflow-y-auto p-4">
                            {
                                player.data.friends &&
                                player.data.friends.map((friend: any, i: number) => {
                                    return (
                                        <Link key={i} href={`/profile/${friend.customId}`}>
                                            <Friends settings={friend.settings} initials={getUserInitials(friend.firstName, friend.lastName)}></Friends>
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

                    <hr className="border-zinc-500/50 w-full 3xl:hidden flex" />

                    <div className="flex flex-col gap-6 w-full items-center justify-center 3xl:hidden flex">
                        <div className="text-lg text-zinc-400 font-bold">Quick Actions</div>


                        <div className="flex flex-col w-full gap-2">

                            {
                                user && user.customId === player_id &&
                                <Link href={`/games`}>
                                    <button className="bg-purple-600/70 text-zinc-200 rounded-lg p-2 px-5 flex items-center justify-center gap-1 hover:bg-purple-500/80 transition-all duration-200 w-full">
                                        <Icon name="game" size={16} stroke></Icon>Start New Game
                                    </button>
                                </Link>
                            }

                            {
                                user && user.customId != player_id && player.data.friends && player.data.friends.find((f: any) => f.customId !== user.customId) &&
                                <button className="bg-zinc-600/70 text-zinc-200 rounded-lg p-2 px-5 flex items-center justify-center gap-1 hover:bg-zinc-500/80 transition-all duration-200 w-full">
                                    <Icon name="users" size={16}></Icon>Add Friends
                                </button>
                            }

                            {
                                user && user.customId != player_id && player.data.friends && player.data.friends.find((f: any) => f.customId === user.customId) &&
                                <div className="bg-zinc-900/70 text-zinc-200 border border-zinc-500/60 rounded-lg p-2 px-5 flex items-center justify-center gap-1 transition-all duration-200 w-full">
                                    <Icon name="users" size={16}></Icon>You are already friends
                                </div>
                            }


                        </div>
                    </div>
                </Card>

                <Card className="w-full flex-col items-center justify-center gap-5 3xl:flex hidden">
                    <div className="flex justify-between items-center w-full">
                        <div className="font-bold text-2xl">Detailed Stats</div>
                    </div>

                    <div className="grid grid-cols-2 w-full gap-4">
                        <StatCard icon={<Icon name="game" stroke size={12} />} title={'Game played'} number={player.data.gamesStats.numberOfGames || 0} format={(num) => { return num.toString() }} />
                        <StatCard icon={<Icon name="trophy" stroke size={12} />} title={'Win rate'} number={player.data.gamesStats.winRate || 0} format={(num) => { return num.toString() + "%" }} />
                        <StatCard icon={<Icon name="trophy" stroke size={12} />} title={'Highest rank'} number={player.data.gamesStats.highestRank || 0} format={(num) => { return getRankName(num).title }} />
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
                                user && user.customId === player_id &&
                                <Link href={`/games`}>
                                    <button className="bg-purple-600/70 text-zinc-200 rounded-lg p-2 px-5 flex items-center justify-center gap-1 hover:bg-purple-500/80 transition-all duration-200 w-full">
                                        <Icon name="game" size={16} stroke></Icon>Start New Game
                                    </button>
                                </Link>
                            }

                            {
                                user && user.customId != player_id && player.data.friends && player.data.friends.find((f: any) => f.customId !== user.customId) &&
                                <button className="bg-zinc-600/70 text-zinc-200 rounded-lg p-2 px-5 flex items-center justify-center gap-1 hover:bg-zinc-500/80 transition-all duration-200 w-full">
                                    <Icon name="users" size={16}></Icon>Add Friends
                                </button>
                            }

                            {
                                user && user.customId != player_id && player.data.friends && player.data.friends.find((f: any) => f.customId === user.customId) &&
                                <div className="bg-zinc-900/70 text-zinc-200 border border-zinc-500/60 rounded-lg p-2 px-5 flex items-center justify-center gap-1 transition-all duration-200 w-full">
                                    <Icon name="users" size={16}></Icon>You are already friends
                                </div>
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
            case "SCHNAPPS":
                return "/assets/images/schnapps.png";
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
                                    type !== 'SOLITAIRE' && type !== 'SCHNAPPS' &&
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

function PlayerSettings({ user, onClose }: { user?: Iplayer, onClose: () => void }) {

    const [settings, setSettings] = useState({
        textColor: '#ffffff',
        backgroundColor: '#000000',
        borderWidth: 0,
        borderColor: '#000000',
        hasPicture: false,
        selectedPicture: 'none'
    })

    function SaveProfileSettings() {
        new ProfileService().updateProfile(user!.customId, { settings }).then(() => {
            onClose();
        }).catch((err) => {
            console.error(err);
        });
    }

    useEffect(() => {
        if (user) {
            setSettings({
                textColor: user.settings.textColor || '#ffffff',
                backgroundColor: user.settings.backgroundColor || '#000000',
                borderWidth: user.settings.borderWidth || 0,
                borderColor: user.settings.borderColor || '#000000',
                hasPicture: user.settings.hasPicture || false,
                selectedPicture: user.settings.selectedPicture || 'none'
            });
        }
    }, [user]);


    const selectable = [
        'none',
        'default1',
        'default3',
        'default4',
        'default5',
        'default6',
        'default7',
        'default8',
    ]

    return (
        <main className="fixed w-full h-full flex justify-center items-center bg-black/50 z-[1000] top-0 left-0">
            <div className="bg-zinc-800/80 border border-purple-600/50 text-zinc-200 rounded-xl flex flex-col items-center justify-center gap-2 min-w-96">
                <h2 className="text-lg font-bold px-8 py-4 pb-2">Player Settings</h2>
                <hr className="border-purple-600/50 w-full" />
                <div className="flex flex-col gap-2 p-4 w-full">
                    <div className="w-full flex justify-between items-center">
                        {/* <ProfileIcon settings={settings} size={5} className="text-[2rem]" /> */}

                        <div className="flex flex-col justify-center gap-2 items-end w-full">
                            <form className="flex items-center w-full gap-2">
                                <label htmlFor="simple-search" className="">Background Color</label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <Icon name="palette" size={16} className="text-gray-500 dark:text-gray-400"></Icon>
                                    </div>
                                    <input value={settings.backgroundColor} maxLength={7} onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })} type="text" id="simple-search" className="bg-zinc-700 border border-gray-800 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Write your color.." required />
                                </div>
                                <label style={{ backgroundColor: settings.backgroundColor }} htmlFor="colorPickerBg" className="flex items-center justify-center min-w-10 min-h-10 bg-zinc-700 rounded-full cursor-pointer hover:bg-zinc-600 transition-all duration-200 ms-2">
                                    <input type="color" id="colorPickerBg" className="w-0 h-0" value={settings.backgroundColor} onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })} />
                                </label>

                            </form>
                            <form className="flex items-center w-full gap-2">
                                <label htmlFor="simple-search" className="">Icon Color</label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <Icon name="palette" size={16} className="text-gray-500 dark:text-gray-400"></Icon>
                                    </div>
                                    <input value={settings.textColor} maxLength={7} onChange={(e) => setSettings({ ...settings, textColor: e.target.value })} type="text" id="simple-search" className="bg-zinc-700 border border-gray-800 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Write your color.." required />
                                </div>
                                <label style={{ backgroundColor: settings.textColor }} htmlFor="colorPicker" className="flex items-center justify-center min-w-10 min-h-10 bg-zinc-700 rounded-full cursor-pointer hover:bg-zinc-600 transition-all duration-200 ms-2">
                                    <input type="color" id="colorPicker" className="w-0 h-0" value={settings.textColor} onChange={(e) => setSettings({ ...settings, textColor: e.target.value })} />
                                </label>

                            </form>
                            <form className="flex items-center w-full gap-2">
                                <label htmlFor="simple-search" className="">Border</label>

                                <input value={settings.borderWidth} max={10} min={0} onChange={(e) => setSettings({ ...settings, borderWidth: parseInt(e.target.value) })} type="number" className="bg-zinc-700 border border-gray-800 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pe-2 p-2.5 max-w-16" required />

                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                        <Icon name="palette" size={16} className="text-gray-500 dark:text-gray-400"></Icon>
                                    </div>
                                    <input value={settings.borderColor} maxLength={7} onChange={(e) => setSettings({ ...settings, borderColor: e.target.value })} type="text" id="simple-search" className="bg-zinc-700 border border-gray-800 text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5" placeholder="Write your color.." required />
                                </div>
                                <label style={{ backgroundColor: settings.borderColor }} htmlFor="colorPicker3" className="flex items-center justify-center min-w-10 min-h-10 bg-zinc-700 rounded-full cursor-pointer hover:bg-zinc-600 transition-all duration-200 ms-2">
                                    <input type="color" id="colorPicker3" className="w-0 h-0" value={settings.borderColor} onChange={(e) => setSettings({ ...settings, borderColor: e.target.value })} />
                                </label>

                            </form>
                        </div>
                    </div>

                </div>
                <hr className="border-purple-600/50 w-full" />

                <div className="grid grid-cols-4 gap-4 p-4 w-full">

                    {selectable.map((name, i) => {

                        if (name === 'none') {
                            return (
                                <div onClick={() => { setSettings({ ...settings, selectedPicture: name, hasPicture: false }) }} key={i} style={{ backgroundColor: settings.backgroundColor, color: settings.textColor, border: settings.borderWidth ? `${settings.borderWidth}px solid ${settings.borderColor}` : 'none' }} className="relative rounded-full w-24 h-24 cursor-pointer duration-200 hover:scale-105 select-none flex justify-center items-center text-4xl" >
                                    {getUserInitials()}
                                    {
                                        settings.selectedPicture === name &&
                                        <div className="absolute top-0 right-0">
                                            <Icon name="check" size={16} className="text-green-500" />
                                        </div>
                                    }
                                </div>
                            )

                        }

                        return (
                            <div onClick={() => { setSettings({ ...settings, selectedPicture: name, hasPicture: true }) }} style={{ backgroundColor: settings.backgroundColor, border: settings.borderWidth ? `${settings.borderWidth}px solid ${settings.borderColor}` : 'none' }} className="relative rounded-full w-24 h-24 flex items-center justify-center cursor-pointer duration-200 hover:scale-105 select-none" key={i}>
                                <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                                    <ProfilePicture name={name} color={settings.textColor} className="p-4" />
                                </div>

                                {
                                    settings.selectedPicture === name &&
                                    <div className="absolute top-0 right-0">
                                        <Icon name="check" size={16} className="text-green-500" />
                                    </div>
                                }
                            </div>
                        )
                    })}




                </div>

                <hr className="border-purple-600/50 w-full" />

                <div className="flex justify-end items-center gap-4 p-4 w-full">
                    <button onClick={() => {
                        SaveProfileSettings();
                    }} className="bg-gradient-to-br from-green-500 to-emerald-800 text-white rounded-lg p-2 px-8 hover:scale-105 transition-all duration-200">Save</button>

                </div>
            </div>
        </main>
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

function Friends({ settings, initials }: { settings: any, initials: string }) {

    return (
        <ProfileIcon settings={settings} size={3} className='p-0' initials={initials} />
    )
}
