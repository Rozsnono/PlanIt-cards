export default function Pagination({ total, page, setPage }: { total: number, page: number, setPage: (page: number) => void }) {

    function getSlice(array: number[] = []) {
        if (page <= 4) {
            return array.slice(1, 5);
        } else if (page > 3 && page < total - 4) {
            return array.slice(page - 2, page + 1);
        } else if (page >= total - 3) {
            return array.slice(total - 5, total - 1);
        } else {
            return array.slice(page - 2, page + 1);
        }

    }

    if (total <= 7) {
        return (
            <main className="flex gap-7 w-full justify-center text-white p-3">
                {
                    Array.from({ length: total }, (_, i) => i + 1).map((i) => {
                        return (
                            <button key={i} onClick={() => setPage(i)} className={`rounded-full p-2 flex justify-center items-center h-8 w-8 ${page == i ? "bg-green-600" : "bg-zinc-700"}`}>{i}</button>
                        )
                    })
                }
            </main>
        );
    }

    return (
        <main className="flex gap-7 w-full justify-center text-white p-3">
            {
                <button onClick={() => setPage(1)} className={`rounded-full p-2 flex justify-center items-center h-8 w-8 ${page == 1 ? "bg-green-600" : "bg-zinc-700"}`}>1</button>
            }
            {
                page > 1 + 3 &&
                <button className="rounded-full p-2 flex justify-center items-center bg-zinc-700 h-8 w-8">{"..."}</button>
            }
            {
                getSlice(Array.from({ length: total }, (_, i) => i + 1)).map((i) => {
                    return (
                        <button key={i} onClick={() => setPage(i)} className={`rounded-full p-2 flex justify-center items-center h-8 w-8 ${page == i ? "bg-green-600" : "bg-zinc-700"}`}>{i}</button>
                    )
                })
            }
            {
                page < total - 3 &&
                <button className="rounded-full p-2 flex justify-center items-center bg-zinc-700 h-8 w-8">{"..."}</button>
            }
            {
                <button onClick={() => setPage(total)} className={`rounded-full p-2 flex justify-center items-center h-8 w-8 ${page == total ? "bg-green-600" : "bg-zinc-700"}`}>{total}</button>
            }
        </main>
    )
}