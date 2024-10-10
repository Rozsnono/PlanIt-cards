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