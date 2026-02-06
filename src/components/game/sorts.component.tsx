import Icon from "@/assets/icons"

export default function SortsComponent({ setSortType }: { setSortType: (type: 'abc'|'num') => void }) {
    return (
        <div className="absolute left-10 bottom-8 flex justify-center items-center gap-3">
            <div onClick={() => { setSortType('abc') }} className="lg:w-[4rem] lg:h-[4rem] w-[2rem] h-[2rem] rounded-full border border-blue-300 text-blue-300 hover:border-sky-100 hover:text-sky-100 flex justify-center items-center cursor-pointer duration-100">
                <Icon name="sort-abc" size={12} className="lg:hidden flex"></Icon>
                <Icon name="sort-abc" size={24} className="hidden lg:flex"></Icon>
            </div>
            <div onClick={() => { setSortType('num') }} className="lg:w-[4rem] lg:h-[4rem] w-[2rem] h-[2rem] rounded-full border border-blue-300 text-blue-300 hover:border-sky-100 hover:text-sky-100 flex justify-center items-center cursor-pointer duration-100">
                <Icon name="sort-num" size={12} className="lg:hidden flex"></Icon>
                <Icon name="sort-num" size={24} className="hidden lg:flex"></Icon>
            </div>
        </div>
    )
}