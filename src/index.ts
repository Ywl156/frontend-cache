interface StoreData {
  value: Record<string, any> | string;
  __expire__: number | 'permanently';
}

interface CookieOptions {
  end?: number | string | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
}

const createStore = (storeType: 'local' | 'session' = 'local') => {
  const store = storeType === 'local' ? localStorage : sessionStorage;
  return {
    getItem(key: string): Record<string, any> | string | null {
      const dataStr = store.getItem(key);
      if (dataStr) {
        if (dataStr.includes('__expire__')) {
          const data: StoreData = JSON.parse(dataStr);
          if (data.__expire__ === 'permanently') {
            return data.value;
          } else if (data.__expire__ >= Date.now()) {
            return data.value;
          } else {
            store.removeItem(key);
          }
        } else {
          return dataStr;
        }
      }
      return null;
    },
    setItem(key: string, value: Record<string, any> | string, expire?: number) {
      store.setItem(
        key,
        JSON.stringify({
          value,
          __expire__: expire ?? 'permanently',
        })
      );
    },
    removeItem(ket: string) {
      store.removeItem(ket);
    },
    clear() {
      store.clear();
    },
  };
};

const frontendStore = {
  localStorage: {
    ...createStore('local'),
  },
  sessionStorage: {
    ...createStore('session'),
  },
  cookies: {
    getItem: function (key: string) {
      return (
        decodeURIComponent(
          document.cookie.replace(
            new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'),
            '$1'
          )
        ) || null
      );
    },
    setItem: function (key: string, value: string, options?: CookieOptions) {
      if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {
        return false;
      }
      let expires = '';
      const { end, domain, path, secure } = options || {};
      if (end) {
        switch (end.constructor) {
          case Number:
            expires = end === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + end;
            break;
          case String:
            expires = '; expires=' + end;
            break;
          case Date:
            expires = '; expires=' + (end as Date).toUTCString();
            break;
        }
      }
      document.cookie =
        encodeURIComponent(key) +
        '=' +
        encodeURIComponent(value) +
        expires +
        (domain ? '; domain=' + domain : '') +
        (path ? '; path=' + path : '') +
        (secure ? '; secure' : '');
      return true;
    },
    removeItem: function (key: string, path?: string, domain?: string) {
      if (!key || !this.hasItem(key)) {
        return false;
      }
      document.cookie =
        encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (domain ? '; domain=' + domain : '') + (path ? '; path=' + path : '');
      return true;
    },
    hasItem: function (key: string) {
      return new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=').test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
      let keys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
      for (let nIdx = 0; nIdx < keys.length; nIdx++) {
        keys[nIdx] = decodeURIComponent(keys[nIdx]);
      }
      return keys;
    },
  },
};

export default frontendStore;
