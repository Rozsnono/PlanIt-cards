export const RankEnum: any = {
    "copper": {
        "title": "Copper",
        "color": "#b87333",
        "min": 0,
        "max": 99,
        "icon": "<svg width='24' height='24' viewBox='0 0 24 24' fill='#b87333' xmlns='http://www.w3.org/2000/svg'><circle cx='12' cy='12' r='10'/></svg>"
    },
    "silver": {
        "title": "Silver",
        "color": "#c0c0c0",
        "min": 100,
        "max": 249,
        "icon": "<svg width='24' height='24' viewBox='0 0 24 24' fill='#c0c0c0' xmlns='http://www.w3.org/2000/svg'><rect x='4' y='4' width='16' height='16' rx='4'/></svg>"
    },
    "gold": {
        "title": "Gold",
        "color": "#ffd700",
        "min": 250,
        "max": 449,
        "icon": "<svg width='24' height='24' viewBox='0 0 24 24' fill='#ffd700' xmlns='http://www.w3.org/2000/svg'><polygon points='12,2 15,10 23,10 17,15 19,23 12,18 5,23 7,15 1,10 9,10'/></svg>"
    },
    "platinum": {
        "title": "Platinum",
        "color": "#e5e4e2",
        "min": 450,
        "max": 699,
        "icon": "<svg width='24' height='24' viewBox='0 0 24 24' fill='#e5e4e2' xmlns='http://www.w3.org/2000/svg'><path d='M12 2 L19 8 L16 20 L8 20 L5 8 Z'/></svg>"
    },
    "diamond": {
        "title": "Diamond",
        "color": "#b9f2ff",
        "min": 700,
        "max": 1049,
        "icon": "<svg width='24' height='24' viewBox='0 0 24 24' fill='#b9f2ff' xmlns='http://www.w3.org/2000/svg'><polygon points='12,2 22,9 18,22 6,22 2,9'/></svg>"
    },
    "champion": {
        "title": "Champion",
        "color": "#ea4df0",
        "min": 1050,
        "max": 1499,
        "icon": "<svg width='24' height='24' viewBox='0 0 24 24' fill='#ea4df0' xmlns='http://www.w3.org/2000/svg'><path d='M12 2 L15 10 H22 L17 15 L19 22 L12 18 L5 22 L7 15 L2 10 H9 Z'/></svg>"
    },
    "grand champion": {
        "title": "Grand Champion",
        "color": "#ff0000",
        "min": 1500,
        "max": null,
        "icon": "<svg width='24' height='24' viewBox='0 0 24 24' fill='#ff0000' xmlns='http://www.w3.org/2000/svg'><path d='M12 2 L18 8 L16 20 L8 20 L6 8 Z'/></svg>"
    }
}



export function getRankName(rank: number): { title: string, color: string, min: number, max: number, icon: string } {
    const data: { title: string, color: string, min: number, max: number } | any = Object.keys(RankEnum).map((data: string | any) => {
        if (RankEnum[data].min <= rank && (!RankEnum[data].max || RankEnum[data].max >= rank)) {
            return RankEnum[data]
        }
        return null;
    }).filter(data => { return data })[0];

    if (data) {
        return data;
    }
    return { title: "", color: "", min: 0, max: 0, icon: "" };
}

export function getCurrentRank(rank: number): number {
    if (!getRankName(rank).max) {
        return 100;
    }
    return ((rank - getRankName(rank).min) / (getRankName(rank).max - getRankName(rank).min)) * 100
}