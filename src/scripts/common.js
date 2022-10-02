// HTML //

export const createEl = (elem) => document.createElement(elem);
export const getElById = (id) => document.getElementById(id);
export const getElsByCN = (id) => document.getElementsByClassName(id);
export const getElsByName = (id) => document.getElementsByName(id);
export const getElsByTag = (id) => document.getElementsByTagName(id);

// MISC //

export const redirectPage = async (
    url = '',
    openMode = '_blank',
    redirectTime = 0,
    aux = () => {}
) =>
    new Promise((fulfill) => {
        let secondsCounter = redirectTime * 1e-3;
        const redirectInterval = setInterval(() => {
            aux && aux(secondsCounter);

            if (secondsCounter === 0) {
                clearInterval(redirectInterval);
                window.open(url, openMode);
                fulfill();
            }

            secondsCounter--;
        }, 1000);
    });
