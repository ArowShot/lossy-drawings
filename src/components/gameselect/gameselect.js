import * as fs from 'fs';

const styles = fs.readFileSync(`${__dirname}/gameselect.css`); // eslint-disable-line no-path-context, no-path-concat

// TODO: this code can be cleaned up a lot
export default class GameSelect extends HTMLElement {

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;

    const title = document.createElement('h1');
    title.textContent = 'Lossy Drawings';

    const playername = document.createElement('input');
    playername.setAttribute('placeholder', 'Player name')

    const roomname = document.createElement('input');
    roomname.setAttribute('placeholder', 'Room name')

    const play = document.createElement('button');
    play.textContent = 'Play Game';
    play.addEventListener('click', () => {
      if(!playername.value || !roomname.value) {
        alert('Please enter a player and room name');
        return;
      }
      this.dispatchEvent(new CustomEvent('ready', {
        detail: {
          playerName: playername.value,
          roomName: roomname.value,
        },
      }));
    });

    shadow.appendChild(style);
    shadow.appendChild(title);
    shadow.appendChild(playername);
    shadow.appendChild(roomname);
    shadow.appendChild(play);
  }

}
