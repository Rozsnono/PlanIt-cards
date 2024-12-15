export default function Chart() {
    
    const data = {
        games: 1685,
        wins: 569,
        loses: 1685-569
    }


    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col items-center w-full gap-3 text-zinc-200 ">
                Wins
                <div className="w-full flex justify-end">
                    <div style={{width: (((data.wins)*1.0/(data.games)*1.0) * 100) + "%"}} className="bg-green-400 h-12 text-zinc-900 flex items-center justify-start px-2 rounded-l-xl font-bold border-r">
                        {data.wins}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center w-full gap-3 text-zinc-200 ">
                Loses
                <div className="w-full flex justify-start">
                    <div style={{width: (((data.loses)*1.0/(data.games)*1.0) * 100) + "%"}} className="bg-red-400 h-12 text-zinc-900 flex items-center justify-end px-2 rounded-r-xl font-bold border-l">
                        {data.loses}
                    </div>
                </div>
            </div>
        </div>
    )
}