const CardNames: any = {
    c: 'clubs',
    d: 'diamonds',
    h: 'hearts',
    s: 'spades',

    a: 'ace',
    k: 'king',
    q: 'queen',
    j: 'jack',
    t: '10',

    rj: 'red_joker',
    bj: 'black_joker',
}

export default function getCardUrl(card: string) {
    // if(card === "rj" || card === "bj"){
    //     return `${CardNames[card]}.png`;
    // }

    // const letters: string[] = card.split('');
    // if (parseInt(letters[0])) {
    //     return `${letters[0]}_of_${CardNames[letters[1]]}.png`;
    // }

    // return `${CardNames[letters[0]]}_of_${CardNames[letters[1]]}.png`;

    return `${card.toUpperCase()}.png`;
}