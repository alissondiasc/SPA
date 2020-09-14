import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { ApiProvider } from '../providers/api/api';


@Injectable()
export class WebsocketProvider {
  stompClient: any;
  socket: any;
  topic: string = "/topic/new.notificacao";

  constructor( private api: ApiProvider) {
    this._connect()
  }
  _connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(`${this.api.url}/notificacao`);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame) {
      _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
        console.log(sdkEvent)
      });
      //_this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);
  }
  // on error, schedule a reconnection attempt
  errorCallBack(error) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this._connect();
    }, 5000);
  }


  // private connect(cb, reconnect?) {
  //   console.log("entreou")
  //   if (!this.socket || reconnect) {
  //     this.socket = new SockJS(`${this.api.url}/notificacao`);
  //     this.stompClient = Stomp.over(this.socket);
  //     this.stompClient.debug = () => {};
  //
  //
  //
  //   }
  //   cb();
  // }

  public disconnect(callback, headers) {
    this.stompClient.disconnect(callback, headers);
  }

  // public sendOnSocket(url, obj) {
  //   if (!this.stompClient) {
  //     this.connect(() => {
  //       this.stompClient.send(url, {}, JSON.stringify(obj));
  //     });
  //   } else {
  //     this.stompClient.send(url, {}, JSON.stringify(obj));
  //   }
  // }

  // public subscribeOnSocket(url, cb) {
  //   if (!this.stompClient) {
  //     this.connect(() => {
  //       this.subscribe(url, cb);
  //     });
  //   } else {
  //     this.subscribe(url, cb);
  //   }
  // }

  // private subscribe(url: any, cb: any) {
  //   this.stompClient.connect(
  //     {},
  //     () => {
  //       try {
  //         this.stompClient.subscribe(url, (data) => {
  //           cb(data);
  //         });
  //       } catch (error) {
  //         this.disconnect(() => {
  //           this.connect(() => {
  //             this.subscribeOnSocket(url, cb);
  //           },           true);
  //         },              {});
  //       }
  //     },
  //     (error) => {
  //       console.log('websocket error ===> ', error);
  //       setTimeout(() => {
  //         this.disconnect(() => {
  //           this.connect(() => {
  //             this.subscribeOnSocket(url, cb);
  //           },           true);
  //         },              {});
  //       },         50000);
  //     },
  //   );
  // }
}
