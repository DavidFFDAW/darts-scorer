export const randomKey = '019438ac-0522-4b0e-';

export const getPlayersKeys = names => {
    return names.map((item, ind) => {
        const id = randomKey + (ind + 1);

        return {
            id: id,
            name: item,
        };
    });
};

export const initialGameObject = (players, game, url, rounds = 21) => {
    const playersKeys = getPlayersKeys(players);

    return {
        url: url,
        game: game,
        round: 0,
        maxRound: playersKeys.length * 3 * rounds,
        players: playersKeys,
        scorer: {
            userId: playersKeys[0].id,
            board: playersKeys.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    turn: 1,
                    score: 0,
                    valid_points: {
                        15: 0,
                        16: 0,
                        17: 0,
                        18: 0,
                        19: 0,
                        20: 0,
                        25: 0,
                    },
                    throws: [],
                };
            }),
        },
        currentUser: playersKeys[0],
        isThereWinner: false,
        winner: {},
        finished: false,
    };
};


const getDirectWinner = gameScored => {
    return gameScored.scorer.board.find(item => {
        return item.score === 0;
    });
};

const getCalculatedWinner = game => {
    const scores = game.scorer.board.map(item => item.score);
    const minimumScore = Math.min(...scores);
    const winners = game.scorer.board.filter(item => item.score === minimumScore);

    if (winners.length === 1) return winners[0];
    return winners;
};

const calculateWinner = game => {
    const directWinner = getDirectWinner(game);
    if (directWinner) return directWinner;

    if (game.round >= game.maxRound) {
        const calculatedWinner = getCalculatedWinner(game);

        return calculatedWinner;
    }
};

const isViableScore = (game, score) => {
    const playingUser = game.scorer.board.find(item => item.id === game.currentUser.id);
    const isViable = playingUser.score - score >= 0;

    return isViable;
};

const setNextPlayer = game => {
    const currentUser = game.players.findIndex(item => item.id === game.currentUser.id);
    const user = game.players[currentUser + 1] || game.players[0];
    game.currentUser = user;
    game.scorer.userId = game.currentUser.id;
};

const isEveryValidPointClosedFor = player => {
    
}
const isEveryValidPointClosedForEveryone = board => {
    return board.find(item => Object.values(item.valid_points).every(point => point >= 3));
}
const isNumberClosedForEveryone = (board, score) => {
    return board.find(playerBoard => Object.values(playerBoard.valid_points).every(point => point[score] >= 3));
}
const isNumberClosedFor = player => { }

const scorePoints = (playingUser, game, score, realValue) => {
    if (isViableScore(game, score)) {
        playingUser.score -= score;
    }
    if (realValue) {
        playingUser.throws = [...playingUser.throws, realValue];
    }
    playingUser.turn += 1;

    return game;
};


export function playCricketTurn(game, score, realValue = false) {

    // return game;
    if (game.round >= game.maxRound) {
        game.isThereWinner = true;
        game.winner = calculateWinner(game);
        game.finished = true;

        return game;
    }

    const playingUser = game.scorer.board.find(item => item.id === game.currentUser.id);

    console.log({
        playingUser, game, score, is_viable: isViableScore(game, score) 
    });
    return game;

    // if (!isViableScore(game, score)) {
    //     setNextPlayer(game);
    //     playingUser.turn = 1;

    //     return game;
    // }

    scorePoints(playingUser, game, score, realValue);

    if (playingUser.turn >= 4) {
        playingUser.turn = 1;
        setNextPlayer(game);
        game.round += 1;
    }

    const winner = getDirectWinner(game);

    if (winner) {
        game.isThereWinner = true;
        game.winner = winner;
        game.finished = true;

        return game;
    }

    return game;
}
