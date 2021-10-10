import './Options.css';
import { useState } from 'react';
import { useHistory } from 'react-router';
import storage from '../services/local.storage.service';
import strgKeys from 'constants/storage.keys';
import logo from '../darts-logo.svg';

export default function Options() {
    document.title = 'General Options';

    const [numPlayers, setNumPlayers] = useState('');
    const [gameType, setGameType] = useState('');
    const history = useHistory();

    const changeGameType = ev => {
        const selected = ev.target.options[ev.target.selectedIndex];
        setGameType(selected.value);
    }

    const changeNumberOfPlayers = ev => {
        const selected = ev.target.options[ev.target.selectedIndex];
        setNumPlayers(selected.value);
    }

    const storeConfigAndContinue = () => {
        storage.store(strgKeys.gametype, gameType);
        storage.store(strgKeys.playernumber, numPlayers);
        history.push(`/darts/players/${numPlayers}/game/${gameType}`);
    }

    return (
        <div className="container">
            <div className="flex between options">
                <img src={logo} alt="" className="options-logo" />
                <h4>Darts Scorer</h4>
            </div>
            <div className="flex center vertical">
                <div className="box">
                    <div className="form">
                        <label>Numero de jugadores:</label>
                        <select defaultValue="--" onChange={ ev => changeNumberOfPlayers(ev) }>
                            <option disabled>--</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </div>
                    <div className="form">
                        <label>Tipo de juego:</label>
                        <select defaultValue="--" onChange={ ev => changeGameType(ev) }>
                            <option disabled>--</option>
                            <option value="301">301 (Dev)</option>
                            <option value="501">501 (Dev)</option>
                            <option value="701">701 (Dev)</option>
                            <option value="cricket">Cricket</option>
                        </select>
                    </div>
                </div>

                <button className="btn green" onClick={ storeConfigAndContinue }>Continuar</button>
            </div>
        </div>
    );
}