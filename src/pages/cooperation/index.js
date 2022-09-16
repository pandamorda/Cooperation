import { getUserData } from '../../../back_emu/cooperation';
////////////////////////////

import { MiniConsole } from './_mini-console';

import './cooperation.css';

window.addEventListener('load', async () => {
    const userData = JSON.parse(await getUserData());

    new MiniConsole(userData);
});
