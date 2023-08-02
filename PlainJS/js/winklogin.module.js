function _inheritsLoose(e, t) {
    (e.prototype = Object.create(t.prototype)), (e.prototype.constructor = e), _setPrototypeOf(e, t);
  }
  function _setPrototypeOf(e, t) {
    return (
      (_setPrototypeOf = Object.setPrototypeOf
        ? Object.setPrototypeOf.bind()
        : function (e, t) {
            return (e.__proto__ = t), e;
          }),
      _setPrototypeOf(e, t)
    );
  }
  function _assertThisInitialized(e) {
    if (void 0 === e)
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e;
  }
  for (
    var byteLength_1 = byteLength,
      toByteArray_1 = toByteArray,
      fromByteArray_1 = fromByteArray,
      lookup = [],
      revLookup = [],
      Arr = 'undefined' != typeof Uint8Array ? Uint8Array : Array,
      code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      i = 0,
      len = code.length;
    i < len;
    ++i
  )
    (lookup[i] = code[i]), (revLookup[code.charCodeAt(i)] = i);
  function getLens(e) {
    var t = e.length;
    if (t % 4 > 0) throw new Error('Invalid string. Length must be a multiple of 4');
    var n = e.indexOf('=');
    return -1 === n && (n = t), [n, n === t ? 0 : 4 - (n % 4)];
  }
  function byteLength(e) {
    var t = getLens(e),
      n = t[1];
    return (3 * (t[0] + n)) / 4 - n;
  }
  function _byteLength(e, t, n) {
    return (3 * (t + n)) / 4 - n;
  }
  function toByteArray(e) {
    var t,
      n,
      r = getLens(e),
      o = r[0],
      i = r[1],
      s = new Arr(_byteLength(e, o, i)),
      a = 0,
      c = i > 0 ? o - 4 : o;
    for (n = 0; n < c; n += 4)
      (t =
        (revLookup[e.charCodeAt(n)] << 18) |
        (revLookup[e.charCodeAt(n + 1)] << 12) |
        (revLookup[e.charCodeAt(n + 2)] << 6) |
        revLookup[e.charCodeAt(n + 3)]),
        (s[a++] = (t >> 16) & 255),
        (s[a++] = (t >> 8) & 255),
        (s[a++] = 255 & t);
    return (
      2 === i &&
        ((t = (revLookup[e.charCodeAt(n)] << 2) | (revLookup[e.charCodeAt(n + 1)] >> 4)),
        (s[a++] = 255 & t)),
      1 === i &&
        ((t =
          (revLookup[e.charCodeAt(n)] << 10) |
          (revLookup[e.charCodeAt(n + 1)] << 4) |
          (revLookup[e.charCodeAt(n + 2)] >> 2)),
        (s[a++] = (t >> 8) & 255),
        (s[a++] = 255 & t)),
      s
    );
  }
  function tripletToBase64(e) {
    return lookup[(e >> 18) & 63] + lookup[(e >> 12) & 63] + lookup[(e >> 6) & 63] + lookup[63 & e];
  }
  function encodeChunk(e, t, n) {
    for (var r = [], o = t; o < n; o += 3)
      r.push(
        tripletToBase64(((e[o] << 16) & 16711680) + ((e[o + 1] << 8) & 65280) + (255 & e[o + 2]))
      );
    return r.join('');
  }
  function fromByteArray(e) {
    for (var t, n = e.length, r = n % 3, o = [], i = 16383, s = 0, a = n - r; s < a; s += i)
      o.push(encodeChunk(e, s, s + i > a ? a : s + i));
    return (
      1 === r
        ? o.push(lookup[(t = e[n - 1]) >> 2] + lookup[(t << 4) & 63] + '==')
        : 2 === r &&
          o.push(
            lookup[(t = (e[n - 2] << 8) + e[n - 1]) >> 10] +
              lookup[(t >> 4) & 63] +
              lookup[(t << 2) & 63] +
              '='
          ),
      o.join('')
    );
  }
  (revLookup['-'.charCodeAt(0)] = 62), (revLookup['_'.charCodeAt(0)] = 63);
  var base64Js = {
      byteLength: byteLength_1,
      toByteArray: toByteArray_1,
      fromByteArray: fromByteArray_1,
    },
    commonjsGlobal =
      'undefined' != typeof globalThis
        ? globalThis
        : 'undefined' != typeof window
        ? window
        : 'undefined' != typeof global
        ? global
        : 'undefined' != typeof self
        ? self
        : {};
  function createCommonjsModule(e) {
    var t = { exports: {} };
    return e(t, t.exports), t.exports;
  }
  var sha256 = createCommonjsModule(function (module) {
    (function () {
      var ERROR = 'input is invalid type',
        WINDOW = 'object' == typeof window,
        root = WINDOW ? window : {};
      root.JS_SHA256_NO_WINDOW && (WINDOW = !1);
      var WEB_WORKER = !WINDOW && 'object' == typeof self,
        NODE_JS =
          !root.JS_SHA256_NO_NODE_JS &&
          'object' == typeof process &&
          process.versions &&
          process.versions.node;
      NODE_JS ? (root = commonjsGlobal) : WEB_WORKER && (root = self);
      var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && module.exports,
        ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && 'undefined' != typeof ArrayBuffer,
        HEX_CHARS = '0123456789abcdef'.split(''),
        EXTRA = [-2147483648, 8388608, 32768, 128],
        SHIFT = [24, 16, 8, 0],
        K = [
          1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748,
          2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206,
          2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122,
          1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891,
          3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700,
          1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771,
          3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877,
          958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452,
          2361852424, 2428436474, 2756734187, 3204031479, 3329325298,
        ],
        OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'],
        blocks = [];
      (!root.JS_SHA256_NO_NODE_JS && Array.isArray) ||
        (Array.isArray = function (e) {
          return '[object Array]' === Object.prototype.toString.call(e);
        }),
        !ARRAY_BUFFER ||
          (!root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView) ||
          (ArrayBuffer.isView = function (e) {
            return 'object' == typeof e && e.buffer && e.buffer.constructor === ArrayBuffer;
          });
      var createOutputMethod = function (e, t) {
          return function (n) {
            return new Sha256(t, !0).update(n)[e]();
          };
        },
        createMethod = function (e) {
          var t = createOutputMethod('hex', e);
          NODE_JS && (t = nodeWrap(t, e)),
            (t.create = function () {
              return new Sha256(e);
            }),
            (t.update = function (e) {
              return t.create().update(e);
            });
          for (var n = 0; n < OUTPUT_TYPES.length; ++n) {
            var r = OUTPUT_TYPES[n];
            t[r] = createOutputMethod(r, e);
          }
          return t;
        },
        nodeWrap = function (method, is224) {
          var crypto = eval("require('crypto')"),
            Buffer = eval("require('buffer').Buffer"),
            algorithm = is224 ? 'sha224' : 'sha256',
            nodeMethod = function (e) {
              if ('string' == typeof e)
                return crypto.createHash(algorithm).update(e, 'utf8').digest('hex');
              if (null == e) throw new Error(ERROR);
              return (
                e.constructor === ArrayBuffer && (e = new Uint8Array(e)),
                Array.isArray(e) || ArrayBuffer.isView(e) || e.constructor === Buffer
                  ? crypto.createHash(algorithm).update(new Buffer(e)).digest('hex')
                  : method(e)
              );
            };
          return nodeMethod;
        },
        createHmacOutputMethod = function (e, t) {
          return function (n, r) {
            return new HmacSha256(n, t, !0).update(r)[e]();
          };
        },
        createHmacMethod = function (e) {
          var t = createHmacOutputMethod('hex', e);
          (t.create = function (t) {
            return new HmacSha256(t, e);
          }),
            (t.update = function (e, n) {
              return t.create(e).update(n);
            });
          for (var n = 0; n < OUTPUT_TYPES.length; ++n) {
            var r = OUTPUT_TYPES[n];
            t[r] = createHmacOutputMethod(r, e);
          }
          return t;
        };
      function Sha256(e, t) {
        t
          ? ((blocks[0] =
              blocks[16] =
              blocks[1] =
              blocks[2] =
              blocks[3] =
              blocks[4] =
              blocks[5] =
              blocks[6] =
              blocks[7] =
              blocks[8] =
              blocks[9] =
              blocks[10] =
              blocks[11] =
              blocks[12] =
              blocks[13] =
              blocks[14] =
              blocks[15] =
                0),
            (this.blocks = blocks))
          : (this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
          e
            ? ((this.h0 = 3238371032),
              (this.h1 = 914150663),
              (this.h2 = 812702999),
              (this.h3 = 4144912697),
              (this.h4 = 4290775857),
              (this.h5 = 1750603025),
              (this.h6 = 1694076839),
              (this.h7 = 3204075428))
            : ((this.h0 = 1779033703),
              (this.h1 = 3144134277),
              (this.h2 = 1013904242),
              (this.h3 = 2773480762),
              (this.h4 = 1359893119),
              (this.h5 = 2600822924),
              (this.h6 = 528734635),
              (this.h7 = 1541459225)),
          (this.block = this.start = this.bytes = this.hBytes = 0),
          (this.finalized = this.hashed = !1),
          (this.first = !0),
          (this.is224 = e);
      }
      function HmacSha256(e, t, n) {
        var r,
          o = typeof e;
        if ('string' === o) {
          var i,
            s = [],
            a = e.length,
            c = 0;
          for (r = 0; r < a; ++r)
            (i = e.charCodeAt(r)) < 128
              ? (s[c++] = i)
              : i < 2048
              ? ((s[c++] = 192 | (i >> 6)), (s[c++] = 128 | (63 & i)))
              : i < 55296 || i >= 57344
              ? ((s[c++] = 224 | (i >> 12)),
                (s[c++] = 128 | ((i >> 6) & 63)),
                (s[c++] = 128 | (63 & i)))
              : ((i = 65536 + (((1023 & i) << 10) | (1023 & e.charCodeAt(++r)))),
                (s[c++] = 240 | (i >> 18)),
                (s[c++] = 128 | ((i >> 12) & 63)),
                (s[c++] = 128 | ((i >> 6) & 63)),
                (s[c++] = 128 | (63 & i)));
          e = s;
        } else {
          if ('object' !== o) throw new Error(ERROR);
          if (null === e) throw new Error(ERROR);
          if (ARRAY_BUFFER && e.constructor === ArrayBuffer) e = new Uint8Array(e);
          else if (!(Array.isArray(e) || (ARRAY_BUFFER && ArrayBuffer.isView(e))))
            throw new Error(ERROR);
        }
        e.length > 64 && (e = new Sha256(t, !0).update(e).array());
        var l = [],
          u = [];
        for (r = 0; r < 64; ++r) {
          var d = e[r] || 0;
          (l[r] = 92 ^ d), (u[r] = 54 ^ d);
        }
        Sha256.call(this, t, n),
          this.update(u),
          (this.oKeyPad = l),
          (this.inner = !0),
          (this.sharedMemory = n);
      }
      (Sha256.prototype.update = function (e) {
        if (!this.finalized) {
          var t,
            n = typeof e;
          if ('string' !== n) {
            if ('object' !== n) throw new Error(ERROR);
            if (null === e) throw new Error(ERROR);
            if (ARRAY_BUFFER && e.constructor === ArrayBuffer) e = new Uint8Array(e);
            else if (!(Array.isArray(e) || (ARRAY_BUFFER && ArrayBuffer.isView(e))))
              throw new Error(ERROR);
            t = !0;
          }
          for (var r, o, i = 0, s = e.length, a = this.blocks; i < s; ) {
            if (
              (this.hashed &&
                ((this.hashed = !1),
                (a[0] = this.block),
                (a[16] =
                  a[1] =
                  a[2] =
                  a[3] =
                  a[4] =
                  a[5] =
                  a[6] =
                  a[7] =
                  a[8] =
                  a[9] =
                  a[10] =
                  a[11] =
                  a[12] =
                  a[13] =
                  a[14] =
                  a[15] =
                    0)),
              t)
            )
              for (o = this.start; i < s && o < 64; ++i) a[o >> 2] |= e[i] << SHIFT[3 & o++];
            else
              for (o = this.start; i < s && o < 64; ++i)
                (r = e.charCodeAt(i)) < 128
                  ? (a[o >> 2] |= r << SHIFT[3 & o++])
                  : r < 2048
                  ? ((a[o >> 2] |= (192 | (r >> 6)) << SHIFT[3 & o++]),
                    (a[o >> 2] |= (128 | (63 & r)) << SHIFT[3 & o++]))
                  : r < 55296 || r >= 57344
                  ? ((a[o >> 2] |= (224 | (r >> 12)) << SHIFT[3 & o++]),
                    (a[o >> 2] |= (128 | ((r >> 6) & 63)) << SHIFT[3 & o++]),
                    (a[o >> 2] |= (128 | (63 & r)) << SHIFT[3 & o++]))
                  : ((r = 65536 + (((1023 & r) << 10) | (1023 & e.charCodeAt(++i)))),
                    (a[o >> 2] |= (240 | (r >> 18)) << SHIFT[3 & o++]),
                    (a[o >> 2] |= (128 | ((r >> 12) & 63)) << SHIFT[3 & o++]),
                    (a[o >> 2] |= (128 | ((r >> 6) & 63)) << SHIFT[3 & o++]),
                    (a[o >> 2] |= (128 | (63 & r)) << SHIFT[3 & o++]));
            (this.lastByteIndex = o),
              (this.bytes += o - this.start),
              o >= 64
                ? ((this.block = a[16]), (this.start = o - 64), this.hash(), (this.hashed = !0))
                : (this.start = o);
          }
          return (
            this.bytes > 4294967295 &&
              ((this.hBytes += (this.bytes / 4294967296) << 0),
              (this.bytes = this.bytes % 4294967296)),
            this
          );
        }
      }),
        (Sha256.prototype.finalize = function () {
          if (!this.finalized) {
            this.finalized = !0;
            var e = this.blocks,
              t = this.lastByteIndex;
            (e[16] = this.block),
              (e[t >> 2] |= EXTRA[3 & t]),
              (this.block = e[16]),
              t >= 56 &&
                (this.hashed || this.hash(),
                (e[0] = this.block),
                (e[16] =
                  e[1] =
                  e[2] =
                  e[3] =
                  e[4] =
                  e[5] =
                  e[6] =
                  e[7] =
                  e[8] =
                  e[9] =
                  e[10] =
                  e[11] =
                  e[12] =
                  e[13] =
                  e[14] =
                  e[15] =
                    0)),
              (e[14] = (this.hBytes << 3) | (this.bytes >>> 29)),
              (e[15] = this.bytes << 3),
              this.hash();
          }
        }),
        (Sha256.prototype.hash = function () {
          var e,
            t,
            n,
            r,
            o,
            i,
            s = this.h0,
            a = this.h1,
            c = this.h2,
            l = this.h3,
            u = this.h4,
            d = this.h5,
            h = this.h6,
            f = this.h7,
            p = this.blocks;
          for (e = 16; e < 64; ++e)
            p[e] =
              (p[e - 16] +
                ((((t = p[e - 15]) >>> 7) | (t << 25)) ^ ((t >>> 18) | (t << 14)) ^ (t >>> 3)) +
                p[e - 7] +
                ((((t = p[e - 2]) >>> 17) | (t << 15)) ^ ((t >>> 19) | (t << 13)) ^ (t >>> 10))) <<
              0;
          for (i = a & c, e = 0; e < 64; e += 4)
            this.first
              ? (this.is224
                  ? ((n = 300032),
                    (f = ((t = p[0] - 1413257819) - 150054599) << 0),
                    (l = (t + 24177077) << 0))
                  : ((n = 704751109),
                    (f = ((t = p[0] - 210244248) - 1521486534) << 0),
                    (l = (t + 143694565) << 0)),
                (this.first = !1))
              : ((f =
                  (l +
                    (t =
                      f +
                      (((u >>> 6) | (u << 26)) ^ ((u >>> 11) | (u << 21)) ^ ((u >>> 25) | (u << 7))) +
                      ((u & d) ^ (~u & h)) +
                      K[e] +
                      p[e])) <<
                  0),
                (l =
                  (t +
                    ((((s >>> 2) | (s << 30)) ^ ((s >>> 13) | (s << 19)) ^ ((s >>> 22) | (s << 10))) +
                      ((n = s & a) ^ (s & c) ^ i))) <<
                  0)),
              (h =
                (c +
                  (t =
                    h +
                    (((f >>> 6) | (f << 26)) ^ ((f >>> 11) | (f << 21)) ^ ((f >>> 25) | (f << 7))) +
                    ((f & u) ^ (~f & d)) +
                    K[e + 1] +
                    p[e + 1])) <<
                0),
              (c =
                (t +
                  ((((l >>> 2) | (l << 30)) ^ ((l >>> 13) | (l << 19)) ^ ((l >>> 22) | (l << 10))) +
                    ((r = l & s) ^ (l & a) ^ n))) <<
                0),
              (d =
                (a +
                  (t =
                    d +
                    (((h >>> 6) | (h << 26)) ^ ((h >>> 11) | (h << 21)) ^ ((h >>> 25) | (h << 7))) +
                    ((h & f) ^ (~h & u)) +
                    K[e + 2] +
                    p[e + 2])) <<
                0),
              (a =
                (t +
                  ((((c >>> 2) | (c << 30)) ^ ((c >>> 13) | (c << 19)) ^ ((c >>> 22) | (c << 10))) +
                    ((o = c & l) ^ (c & s) ^ r))) <<
                0),
              (u =
                (s +
                  (t =
                    u +
                    (((d >>> 6) | (d << 26)) ^ ((d >>> 11) | (d << 21)) ^ ((d >>> 25) | (d << 7))) +
                    ((d & h) ^ (~d & f)) +
                    K[e + 3] +
                    p[e + 3])) <<
                0),
              (s =
                (t +
                  ((((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))) +
                    ((i = a & c) ^ (a & l) ^ o))) <<
                0);
          (this.h0 = (this.h0 + s) << 0),
            (this.h1 = (this.h1 + a) << 0),
            (this.h2 = (this.h2 + c) << 0),
            (this.h3 = (this.h3 + l) << 0),
            (this.h4 = (this.h4 + u) << 0),
            (this.h5 = (this.h5 + d) << 0),
            (this.h6 = (this.h6 + h) << 0),
            (this.h7 = (this.h7 + f) << 0);
        }),
        (Sha256.prototype.hex = function () {
          this.finalize();
          var e = this.h0,
            t = this.h1,
            n = this.h2,
            r = this.h3,
            o = this.h4,
            i = this.h5,
            s = this.h6,
            a = this.h7,
            c =
              HEX_CHARS[(e >> 28) & 15] +
              HEX_CHARS[(e >> 24) & 15] +
              HEX_CHARS[(e >> 20) & 15] +
              HEX_CHARS[(e >> 16) & 15] +
              HEX_CHARS[(e >> 12) & 15] +
              HEX_CHARS[(e >> 8) & 15] +
              HEX_CHARS[(e >> 4) & 15] +
              HEX_CHARS[15 & e] +
              HEX_CHARS[(t >> 28) & 15] +
              HEX_CHARS[(t >> 24) & 15] +
              HEX_CHARS[(t >> 20) & 15] +
              HEX_CHARS[(t >> 16) & 15] +
              HEX_CHARS[(t >> 12) & 15] +
              HEX_CHARS[(t >> 8) & 15] +
              HEX_CHARS[(t >> 4) & 15] +
              HEX_CHARS[15 & t] +
              HEX_CHARS[(n >> 28) & 15] +
              HEX_CHARS[(n >> 24) & 15] +
              HEX_CHARS[(n >> 20) & 15] +
              HEX_CHARS[(n >> 16) & 15] +
              HEX_CHARS[(n >> 12) & 15] +
              HEX_CHARS[(n >> 8) & 15] +
              HEX_CHARS[(n >> 4) & 15] +
              HEX_CHARS[15 & n] +
              HEX_CHARS[(r >> 28) & 15] +
              HEX_CHARS[(r >> 24) & 15] +
              HEX_CHARS[(r >> 20) & 15] +
              HEX_CHARS[(r >> 16) & 15] +
              HEX_CHARS[(r >> 12) & 15] +
              HEX_CHARS[(r >> 8) & 15] +
              HEX_CHARS[(r >> 4) & 15] +
              HEX_CHARS[15 & r] +
              HEX_CHARS[(o >> 28) & 15] +
              HEX_CHARS[(o >> 24) & 15] +
              HEX_CHARS[(o >> 20) & 15] +
              HEX_CHARS[(o >> 16) & 15] +
              HEX_CHARS[(o >> 12) & 15] +
              HEX_CHARS[(o >> 8) & 15] +
              HEX_CHARS[(o >> 4) & 15] +
              HEX_CHARS[15 & o] +
              HEX_CHARS[(i >> 28) & 15] +
              HEX_CHARS[(i >> 24) & 15] +
              HEX_CHARS[(i >> 20) & 15] +
              HEX_CHARS[(i >> 16) & 15] +
              HEX_CHARS[(i >> 12) & 15] +
              HEX_CHARS[(i >> 8) & 15] +
              HEX_CHARS[(i >> 4) & 15] +
              HEX_CHARS[15 & i] +
              HEX_CHARS[(s >> 28) & 15] +
              HEX_CHARS[(s >> 24) & 15] +
              HEX_CHARS[(s >> 20) & 15] +
              HEX_CHARS[(s >> 16) & 15] +
              HEX_CHARS[(s >> 12) & 15] +
              HEX_CHARS[(s >> 8) & 15] +
              HEX_CHARS[(s >> 4) & 15] +
              HEX_CHARS[15 & s];
          return (
            this.is224 ||
              (c +=
                HEX_CHARS[(a >> 28) & 15] +
                HEX_CHARS[(a >> 24) & 15] +
                HEX_CHARS[(a >> 20) & 15] +
                HEX_CHARS[(a >> 16) & 15] +
                HEX_CHARS[(a >> 12) & 15] +
                HEX_CHARS[(a >> 8) & 15] +
                HEX_CHARS[(a >> 4) & 15] +
                HEX_CHARS[15 & a]),
            c
          );
        }),
        (Sha256.prototype.toString = Sha256.prototype.hex),
        (Sha256.prototype.digest = function () {
          this.finalize();
          var e = this.h0,
            t = this.h1,
            n = this.h2,
            r = this.h3,
            o = this.h4,
            i = this.h5,
            s = this.h6,
            a = this.h7,
            c = [
              (e >> 24) & 255,
              (e >> 16) & 255,
              (e >> 8) & 255,
              255 & e,
              (t >> 24) & 255,
              (t >> 16) & 255,
              (t >> 8) & 255,
              255 & t,
              (n >> 24) & 255,
              (n >> 16) & 255,
              (n >> 8) & 255,
              255 & n,
              (r >> 24) & 255,
              (r >> 16) & 255,
              (r >> 8) & 255,
              255 & r,
              (o >> 24) & 255,
              (o >> 16) & 255,
              (o >> 8) & 255,
              255 & o,
              (i >> 24) & 255,
              (i >> 16) & 255,
              (i >> 8) & 255,
              255 & i,
              (s >> 24) & 255,
              (s >> 16) & 255,
              (s >> 8) & 255,
              255 & s,
            ];
          return this.is224 || c.push((a >> 24) & 255, (a >> 16) & 255, (a >> 8) & 255, 255 & a), c;
        }),
        (Sha256.prototype.array = Sha256.prototype.digest),
        (Sha256.prototype.arrayBuffer = function () {
          this.finalize();
          var e = new ArrayBuffer(this.is224 ? 28 : 32),
            t = new DataView(e);
          return (
            t.setUint32(0, this.h0),
            t.setUint32(4, this.h1),
            t.setUint32(8, this.h2),
            t.setUint32(12, this.h3),
            t.setUint32(16, this.h4),
            t.setUint32(20, this.h5),
            t.setUint32(24, this.h6),
            this.is224 || t.setUint32(28, this.h7),
            e
          );
        }),
        (HmacSha256.prototype = new Sha256()),
        (HmacSha256.prototype.finalize = function () {
          if ((Sha256.prototype.finalize.call(this), this.inner)) {
            this.inner = !1;
            var e = this.array();
            Sha256.call(this, this.is224, this.sharedMemory),
              this.update(this.oKeyPad),
              this.update(e),
              Sha256.prototype.finalize.call(this);
          }
        });
      var exports = createMethod();
      (exports.sha256 = exports),
        (exports.sha224 = createMethod(!0)),
        (exports.sha256.hmac = createHmacMethod()),
        (exports.sha224.hmac = createHmacMethod(!0)),
        COMMON_JS
          ? (module.exports = exports)
          : ((root.sha256 = exports.sha256), (root.sha224 = exports.sha224));
    })();
  });
  if ('undefined' == typeof Promise)
    throw Error(
      'Keycloak requires an environment that supports Promises. Make sure that you include the appropriate polyfill.'
    );
  var loggedPromiseDeprecation = !1,
    refreshButtonInterval,
    _wlk;
  function logPromiseDeprecation() {
    loggedPromiseDeprecation ||
      ((loggedPromiseDeprecation = !0),
      console.warn(
        '[KEYCLOAK] Usage of legacy style promise methods such as `.error()` and `.success()` has been deprecated and support will be removed in future versions. Use standard style promise methods such as `.then() and `.catch()` instead.'
      ));
  }
  function Keycloak(e) {
    if (!(this instanceof Keycloak)) return new Keycloak(e);
    for (
      var t,
        n,
        r = this,
        o = [],
        i = { enable: !0, callbackList: [], interval: 5 },
        s = document.getElementsByTagName('script'),
        a = 0;
      a < s.length;
      a++
    )
      (-1 === s[a].src.indexOf('keycloak.js') && -1 === s[a].src.indexOf('keycloak.min.js')) ||
        -1 === s[a].src.indexOf('version=') ||
        (r.iframeVersion = s[a].src.substring(s[a].src.indexOf('version=') + 8).split('&')[0]);
    var c = !0,
      l = T(console.info),
      u = T(console.warn);
    function d(e, t) {
      for (
        var n = (function (e) {
            var t = null,
              n = window.crypto || window.msCrypto;
            if (n && n.getRandomValues && window.Uint8Array)
              return (t = new Uint8Array(e)), n.getRandomValues(t), t;
            t = new Array(e);
            for (var r = 0; r < t.length; r++) t[r] = Math.floor(256 * Math.random());
            return t;
          })(e),
          r = new Array(e),
          o = 0;
        o < e;
        o++
      )
        r[o] = t.charCodeAt(n[o] % t.length);
      return String.fromCharCode.apply(null, r);
    }
    function h() {
      return void 0 !== r.authServerUrl
        ? '/' == r.authServerUrl.charAt(r.authServerUrl.length - 1)
          ? r.authServerUrl + 'realms/' + encodeURIComponent(r.realm)
          : r.authServerUrl + '/realms/' + encodeURIComponent(r.realm)
        : void 0;
    }
    function f(e, t) {
      var n = e.code,
        o = e.error,
        i = e.prompt,
        s = new Date().getTime();
      if ((e.kc_action_status && r.onActionUpdate && r.onActionUpdate(e.kc_action_status), o))
        if ('none' != i) {
          var a = { error: o, error_description: e.error_description };
          r.onAuthError && r.onAuthError(a), t && t.setError(a);
        } else t && t.setSuccess();
      else if (
        ('standard' != r.flow &&
          (e.access_token || e.id_token) &&
          f(e.access_token, null, e.id_token, !0),
        'implicit' != r.flow && n)
      ) {
        var u = 'code=' + n + '&grant_type=authorization_code',
          d = r.endpoints.token(),
          h = new XMLHttpRequest();
        h.open('POST', d, !0),
          h.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'),
          (u += '&client_id=' + encodeURIComponent(r.clientId)),
          (u += '&redirect_uri=' + e.redirectUri),
          e.pkceCodeVerifier && (u += '&code_verifier=' + e.pkceCodeVerifier),
          (h.withCredentials = !0),
          (h.onreadystatechange = function () {
            if (4 == h.readyState)
              if (200 == h.status) {
                var e = JSON.parse(h.responseText);
                f(e.access_token, e.refresh_token, e.id_token, 'standard' === r.flow), S();
              } else r.onAuthError && r.onAuthError(), t && t.setError();
          }),
          h.send(u);
      }
      function f(n, o, i, a) {
        k(n, o, i, (s = (s + new Date().getTime()) / 2)),
          c &&
          ((r.tokenParsed && r.tokenParsed.nonce != e.storedNonce) ||
            (r.refreshTokenParsed && r.refreshTokenParsed.nonce != e.storedNonce) ||
            (r.idTokenParsed && r.idTokenParsed.nonce != e.storedNonce))
            ? (l('[KEYCLOAK] Invalid nonce, clearing token'), r.clearToken(), t && t.setError())
            : a && (r.onAuthSuccess && r.onAuthSuccess(), t && t.setSuccess());
      }
    }
    function p(e) {
      return 0 == e.status && e.responseText && e.responseURL.startsWith('file:');
    }
    function k(e, t, n, o) {
      if (
        (r.tokenTimeoutHandle && (clearTimeout(r.tokenTimeoutHandle), (r.tokenTimeoutHandle = null)),
        t
          ? ((r.refreshToken = t), (r.refreshTokenParsed = m(t)))
          : (delete r.refreshToken, delete r.refreshTokenParsed),
        n ? ((r.idToken = n), (r.idTokenParsed = m(n))) : (delete r.idToken, delete r.idTokenParsed),
        e)
      ) {
        if (
          ((r.token = e),
          (r.tokenParsed = m(e)),
          (r.sessionId = r.tokenParsed.session_state),
          (r.authenticated = !0),
          (r.subject = r.tokenParsed.sub),
          (r.realmAccess = r.tokenParsed.realm_access),
          (r.resourceAccess = r.tokenParsed.resource_access),
          o && (r.timeSkew = Math.floor(o / 1e3) - r.tokenParsed.iat),
          null != r.timeSkew &&
            (l(
              '[KEYCLOAK] Estimated time difference between browser and server is ' +
                r.timeSkew +
                ' seconds'
            ),
            r.onTokenExpired))
        ) {
          var i = 1e3 * (r.tokenParsed.exp - new Date().getTime() / 1e3 + r.timeSkew);
          l('[KEYCLOAK] Token expires in ' + Math.round(i / 1e3) + ' s'),
            i <= 0 ? r.onTokenExpired() : (r.tokenTimeoutHandle = setTimeout(r.onTokenExpired, i));
        }
      } else
        delete r.token,
          delete r.tokenParsed,
          delete r.subject,
          delete r.realmAccess,
          delete r.resourceAccess,
          (r.authenticated = !1);
    }
    function m(e) {
      switch ((e = (e = (e = e.split('.')[1]).replace(/-/g, '+')).replace(/_/g, '/')).length % 4) {
        case 0:
          break;
        case 2:
          e += '==';
          break;
        case 3:
          e += '=';
          break;
        default:
          throw 'Invalid token';
      }
      return (e = decodeURIComponent(escape(atob(e)))), JSON.parse(e);
    }
    function w() {
      var e = '0123456789abcdef',
        t = d(36, e).split('');
      return (
        (t[14] = '4'),
        (t[19] = e.substr((3 & t[19]) | 8, 1)),
        (t[8] = t[13] = t[18] = t[23] = '-'),
        t.join('')
      );
    }
    function g(e) {
      var t = (function (e) {
        var t;
        switch (r.flow) {
          case 'standard':
            t = ['code', 'state', 'session_state', 'kc_action_status'];
            break;
          case 'implicit':
            t = [
              'access_token',
              'token_type',
              'id_token',
              'state',
              'session_state',
              'expires_in',
              'kc_action_status',
            ];
            break;
          case 'hybrid':
            t = [
              'access_token',
              'token_type',
              'id_token',
              'code',
              'state',
              'session_state',
              'expires_in',
              'kc_action_status',
            ];
        }
        t.push('error'), t.push('error_description'), t.push('error_uri');
        var n,
          o,
          i = e.indexOf('?'),
          s = e.indexOf('#');
        if (
          ('query' === r.responseMode && -1 !== i
            ? ((n = e.substring(0, i)),
              '' !== (o = v(e.substring(i + 1, -1 !== s ? s : e.length), t)).paramsString &&
                (n += '?' + o.paramsString),
              -1 !== s && (n += e.substring(s)))
            : 'fragment' === r.responseMode &&
              -1 !== s &&
              ((n = e.substring(0, s)),
              '' !== (o = v(e.substring(s + 1), t)).paramsString && (n += '#' + o.paramsString)),
          o && o.oauthParams)
        )
          if ('standard' === r.flow || 'hybrid' === r.flow) {
            if ((o.oauthParams.code || o.oauthParams.error) && o.oauthParams.state)
              return (o.oauthParams.newUrl = n), o.oauthParams;
          } else if (
            'implicit' === r.flow &&
            (o.oauthParams.access_token || o.oauthParams.error) &&
            o.oauthParams.state
          )
            return (o.oauthParams.newUrl = n), o.oauthParams;
      })(e);
      if (t) {
        var o = n.get(t.state);
        return (
          o &&
            ((t.valid = !0),
            (t.redirectUri = o.redirectUri),
            (t.storedNonce = o.nonce),
            (t.prompt = o.prompt),
            (t.pkceCodeVerifier = o.pkceCodeVerifier)),
          t
        );
      }
    }
    function v(e, t) {
      for (
        var n = e.split('&'), r = { paramsString: '', oauthParams: {} }, o = 0;
        o < n.length;
        o++
      ) {
        var i = n[o].indexOf('='),
          s = n[o].slice(0, i);
        -1 !== t.indexOf(s)
          ? (r.oauthParams[s] = n[o].slice(i + 1))
          : ('' !== r.paramsString && (r.paramsString += '&'), (r.paramsString += n[o]));
      }
      return r;
    }
    function _() {
      var e = {
        setSuccess: function (t) {
          e.resolve(t);
        },
        setError: function (t) {
          e.reject(t);
        },
      };
      return (
        (e.promise = new Promise(function (t, n) {
          (e.resolve = t), (e.reject = n);
        })),
        (e.promise.success = function (e) {
          return (
            logPromiseDeprecation(),
            this.then(function (t) {
              e(t);
            }),
            this
          );
        }),
        (e.promise.error = function (e) {
          return (
            logPromiseDeprecation(),
            this.catch(function (t) {
              e(t);
            }),
            this
          );
        }),
        e
      );
    }
    function y() {
      var e = _();
      if (!i.enable) return e.setSuccess(), e.promise;
      if (i.iframe) return e.setSuccess(), e.promise;
      var t = document.createElement('iframe');
      (i.iframe = t),
        (t.onload = function () {
          var t = r.endpoints.authorize();
          (i.iframeOrigin =
            '/' === t.charAt(0)
              ? window.location.origin
                ? window.location.origin
                : window.location.protocol +
                  '//' +
                  window.location.hostname +
                  (window.location.port ? ':' + window.location.port : '')
              : t.substring(0, t.indexOf('/', 8))),
            e.setSuccess();
        });
      var n = r.endpoints.checkSessionIframe();
      return (
        t.setAttribute('src', n),
        t.setAttribute('title', 'keycloak-session-iframe'),
        (t.style.display = 'none'),
        document.body.appendChild(t),
        window.addEventListener(
          'message',
          function (e) {
            if (
              e.origin === i.iframeOrigin &&
              i.iframe.contentWindow === e.source &&
              ('unchanged' == e.data || 'changed' == e.data || 'error' == e.data)
            ) {
              'unchanged' != e.data && r.clearToken();
              for (
                var t = i.callbackList.splice(0, i.callbackList.length), n = t.length - 1;
                n >= 0;
                --n
              ) {
                var o = t[n];
                'error' == e.data ? o.setError() : o.setSuccess('unchanged' == e.data);
              }
            }
          },
          !1
        ),
        e.promise
      );
    }
    function S() {
      i.enable &&
        r.token &&
        setTimeout(function () {
          b().then(function (e) {
            e && S();
          });
        }, 1e3 * i.interval);
    }
    function b() {
      var e = _();
      if (i.iframe && i.iframeOrigin) {
        var t = r.clientId + ' ' + (r.sessionId ? r.sessionId : '');
        i.callbackList.push(e),
          1 == i.callbackList.length && i.iframe.contentWindow.postMessage(t, i.iframeOrigin);
      } else e.setSuccess();
      return e.promise;
    }
    function R() {
      var e = _();
      if (i.enable || r.silentCheckSsoRedirectUri) {
        var t = document.createElement('iframe');
        t.setAttribute('src', r.endpoints.thirdPartyCookiesIframe()),
          t.setAttribute('title', 'keycloak-3p-check-iframe'),
          (t.style.display = 'none'),
          document.body.appendChild(t),
          window.addEventListener(
            'message',
            function n(o) {
              t.contentWindow === o.source &&
                (('supported' !== o.data && 'unsupported' !== o.data) ||
                  ('unsupported' === o.data &&
                    ((i.enable = !1),
                    r.silentCheckSsoFallback && (r.silentCheckSsoRedirectUri = !1),
                    u(
                      "[KEYCLOAK] 3rd party cookies aren't supported by this browser. checkLoginIframe and silent check-sso are not available."
                    )),
                  document.body.removeChild(t),
                  window.removeEventListener('message', n),
                  e.setSuccess()));
            },
            !1
          );
      } else e.setSuccess();
      return (function (e, t, n) {
        var r = null,
          o = new Promise(function (e, n) {
            r = setTimeout(function () {
              n({
                error: 'Timeout when waiting for 3rd party check iframe message.',
              });
            }, t);
          });
        return Promise.race([e, o]).finally(function () {
          clearTimeout(r);
        });
      })(e.promise, r.messageReceiveTimeout);
    }
    function A(e) {
      if (!e || 'default' == e)
        return {
          login: function (e) {
            return window.location.replace(r.createLoginUrl(e)), _().promise;
          },
          logout: function (e) {
            return window.location.replace(r.createLogoutUrl(e)), _().promise;
          },
          register: function (e) {
            return window.location.replace(r.createRegisterUrl(e)), _().promise;
          },
          accountManagement: function () {
            var e = r.createAccountUrl();
            if (void 0 === e) throw 'Not supported by the OIDC server';
            return (window.location.href = e), _().promise;
          },
          redirectUri: function (e, t) {
            return e && e.redirectUri ? e.redirectUri : r.redirectUri ? r.redirectUri : location.href;
          },
        };
      if ('cordova' == e) {
        i.enable = !1;
        var t = function (e, t, n) {
            return window.cordova && window.cordova.InAppBrowser
              ? window.cordova.InAppBrowser.open(e, t, n)
              : window.open(e, t, n);
          },
          n = function (e) {
            var t = (function (e) {
              return e && e.cordovaOptions
                ? Object.keys(e.cordovaOptions).reduce(function (t, n) {
                    return (t[n] = e.cordovaOptions[n]), t;
                  }, {})
                : {};
            })(e);
            return (
              (t.location = 'no'),
              e && 'none' == e.prompt && (t.hidden = 'yes'),
              (function (e) {
                return Object.keys(e)
                  .reduce(function (t, n) {
                    return t.push(n + '=' + e[n]), t;
                  }, [])
                  .join(',');
              })(t)
            );
          };
        return {
          login: function (e) {
            var o = _(),
              i = n(e),
              s = r.createLoginUrl(e),
              a = t(s, '_blank', i),
              c = !1,
              l = !1,
              u = function () {
                (l = !0), a.close();
              };
            return (
              a.addEventListener('loadstart', function (e) {
                0 == e.url.indexOf('http://localhost') && (f(g(e.url), o), u(), (c = !0));
              }),
              a.addEventListener('loaderror', function (e) {
                c ||
                  (0 == e.url.indexOf('http://localhost')
                    ? (f(g(e.url), o), u(), (c = !0))
                    : (o.setError(), u()));
              }),
              a.addEventListener('exit', function (e) {
                l || o.setError({ reason: 'closed_by_user' });
              }),
              o.promise
            );
          },
          logout: function (e) {
            var n,
              o = _(),
              i = r.createLogoutUrl(e),
              s = t(i, '_blank', 'location=no,hidden=yes,clearcache=yes');
            return (
              s.addEventListener('loadstart', function (e) {
                0 == e.url.indexOf('http://localhost') && s.close();
              }),
              s.addEventListener('loaderror', function (e) {
                0 == e.url.indexOf('http://localhost') || (n = !0), s.close();
              }),
              s.addEventListener('exit', function (e) {
                n ? o.setError() : (r.clearToken(), o.setSuccess());
              }),
              o.promise
            );
          },
          register: function (e) {
            var o = _(),
              i = r.createRegisterUrl(),
              s = n(e),
              a = t(i, '_blank', s);
            return (
              a.addEventListener('loadstart', function (e) {
                0 == e.url.indexOf('http://localhost') && (a.close(), f(g(e.url), o));
              }),
              o.promise
            );
          },
          accountManagement: function () {
            var e = r.createAccountUrl();
            if (void 0 === e) throw 'Not supported by the OIDC server';
            var n = t(e, '_blank', 'location=no');
            n.addEventListener('loadstart', function (e) {
              0 == e.url.indexOf('http://localhost') && n.close();
            });
          },
          redirectUri: function (e) {
            return 'http://localhost';
          },
        };
      }
      if ('cordova-native' == e)
        return (
          (i.enable = !1),
          {
            login: function (e) {
              var t = _(),
                n = r.createLoginUrl(e);
              return (
                universalLinks.subscribe('keycloak', function (e) {
                  universalLinks.unsubscribe('keycloak'),
                    window.cordova.plugins.browsertab.close(),
                    f(g(e.url), t);
                }),
                window.cordova.plugins.browsertab.openUrl(n),
                t.promise
              );
            },
            logout: function (e) {
              var t = _(),
                n = r.createLogoutUrl(e);
              return (
                universalLinks.subscribe('keycloak', function (e) {
                  universalLinks.unsubscribe('keycloak'),
                    window.cordova.plugins.browsertab.close(),
                    r.clearToken(),
                    t.setSuccess();
                }),
                window.cordova.plugins.browsertab.openUrl(n),
                t.promise
              );
            },
            register: function (e) {
              var t = _(),
                n = r.createRegisterUrl(e);
              return (
                universalLinks.subscribe('keycloak', function (e) {
                  universalLinks.unsubscribe('keycloak'),
                    window.cordova.plugins.browsertab.close(),
                    f(g(e.url), t);
                }),
                window.cordova.plugins.browsertab.openUrl(n),
                t.promise
              );
            },
            accountManagement: function () {
              var e = r.createAccountUrl();
              if (void 0 === e) throw 'Not supported by the OIDC server';
              window.cordova.plugins.browsertab.openUrl(e);
            },
            redirectUri: function (e) {
              return e && e.redirectUri
                ? e.redirectUri
                : r.redirectUri
                ? r.redirectUri
                : 'http://localhost';
            },
          }
        );
      throw 'invalid adapter type: ' + e;
    }
    (r.init = function (o) {
      if (
        ((r.authenticated = !1),
        (n = (function () {
          try {
            return new E();
          } catch (e) {}
          return new C();
        })()),
        (t =
          o && ['default', 'cordova', 'cordova-native'].indexOf(o.adapter) > -1
            ? A(o.adapter)
            : o && 'object' == typeof o.adapter
            ? o.adapter
            : window.Cordova || window.cordova
            ? A('cordova')
            : A()),
        o)
      ) {
        if (
          (void 0 !== o.useNonce && (c = o.useNonce),
          void 0 !== o.checkLoginIframe && (i.enable = o.checkLoginIframe),
          o.checkLoginIframeInterval && (i.interval = o.checkLoginIframeInterval),
          'login-required' === o.onLoad && (r.loginRequired = !0),
          o.responseMode)
        ) {
          if ('query' !== o.responseMode && 'fragment' !== o.responseMode)
            throw 'Invalid value for responseMode';
          r.responseMode = o.responseMode;
        }
        if (o.flow) {
          switch (o.flow) {
            case 'standard':
              r.responseType = 'code';
              break;
            case 'implicit':
              r.responseType = 'id_token token';
              break;
            case 'hybrid':
              r.responseType = 'code id_token token';
              break;
            default:
              throw 'Invalid value for flow';
          }
          r.flow = o.flow;
        }
        if (
          (null != o.timeSkew && (r.timeSkew = o.timeSkew),
          o.redirectUri && (r.redirectUri = o.redirectUri),
          o.silentCheckSsoRedirectUri && (r.silentCheckSsoRedirectUri = o.silentCheckSsoRedirectUri),
          (r.silentCheckSsoFallback =
            'boolean' != typeof o.silentCheckSsoFallback || o.silentCheckSsoFallback),
          o.pkceMethod)
        ) {
          if ('S256' !== o.pkceMethod) throw 'Invalid value for pkceMethod';
          r.pkceMethod = o.pkceMethod;
        }
        (r.enableLogging = 'boolean' == typeof o.enableLogging && o.enableLogging),
          'string' == typeof o.scope && (r.scope = o.scope),
          (r.messageReceiveTimeout =
            'number' == typeof o.messageReceiveTimeout && o.messageReceiveTimeout > 0
              ? o.messageReceiveTimeout
              : 1e4);
      }
      r.responseMode || (r.responseMode = 'fragment'),
        r.responseType || ((r.responseType = 'code'), (r.flow = 'standard'));
      var s = _(),
        a = _();
      a.promise
        .then(function () {
          r.onReady && r.onReady(r.authenticated), s.setSuccess(r.authenticated);
        })
        .catch(function (e) {
          s.setError(e);
        });
      var l = (function (t) {
        var n,
          o = _();
        function i(e) {
          r.endpoints = e
            ? {
                authorize: function () {
                  return e.authorization_endpoint;
                },
                token: function () {
                  return e.token_endpoint;
                },
                logout: function () {
                  if (!e.end_session_endpoint) throw 'Not supported by the OIDC server';
                  return e.end_session_endpoint;
                },
                checkSessionIframe: function () {
                  if (!e.check_session_iframe) throw 'Not supported by the OIDC server';
                  return e.check_session_iframe;
                },
                register: function () {
                  throw 'Redirection to "Register user" page not supported in standard OIDC mode';
                },
                userinfo: function () {
                  if (!e.userinfo_endpoint) throw 'Not supported by the OIDC server';
                  return e.userinfo_endpoint;
                },
              }
            : {
                authorize: function () {
                  return h() + '/protocol/openid-connect/auth';
                },
                token: function () {
                  return h() + '/protocol/openid-connect/token';
                },
                logout: function () {
                  return h() + '/protocol/openid-connect/logout';
                },
                checkSessionIframe: function () {
                  var e = h() + '/protocol/openid-connect/login-status-iframe.html';
                  return r.iframeVersion && (e = e + '?version=' + r.iframeVersion), e;
                },
                thirdPartyCookiesIframe: function () {
                  var e = h() + '/protocol/openid-connect/3p-cookies/step1.html';
                  return r.iframeVersion && (e = e + '?version=' + r.iframeVersion), e;
                },
                register: function () {
                  return h() + '/protocol/openid-connect/registrations';
                },
                userinfo: function () {
                  return h() + '/protocol/openid-connect/userinfo';
                },
              };
        }
        if ((e ? 'string' == typeof e && (n = e) : (n = 'keycloak.json'), n))
          (c = new XMLHttpRequest()).open('GET', n, !0),
            c.setRequestHeader('Accept', 'application/json'),
            (c.onreadystatechange = function () {
              if (4 == c.readyState)
                if (200 == c.status || p(c)) {
                  var e = JSON.parse(c.responseText);
                  (r.authServerUrl = e['auth-server-url']),
                    (r.realm = e.realm),
                    (r.clientId = e.resource),
                    i(null),
                    o.setSuccess();
                } else o.setError();
            }),
            c.send();
        else {
          if (!e.clientId) throw 'clientId missing';
          r.clientId = e.clientId;
          var s = e.oidcProvider;
          if (s) {
            var a, c;
            'string' == typeof s
              ? ((a =
                  '/' == s.charAt(s.length - 1)
                    ? s + '.well-known/openid-configuration'
                    : s + '/.well-known/openid-configuration'),
                (c = new XMLHttpRequest()).open('GET', a, !0),
                c.setRequestHeader('Accept', 'application/json'),
                (c.onreadystatechange = function () {
                  4 == c.readyState &&
                    (200 == c.status || p(c)
                      ? (i(JSON.parse(c.responseText)), o.setSuccess())
                      : o.setError());
                }),
                c.send())
              : (i(s), o.setSuccess());
          } else {
            if (!e.url)
              for (var l = document.getElementsByTagName('script'), u = 0; u < l.length; u++)
                if (l[u].src.match(/.*keycloak\.js/)) {
                  e.url = l[u].src.substr(0, l[u].src.indexOf('/js/keycloak.js'));
                  break;
                }
            if (!e.realm) throw 'realm missing';
            (r.authServerUrl = e.url), (r.realm = e.realm), i(null), o.setSuccess();
          }
        }
        return o.promise;
      })();
      function u() {
        var e = function (e) {
            e || (n.prompt = 'none'),
              r
                .login(n)
                .then(function () {
                  a.setSuccess();
                })
                .catch(function (e) {
                  a.setError(e);
                });
          },
          t = function () {
            var e = document.createElement('iframe'),
              t = r.createLoginUrl({
                prompt: 'none',
                redirectUri: r.silentCheckSsoRedirectUri,
              });
            e.setAttribute('src', t),
              e.setAttribute('title', 'keycloak-silent-check-sso'),
              (e.style.display = 'none'),
              document.body.appendChild(e),
              window.addEventListener('message', function t(n) {
                n.origin === window.location.origin &&
                  e.contentWindow === n.source &&
                  (f(g(n.data), a),
                  document.body.removeChild(e),
                  window.removeEventListener('message', t));
              });
          },
          n = {};
        switch (o.onLoad) {
          case 'check-sso':
            i.enable
              ? y().then(function () {
                  b()
                    .then(function (n) {
                      n ? a.setSuccess() : r.silentCheckSsoRedirectUri ? t() : e(!1);
                    })
                    .catch(function (e) {
                      a.setError(e);
                    });
                })
              : r.silentCheckSsoRedirectUri
              ? t()
              : e(!1);
            break;
          case 'login-required':
            e(!0);
            break;
          default:
            throw 'Invalid value for onLoad';
        }
      }
      function d() {
        var e = g(window.location.href);
        if ((e && window.history.replaceState(window.history.state, null, e.newUrl), e && e.valid))
          return y()
            .then(function () {
              f(e, a);
            })
            .catch(function (e) {
              a.setError(e);
            });
        o
          ? o.token && o.refreshToken
            ? (k(o.token, o.refreshToken, o.idToken),
              i.enable
                ? y().then(function () {
                    b()
                      .then(function (e) {
                        e
                          ? (r.onAuthSuccess && r.onAuthSuccess(), a.setSuccess(), S())
                          : a.setSuccess();
                      })
                      .catch(function (e) {
                        a.setError(e);
                      });
                  })
                : r
                    .updateToken(-1)
                    .then(function () {
                      r.onAuthSuccess && r.onAuthSuccess(), a.setSuccess();
                    })
                    .catch(function (e) {
                      r.onAuthError && r.onAuthError(), o.onLoad ? u() : a.setError(e);
                    }))
            : o.onLoad
            ? u()
            : a.setSuccess()
          : a.setSuccess();
      }
      return (
        l.then(function () {
          (function () {
            var e = _(),
              t = function t() {
                ('interactive' !== document.readyState && 'complete' !== document.readyState) ||
                  (document.removeEventListener('readystatechange', t), e.setSuccess());
              };
            return document.addEventListener('readystatechange', t), t(), e.promise;
          })()
            .then(R)
            .then(d)
            .catch(function (e) {
              s.setError(e);
            });
        }),
        l.catch(function (e) {
          s.setError(e);
        }),
        s.promise
      );
    }),
      (r.login = function (e) {
        return t.login(e);
      }),
      (r.createLoginUrl = function (e) {
        var o,
          i = w(),
          s = w(),
          a = t.redirectUri(e),
          l = { state: i, nonce: s, redirectUri: encodeURIComponent(a) };
        e && e.prompt && (l.prompt = e.prompt),
          (o = e && 'register' == e.action ? r.endpoints.register() : r.endpoints.authorize());
        var u = (e && e.scope) || r.scope;
        u ? -1 === u.indexOf('openid') && (u = 'openid ' + u) : (u = 'openid');
        var h =
          o +
          '?client_id=' +
          encodeURIComponent(r.clientId) +
          '&redirect_uri=' +
          encodeURIComponent(a) +
          '&state=' +
          encodeURIComponent(i) +
          '&response_mode=' +
          encodeURIComponent(r.responseMode) +
          '&response_type=' +
          encodeURIComponent(r.responseType) +
          '&scope=' +
          encodeURIComponent(u);
        if (window !== window.parent)
          try {
            var f,
              p,
              k = document.referrer;
            console.info('DOCUMENT REFERRER: ', k);
            var m = k.split('/')[2];
            console.info('DOCUMENT REFERRER HOST: ', m);
            var g = null == (f = window.location.ancestorOrigins) ? void 0 : f[0];
            console.info('ANCESTOR ORIGIN: ', g);
            var v = null == g || null == (p = g.split('/')) ? void 0 : p[2];
            console.info('ANCESTOR ORIGIN HOST: ', v);
            var _ =
              window.location !== window.parent.location
                ? null != m
                  ? m
                  : v
                : window.location.hostname;
            console.info('WINK PARENT ORIGIN HOST: ', _),
              (h = h + '&wink-parent-origin=' + encodeURIComponent(_));
          } catch (e) {
            console.error('Unable to add wink parent origin query param due to error: ', e);
          }
        if (
          (c && (h = h + '&nonce=' + encodeURIComponent(s)),
          e && e.prompt && (h += '&prompt=' + encodeURIComponent(e.prompt)),
          e && e.maxAge && (h += '&max_age=' + encodeURIComponent(e.maxAge)),
          e && e.loginHint && (h += '&login_hint=' + encodeURIComponent(e.loginHint)),
          e && e.idpHint && (h += '&kc_idp_hint=' + encodeURIComponent(e.idpHint)),
          e &&
            e.action &&
            'register' != e.action &&
            (h += '&kc_action=' + encodeURIComponent(e.action)),
          e && e.locale && (h += '&ui_locales=' + encodeURIComponent(e.locale)),
          e && e.acr)
        ) {
          var y = JSON.stringify({ id_token: { acr: e.acr } });
          h += '&claims=' + encodeURIComponent(y);
        }
        if (r.pkceMethod) {
          var S = d(96, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
          l.pkceCodeVerifier = S;
          var b = (function (e, t) {
            if ('S256' === e) {
              var n = new Uint8Array(sha256.arrayBuffer(t));
              return base64Js
                .fromByteArray(n)
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/\=/g, '');
            }
            throw 'Invalid value for pkceMethod';
          })(r.pkceMethod, S);
          (h += '&code_challenge=' + b), (h += '&code_challenge_method=' + r.pkceMethod);
        }
        return n.add(l), h;
      }),
      (r.logout = function (e) {
        return t.logout(e);
      }),
      (r.createLogoutUrl = function (e) {
        var n =
          r.endpoints.logout() +
          '?client_id=' +
          encodeURIComponent(r.clientId) +
          '&post_logout_redirect_uri=' +
          encodeURIComponent(t.redirectUri(e, !1));
        return r.idToken && (n += '&id_token_hint=' + encodeURIComponent(r.idToken)), n;
      }),
      (r.register = function (e) {
        return t.register(e);
      }),
      (r.createRegisterUrl = function (e) {
        return e || (e = {}), (e.action = 'register'), r.createLoginUrl(e);
      }),
      (r.createAccountUrl = function (e) {
        var n = h(),
          o = void 0;
        return (
          void 0 !== n &&
            (o =
              n +
              '/account?referrer=' +
              encodeURIComponent(r.clientId) +
              '&referrer_uri=' +
              encodeURIComponent(t.redirectUri(e))),
          o
        );
      }),
      (r.accountManagement = function () {
        return t.accountManagement();
      }),
      (r.hasRealmRole = function (e) {
        var t = r.realmAccess;
        return !!t && t.roles.indexOf(e) >= 0;
      }),
      (r.hasResourceRole = function (e, t) {
        if (!r.resourceAccess) return !1;
        var n = r.resourceAccess[t || r.clientId];
        return !!n && n.roles.indexOf(e) >= 0;
      }),
      (r.loadUserProfile = function () {
        var e = h() + '/account',
          t = new XMLHttpRequest();
        t.open('GET', e, !0),
          t.setRequestHeader('Accept', 'application/json'),
          t.setRequestHeader('Authorization', 'bearer ' + r.token);
        var n = _();
        return (
          (t.onreadystatechange = function () {
            4 == t.readyState &&
              (200 == t.status
                ? ((r.profile = JSON.parse(t.responseText)), n.setSuccess(r.profile))
                : n.setError());
          }),
          t.send(),
          n.promise
        );
      }),
      (r.loadUserInfo = function () {
        var e = r.endpoints.userinfo(),
          t = new XMLHttpRequest();
        t.open('GET', e, !0),
          t.setRequestHeader('Accept', 'application/json'),
          t.setRequestHeader('Authorization', 'bearer ' + r.token);
        var n = _();
        return (
          (t.onreadystatechange = function () {
            4 == t.readyState &&
              (200 == t.status
                ? ((r.userInfo = JSON.parse(t.responseText)), n.setSuccess(r.userInfo))
                : n.setError());
          }),
          t.send(),
          n.promise
        );
      }),
      (r.isTokenExpired = function (e) {
        if (!r.tokenParsed || (!r.refreshToken && 'implicit' != r.flow)) throw 'Not authenticated';
        if (null == r.timeSkew)
          return l('[KEYCLOAK] Unable to determine if token is expired as timeskew is not set'), !0;
        var t = r.tokenParsed.exp - Math.ceil(new Date().getTime() / 1e3) + r.timeSkew;
        if (e) {
          if (isNaN(e)) throw 'Invalid minValidity';
          t -= e;
        }
        return t < 0;
      }),
      (r.updateToken = function (e) {
        var t = _();
        if (!r.refreshToken) return t.setError(), t.promise;
        e = e || 5;
        var n = function () {
          var n = !1;
          if (
            (-1 == e
              ? ((n = !0), l('[KEYCLOAK] Refreshing token: forced refresh'))
              : (r.tokenParsed && !r.isTokenExpired(e)) ||
                ((n = !0), l('[KEYCLOAK] Refreshing token: token expired')),
            n)
          ) {
            var i = 'grant_type=refresh_token&refresh_token=' + r.refreshToken,
              s = r.endpoints.token();
            if ((o.push(t), 1 == o.length)) {
              var a = new XMLHttpRequest();
              a.open('POST', s, !0),
                a.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'),
                (a.withCredentials = !0),
                (i += '&client_id=' + encodeURIComponent(r.clientId));
              var c = new Date().getTime();
              (a.onreadystatechange = function () {
                if (4 == a.readyState)
                  if (200 == a.status) {
                    l('[KEYCLOAK] Token refreshed'), (c = (c + new Date().getTime()) / 2);
                    var e = JSON.parse(a.responseText);
                    k(e.access_token, e.refresh_token, e.id_token, c),
                      r.onAuthRefreshSuccess && r.onAuthRefreshSuccess();
                    for (var t = o.pop(); null != t; t = o.pop()) t.setSuccess(!0);
                  } else
                    for (
                      u('[KEYCLOAK] Failed to refresh token'),
                        400 == a.status && r.clearToken(),
                        r.onAuthRefreshError && r.onAuthRefreshError(),
                        t = o.pop();
                      null != t;
                      t = o.pop()
                    )
                      t.setError(!0);
              }),
                a.send(i);
            }
          } else t.setSuccess(!1);
        };
        return (
          i.enable
            ? b()
                .then(function () {
                  n();
                })
                .catch(function (e) {
                  t.setError(e);
                })
            : n(),
          t.promise
        );
      }),
      (r.clearToken = function () {
        r.token &&
          (k(null, null, null), r.onAuthLogout && r.onAuthLogout(), r.loginRequired && r.login());
      });
    var E = function e() {
        if (!(this instanceof e)) return new e();
        function t() {
          for (var e = new Date().getTime(), t = 0; t < localStorage.length; t++) {
            var n = localStorage.key(t);
            if (n && 0 == n.indexOf('kc-callback-')) {
              var r = localStorage.getItem(n);
              if (r)
                try {
                  var o = JSON.parse(r).expires;
                  (!o || o < e) && localStorage.removeItem(n);
                } catch (e) {
                  localStorage.removeItem(n);
                }
            }
          }
        }
        localStorage.setItem('kc-test', 'test'),
          localStorage.removeItem('kc-test'),
          (this.get = function (e) {
            if (e) {
              var n = 'kc-callback-' + e,
                r = localStorage.getItem(n);
              return r && (localStorage.removeItem(n), (r = JSON.parse(r))), t(), r;
            }
          }),
          (this.add = function (e) {
            t();
            var n = 'kc-callback-' + e.state;
            (e.expires = new Date().getTime() + 36e5), localStorage.setItem(n, JSON.stringify(e));
          });
      },
      C = function e() {
        if (!(this instanceof e)) return new e();
        var t = this;
        (t.get = function (e) {
          if (e) {
            var t = r('kc-callback-' + e);
            return o('kc-callback-' + e, '', n(-100)), t ? JSON.parse(t) : void 0;
          }
        }),
          (t.add = function (e) {
            o('kc-callback-' + e.state, JSON.stringify(e), n(60));
          }),
          (t.removeItem = function (e) {
            o(e, '', n(-100));
          });
        var n = function (e) {
            var t = new Date();
            return t.setTime(t.getTime() + 60 * e * 1e3), t;
          },
          r = function (e) {
            for (var t = e + '=', n = document.cookie.split(';'), r = 0; r < n.length; r++) {
              for (var o = n[r]; ' ' == o.charAt(0); ) o = o.substring(1);
              if (0 == o.indexOf(t)) return o.substring(t.length, o.length);
            }
            return '';
          },
          o = function (e, t, n) {
            var r = e + '=' + t + '; expires=' + n.toUTCString() + '; ';
            document.cookie = r;
          };
      };
    function T(e) {
      return function () {
        r.enableLogging && e.apply(console, Array.prototype.slice.call(arguments));
      };
    }
  }
  var renderButtons = function () {
      var e = document.getElementById('wink-buttons');
      e
        ? ((e.innerHTML = ''),
          (e.innerHTML =
            '\n   <button id="wink-oauth-refresh-button" class="wink-oauth-button" style="margin-right: 10px;" onclick="refreshToken();">Refresh token</button>\n   <button id="wink-oauth-logout-button" class="wink-oauth-button" onclick="signOut();">Sign out</button>\n   <button id="wink-oauth-validatetoken-button" class="wink-oauth-button" onclick="validateToken();">Validate Token</button>\n        '))
        : console.warn('no element with ID #wink-buttons found');
    },
    renderTokens = function (e) {
      if (_wlk) {
        var t = document.getElementById('wink-tokens');
        t
          ? ((t.innerHTML = ''),
            (t.innerHTML =
              '\n\n   <div class="tab">\n         <button class="tablinks" onclick="openTab(event, \'I\')" id="defaultOpen">Profile information</button>\n         <button class="tablinks" onclick="openTab(event, \'ACT\')">Access token</button>\n         <button class="tablinks" onclick="openTab(event, \'RET\')">Refresh token</button>\n         <button class="tablinks" onclick="openTab(event, \'IDT\')">ID token</button>\n      </div>\n\n      <div id="I" class="tabcontent">\n        <div class="row">\n          <div class="column" style="max-width: 255px">\n             <p><b>Username (winkTag)</b></p>\n             <p><b>Name (firstName)</b></p>\n           <p><b>Surname (lastName)</b></p>\n             <p><b>Phone (contactNo)</b></p>\n             <p><b>Email (email)</b></p>\n             <p><b>ID (identityId)</b></p>\n             <p><b>WinkToken</b></p>\n          </div>\n          <div class="column">\n             <p>' +
              e.username +
              '</p>\n             <p>' +
              (_wlk.idTokenParsed.hasOwnProperty('given_name')
                ? _wlk.idTokenParsed.given_name
                : 'Unkown') +
              '</p>\n             <p>' +
              (_wlk.idTokenParsed.hasOwnProperty('family_name')
                ? _wlk.idTokenParsed.family_name
                : 'Unkown') +
              '</p>\n             <p>' +
              (_wlk.idTokenParsed.hasOwnProperty('phone_number')
                ? _wlk.idTokenParsed.phone_number
                : 'Unkown') +
              '</p>\n             <p>' +
              (_wlk.idTokenParsed.hasOwnProperty('email') ? _wlk.idTokenParsed.email : 'Unkown') +
              '</p>\n             <p>' +
              (_wlk.idTokenParsed.hasOwnProperty('oid') ? _wlk.idTokenParsed.oid : 'Unkown') +
              '</p>\n             <p>' +
              (_wlk.idTokenParsed.hasOwnProperty('sub') ? _wlk.idTokenParsed.sub : 'Unkown') +
              '</p>\n           </div>\n        </div>\n      </div>\n\n<div id="ACT" class="tabcontent">\n<p><b>Expiration date: </b>' +
              _wlk.getFormattedTime(_wlk.tokenParsed.exp) +
              '</p>\n<p><textarea id="aT" cols="100" rows="3">' +
              _wlk.token +
              '</textarea></p>\n<p><textarea id="aTP" cols="100" rows="12">' +
              JSON.stringify(parseJwt(_wlk.token), null, 4) +
              '</textarea></p>\n</div>\n\n<div id="RET" class="tabcontent">\n<p><b>Expiration date: </b>' +
              _wlk.getFormattedTime(_wlk.refreshTokenParsed.exp) +
              '</p>\n<p><textarea id="rT" cols="100" rows="3">' +
              _wlk.refreshToken +
              '</textarea></p>\n<p><textarea id="rTP" cols="100" rows="12">' +
              JSON.stringify(_wlk.refreshTokenParsed, null, 4) +
              '</textarea></p>\n</div>\n\n<div id="IDT" class="tabcontent">\n<p><b>Expiration date: </b>' +
              _wlk.getFormattedTime(_wlk.idTokenParsed.exp) +
              '</p>\n<p><textarea id="iT" cols="100" rows="3">' +
              _wlk.idToken +
              '</textarea></p>\n<p><textarea id="iTP" cols="100" rows="12">' +
              JSON.stringify(_wlk.idTokenParsed, null, 4) +
              '</textarea></p>\n</div>\n      '),
            document.getElementById('defaultOpen').click())
          : console.warn('no element with ID #wink-tokens found'),
          openTab();
      } else console.error('renderTokens: winkLoginKeycloak is not defined');
    },
    renderRefreshButton = function () {
      var e = document.getElementById('wink-oauth-refresh-button');
      e &&
        (e.setAttribute('disabled', ''),
        (refreshButtonInterval = setInterval(updateRefreshTokenButton, 1e3)));
    },
    getUrl = function (e) {
      if (e || _wlk)
        return '' != (_wlk = null != e ? e : _wlk).authServerUrl
          ? '/' == _wlk.authServerUrl.charAt(_wlk.authServerUrl.length - 1)
            ? _wlk.authServerUrl + 'realms/' + encodeURIComponent(_wlk.realm)
            : _wlk.authServerUrl + '/realms/' + encodeURIComponent(_wlk.realm)
          : null;
      console.error('getUrl: winkLoginKeycloak is not defined');
    },
    renderUserData = function (e, t) {
      if (e || _wlk) {
        _wlk = null != e ? e : _wlk;
        var n = document.getElementById('wink-user-data');
        n
          ? ((n.innerHTML = ''), (n.innerHTML = '\n      '), renderButtons(), renderTokens(t))
          : console.warn('no element with ID #wink-user-data found');
      } else console.error('renderUserData: winkLoginKeycloak is not defined');
    },
    winkLoadUserProfile = function (e, t) {
      var n;
      if (e || _wlk) {
        var r = parseJwt((_wlk = null != e ? e : _wlk).token);
        (r.username = null != (n = r.username) ? n : r.preferred_username),
          renderUserData(_wlk, r),
          renderRefreshButton(),
          t.getUserProfile(r);
      } else console.error('winkLoadUserProfile: winkLoginKeycloak is not defined');
    },
    getRedirectUri = function (e, t) {
      if (e || _wlk)
        return (
          (_wlk = null != e ? e : _wlk),
          t && t.redirectUri ? t.redirectUri : _wlk.redirectUri ? _wlk.redirectUri : location.href
        );
      console.error('getRedirectUri: winkLoginKeycloak is not defined');
    },
    openTab = function (e, t) {
      if (e && t) {
        var n, r, o;
        for (r = document.getElementsByClassName('tabcontent'), n = 0; n < r.length; n++)
          r[n].style.display = 'none';
        for (o = document.getElementsByClassName('tablinks'), n = 0; n < o.length; n++)
          o[n].className = o[n].className.replace(' active', '');
        (document.getElementById(t).style.display = 'block'),
          (e.currentTarget.className += ' active');
      }
    },
    parseJwt = function (e) {
      var t = e.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'),
        n = decodeURIComponent(
          window
            .atob(t)
            .split('')
            .map(function (e) {
              return '%' + ('00' + e.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );
      return JSON.parse(n);
    },
    updateRefreshTokenButton = function () {
      if (_wlk && _wlk.tokenParsed) {
        var e = new Date();
        new Date(1e3 * _wlk.tokenParsed.exp) < e &&
          (document.getElementById('wink-oauth-refresh-button').removeAttribute('disabled'),
          clearInterval(refreshButtonInterval));
      }
    },
    safariKeycloakInitConfig = {
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      silentCheckSsoFallback: !1,
      checkLoginIframe: !1,
      enableLogging: !0,
    },
    firefoxKeycloakInitConfig = {
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      silentCheckSsoFallback: !1,
      checkLoginIframe: !0,
      enableLogging: !0,
    },
    defaultKeycloakInitConfig = {
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      checkLoginIframe: !0,
      silentCheckSsoFallback: !0,
      enableLogging: !0,
    };
  function isFirefoxBrowser() {
    return -1 !== navigator.userAgent.indexOf('Firefox');
  }
  function isSafariBrowser() {
    return navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');
  }
  function getKeycloakInitOptions() {
    return isFirefoxBrowser()
      ? firefoxKeycloakInitConfig
      : isSafariBrowser()
      ? safariKeycloakInitConfig
      : defaultKeycloakInitConfig;
  }
  var winkSetCookie = function (e, t, n) {
      void 0 === n && (n = 1);
      var r = new Date();
      r.setTime(r.getTime() + 24 * n * 60 * 60 * 1e3);
      var o = 'expires=' + r.toUTCString();
      document.cookie = e + '=' + t + ';' + o + ';path=/';
    },
    winkGetCookie = function (e) {
      for (
        var t = e + '=', n = decodeURIComponent(document.cookie).split(';'), r = 0;
        r < n.length;
        r++
      ) {
        for (var o = n[r]; ' ' == o.charAt(0); ) o = o.substring(1);
        if (0 == o.indexOf(t)) return o.substring(t.length, o.length);
      }
      return '';
    },
    winkEraseCookie = function (e) {
      document.cookie = e + '=; Max-Age=-99999999;';
    };
  function _catch(e, t) {
    try {
      var n = e();
    } catch (e) {
      return t(e);
    }
    return n && n.then ? n.then(void 0, t) : n;
  }
  var WinkLogin = /*#__PURE__*/ (function (e) {
    function t(t) {
      var n;
      return (
        ((n = e.call(this, t) || this).winkLoadUserProfile = function (e) {
          try {
            winkLoadUserProfile(_assertThisInitialized(n), e);
          } catch (e) {
            console.error('Error while wink loading of user profile', e);
          }
        }),
        (n.changeUrlWithoutReloading = function (e) {
          history.pushState({ page: e }, '', e);
        }),
        (n.getUrlParamValue = function (e) {
          var t = window.location.search;
          return new URLSearchParams(t).get(e);
        }),
        (n.removeUrlParam = function (e) {
          var t = window.location,
            r = n.removeParameterFromUrl(t, e);
          n.changeUrlWithoutReloading(r);
        }),
        (n.removeParameterFromUrl = function (e, t) {
          var n = new URL(e),
            r = n.searchParams;
          return r.delete(t), (n.search = r.toString()), n.toString();
        }),
        (n.initWinkClient = function (e) {
          try {
            var t = _catch(
              function () {
                var t = getKeycloakInitOptions();
                return Promise.resolve(n.init(t)).then(function (t) {
                  t
                    ? (winkSetCookie('wink_id_token', n.idToken),
                      winkLoadUserProfile(_assertThisInitialized(n), e))
                    : 1 == n.getUrlParamValue('login_session_state')
                    ? n.winkLogin()
                    : e.onFailure('user is not authenticated..!');
                });
              },
              function (t) {
                e.onFailure('error while wink client initialization'),
                  console.error('Error while wink client initialization', t);
              }
            );
            return Promise.resolve(t && t.then ? t.then(function () {}) : void 0);
          } catch (e) {
            return Promise.reject(e);
          }
        }),
        (n.winkLogin = function () {
          try {
            var e = _catch(
              function () {
                return Promise.resolve(n.login()).then(function (e) {
                  renderUserData(_assertThisInitialized(n), e);
                });
              },
              function (e) {
                console.error('Error while wink client login', e);
              }
            );
            return Promise.resolve(e && e.then ? e.then(function () {}) : void 0);
          } catch (e) {
            return Promise.reject(e);
          }
        }),
        (n.createSinglePageLogoutUrl = function (e) {
          try {
            var t = null != n.idToken && '' != n.idToken ? n.idToken : winkGetCookie('wink_id_token');
            return (
              winkEraseCookie('wink_id_token'),
              n.removeUrlParam('login_session_state'),
              getUrl(_assertThisInitialized(n)) +
                '/winklogout?post_logout_redirect_uri=' +
                encodeURIComponent(getRedirectUri(_assertThisInitialized(n), e)) +
                '&id_token_hint=' +
                encodeURIComponent(t) +
                '&client_id=' +
                encodeURIComponent(n.clientId)
            );
          } catch (e) {
            console.error('Error while wink constructing the logout url', e);
          }
        }),
        (n.logout = function (e) {
          try {
            var t = n.createSinglePageLogoutUrl(e);
            return window.location.replace(t);
          } catch (e) {
            console.error('Error while wink logout', e);
          }
        }),
        (n.getFormattedTime = function (e) {
          return new Date(1e3 * e).toLocaleString();
        }),
        n
      );
    }
    return _inheritsLoose(t, e), t;
  })(Keycloak);
  console.info('winklogin.module.js - version 1.5.8 '), (window.WinkLogin = WinkLogin);
  //# sourceMappingURL=winklogin.module.js.map
  