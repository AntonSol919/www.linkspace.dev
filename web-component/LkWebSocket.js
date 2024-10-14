import {
    initShared,
    CONSTS,
    lk_deserialize,
    lk_serialize,
} from "../linkspace.js/linkspace.js";

export default class LkWebSocket extends WebSocket {
  _onpoint = undefined;
  buffer = new Uint8Array();
  receivedEmpty = false
  constructor(...args) {
    super(...args);
    this.addEventListener("message", async (msg) => {
        await initShared();
        if (msg.data.size == 0){
            if (!this.receivedEmpty) {
                console.log("websocket signals empty");
                this.receivedEmpty = true;
                // depending on the server - this can indicate it has stopped sending
                this.dispatchEvent(new CustomEvent("empty"));
            }
            return ;
        }
      let newBytes = new Uint8Array(await msg.data.arrayBuffer());
        
      if (this.buffer.length != 0) {

        let combined = new Uint8Array(this.buffer.length + newBytes.length);
        combined.set(this.buffer, 0);
        combined.set(newBytes, this.buffer.length);
        this.buffer = combined;
      } else {
        this.buffer = newBytes;
      }
      if (this._onpoint === undefined) return;

      this.flush();
    });
  }
  flush() {
    try {
      while (this.buffer.length >= CONSTS.MIN_POINT_SIZE) {
        let [point, nr] = lk_deserialize(this.buffer);
        this.recv += 1;
        this.buffer = nr;
        this._onpoint(point);
        this.dispatchEvent(
          new CustomEvent("point", {
            composed: true,
            bubbles: true,
            detail: point,
          }),
        );
      }
    } catch (e) {
      console.error("error in stream - closing", e);
      alert("error in stream " + e.message);
      this.dispatchEvent(new CustomEvent("error", { detail: error }));
      this.buffer = new Uint8Array();
      this.close();
      return;
    }
  }

  get onpoint() {
    return this._onpoint;
  }
  set onpoint(fnc) {
    this._onpoint = fnc;
    this.flush();
  }
  sendPoint(point) {
    return this.send(point);
  }
  // its always an error to send anything other than a point
  send(point) {
    return super.send(lk_serialize(point));
  }
}
