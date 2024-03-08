const blinds = (buttonPosition: number, totalPlayers: number) => {
    let smallBlindPosition = buttonPosition + 1;
    if (smallBlindPosition > totalPlayers) {
        smallBlindPosition -= totalPlayers;
    }

    // Calculate big blind position
    let bigBlindPosition = buttonPosition + 2;
    if (bigBlindPosition > totalPlayers) {
        bigBlindPosition -= totalPlayers;
    }

    return {
        smallBlind: smallBlindPosition,
        bigBlind: bigBlindPosition
    };
}
export default blinds;