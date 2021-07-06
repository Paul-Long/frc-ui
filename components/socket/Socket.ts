const __socket: any = (function instanceInit() {
  let instance: any;
  return (newInstance: any) => {
    if (newInstance) instance = newInstance;

    Object.seal(instance);
    return instance;
  };
})();

interface OptionProps {
  host: string;
  path: string;
  userId: string;
  token: string;
}

class Socket {
  worker: any = null;
  _callbacks: any = {};

  constructor() {
    const instance: any = __socket();
    if (instance) {
      return instance;
    }
    this.off.bind(this);
    window.addEventListener('beforeunload', this.leave);
    __socket(this);
  }

  leave = () => {
    if (this.worker) {
      this.worker.close();
    }
  };
  start = (opt: OptionProps) => {
    const {userId, token, host, path} = opt;
    if (!userId || !token || !Object.prototype.hasOwnProperty.call(window, 'SharedWork')) {
      return;
    }
    if (this.worker) {
      return;
    }
    const option: any = {
      token: JSON.stringify({token}),
      query(data: any) {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error(e);
          return null;
        }
      }
    };
    // @ts-ignore
    this.worker = new window.SharedWork(`${host || ''}${path || ''}`, option);
    this.worker.on('login', (event: any) => {
      const {code} = event;
      if (code === 0) {
        console.log('Socket Login: ', event);
        this.emit('login', event);
      } else {
        console.log('Socket Login Fail: ', event);
        this.emit('login-fail', event);
      }
    });
    this.worker.on('connect', (event: any) => {
      console.log('Socket Connect : ', event);
      this.emit('connect', event);
    });
    this.worker.on('reconnect', (event: any) => {
      console.log('Socket Reconnect : ', event);
      this.emit('reconnect', event);
    });
    this.worker.on('close', (event: any) => {
      console.log('Socket Close : ', event);
      this.emit('close', event);
    });
    this.worker.on('error', (event: any) => {
      console.log('Socket Error : ', event);
      this.emit('error', event);
    });
    this.worker.on('message', (event: any) => {
      console.log('Socket Message : ', event);
      this.emit('message', event);
    });
  };

  on = (event: any, fn: any) => {
    this._callbacks = this._callbacks || {};
    (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
    return this;
  };

  off = (event: any, fn: any) => {
    this._callbacks = this._callbacks || {};

    if (!event && !fn) {
      this._callbacks = {};
      return this;
    }

    let callbacks = this._callbacks['$' + event];
    if (!callbacks) return this;

    if (!!event && !fn) {
      delete this._callbacks['$' + event];
      return this;
    }

    let cb;
    for (var i = 0; i < callbacks.length; i++) {
      cb = callbacks[i];
      if (cb === fn || cb.fn === fn) {
        callbacks.splice(i, 1);
        break;
      }
    }
    return this;
  };

  emit = (event: any, arg: any) => {
    this._callbacks = this._callbacks || {};
    // @ts-ignore
    let callbacks = this._callbacks['$' + event];

    if (callbacks) {
      callbacks = callbacks.slice(0);
      for (let i = 0, len = callbacks.length; i < len; ++i) {
        if (typeof callbacks[i] === 'function') callbacks[i](arg);
      }
    }

    return this;
  };
}

export default new Socket();
