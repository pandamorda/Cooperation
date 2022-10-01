import { CN } from "@scripts/constants/start";
import "./start.css";

const handleCardsAnimation = () => {
  const cardElems = Array.from(document.getElementsByClassName(CN.card));

  cardElems.forEach((card, index) => {
    const isCardEven = index % 2 === 0;
    const cardHalfHeight = 0.5 * card.clientHeight;

    const cardAnimationCN = isCardEven ? CN.appearCardL : CN.appearCardR;
    const cardCN = card.classList;

    if (
      window.scrollY <= card.offsetTop + card.clientHeight + cardHalfHeight &&
      window.scrollY + window.innerHeight >= card.offsetTop - cardHalfHeight
    ) {
      cardCN.add(cardAnimationCN);
      cardCN.remove(CN.hidden);
    } else {
      cardCN.remove(cardAnimationCN);
      cardCN.add(CN.hidden);
    }
  });
};

const handleWindowLoad = () => {
  handleCardsAnimation();
  window.addEventListener("scroll", handleCardsAnimation);
};

window.addEventListener("load", handleWindowLoad);
