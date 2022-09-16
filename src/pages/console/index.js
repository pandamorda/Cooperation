////////////////////////////
import { getUserData } from '../../../back_emu/cooperation/index';
////////////////////////////

import { Console } from './_console';

import './console.css';

window.addEventListener('load', async () => {
    const userData = JSON.parse(await getUserData());

    new Console(userData);
});
