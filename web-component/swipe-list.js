class SwipeState {
  startX = 0;
  isDragging = false;
  atX = 0;
  diffX = 0;
  minDiffX = 0;
  maxDiffX = 0;
  swipeRight = null;
  swipeLeft = null;
  element = null;
  element = null;
  constructor(element) {
    this.element = element;
  }
  start(event) {
    this.startX = eventX(event);
    this.isDragging = true;
  }

  update(event) {
    this.atX = eventX(event);
    const diffX = this.atX - this.startX;
    this.diffX = diffX;
    this.minDiffX = Math.min(diffX, this.minDiffX);
    this.maxDiffX = Math.max(diffX, this.maxDiffX);

    const triggerDistance = this.element.clientWidth / 2;
    const undoTriggerDistance = triggerDistance / 3;

    this.swipeRight = null;
    this.swipeLeft = null;
    if (
      diffX > triggerDistance &&
      diffX > this.maxDiffX - undoTriggerDistance
    ) {
      this.swipeRight = true;
      this.swipeLeft = false;
    } else if (
      diffX < -triggerDistance &&
      diffX < this.minDiffX + undoTriggerDistance
    ) {
      this.swipeRight = false;
      this.swipeLeft = true;
    }
  }
  styleFraction() {
    return Math.max(-1.0, Math.min(1.0, this.diffX / this.element.clientWidth));
  }
}

class SwipeList extends HTMLElement {
  constructor() {
    super();
    // Initialize a MutationObserver to observe child nodes
    this.observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          // Wrap any newly added child nodes
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.classList.contains("swipe-item-wrapper")) return;
                this.wrapItem(node);
            }
          });
        }
      }
    });
  }

  connectedCallback() {
    this.render();
    this.observer.observe(this, { childList: true });
  }

  disconnectedCallback() {
    this.observer.disconnect();
  }

  render() {
    if (!document.getElementById("swipe-list")) {
      document.head.insertAdjacentHTML(
        "beforeend",
        /* HTML */ `<style class="swipe-list">
          swipe-list {
            width: 100%;
            height: 100%;
          }
          .swipe-item-wrapper {
            width: fit-content;
            margin-inline: auto;
            padding: 20px;
            box-sizing: border-box;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.05s;
            will-change: transform;
            //user-select: none;

            & > :last-child {
              display: flex;
              justify-content: space-around;
            }
          }
        </style> `,
      );
    }
    Array.from(this.children).forEach(child => this.wrapItem(child));
  }

  wrapItem(item) {
    // Skip if the item is already wrapped
    if (item.classList.contains("swipe-item-wrapper")) {
      this.appendChild(item);
      item.swipeList = this;
      return;
    }

    this.insertAdjacentHTML(
      "beforeend",
      `<div class='swipe-item-wrapper'></div>`,
    );
    const wrapper = this.lastElementChild;

    wrapper.appendChild(item);
    wrapper.item = item;
    wrapper.insertAdjacentHTML(
      "beforeend",
      `<span><button>left</button><button>right</button></span>`,
    );

    wrapper.swipe = new SwipeState(wrapper);
    wrapper.swipeList = this;
    wrapper.finishSwipeLeft = function () {
      styleLeft(this);
      this.style.transform = `translateX(-100%)`;
      dispatch(this.swipeList, "swipe-left", item);
    };
    wrapper.finishSwipeRight = function () {
      styleRight(this);
      wrapper.style.transform = `translateX(100%)`;
      dispatch(this.swipeList, "swipe-right", item);
    };
    const btns = wrapper.querySelectorAll("button");
    btns[0].onclick = function () {
      this.parentElement.parentElement.finishSwipeLeft();
    };
    btns[1].onclick = function () {
      this.parentElement.parentElement.finishSwipeRight();
    };
    wrapper.addEventListener("touchstart", handleSwipeStart);
    wrapper.addEventListener("touchmove", handleSwipeMove);
    wrapper.addEventListener("touchend", handleSwipeEnd);

    wrapper.addEventListener("mousedown", handleSwipeStart);
    wrapper.addEventListener("mousemove", handleSwipeMove);
    wrapper.addEventListener("mouseup", handleSwipeEnd);
    wrapper.addEventListener("mouseleave", handleSwipeEnd);
  }
}

customElements.define("swipe-list", SwipeList);

function styleLeft(el) {
  el.style.background = "lch(67% 69 45)";
}
function styleRight(el) {
  el.style.background = "lch(67% 69 127)";
}

function handleSwipeStart(event) {
  if (this.swipe.isDragging) return;
  this.swipe = new SwipeState(this);
  this.swipe.start(event);
  dispatch(this.swipeList, "start-swipe", this);
}
function handleSwipeMove(event) {
  if (!this.swipe.isDragging) return;
  this.swipe.update(event);
  const frac = this.swipe.styleFraction();
  const rotate = 10 * frac;
  const up = 10 * frac;
  this.style.transform = `translateX(${this.swipe.diffX}px) translateY(${up}px) rotate(${rotate}deg)`;
  this.style.background = "";
  if (this.swipe.swipeRight == true) {
    styleRight(this);
  } else if (this.swipe.swipeRight == false) {
    styleLeft(this);
  }
}
function eventX(event) {
  if (event.touches?.length > 0) {
    return event.touches[0].clientX;
  } else if (event.changedTouches?.length > 0) {
    return event.changedTouches[0].clientX;
  } else {
    return event.clientX;
  }
}
function handleSwipeEnd(event) {
  if (!this.swipe.isDragging) {
    return;
  }
  this.swipe.update(event);
  this.swipe.isDragging = false;
  dispatch(this.swipeList, "stop-swipe", this);
  if (this.swipe.swipeRight == true) {
    this.finishSwipeRight();
  } else if (this.swipe.swipeRight == false) {
    this.finishSwipeLeft();
  } else {
    this.style.transform = `translateX(0)`;
  }
}
function dispatch(el, name, detail) {
  el.dispatchEvent(
    new CustomEvent(name, { composed: true, bubbles: true, detail }),
  );
}

function enableScroll() {
  const scrollY = document.body.style.top;
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  window.scrollTo(0, parseInt(scrollY || "0") * -1);
}
function disableScroll() {
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${window.scrollY}px`;
}
