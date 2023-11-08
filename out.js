(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i4 = decorators.length - 1, decorator; i4 >= 0; i4--)
      if (decorator = decorators[i4])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target, key, result);
    return result;
  };

  // node_modules/@lit/reactive-element/css-tag.js
  var t = globalThis;
  var e = t.ShadowRoot && (t.ShadyCSS === void 0 || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  var s = Symbol();
  var o = /* @__PURE__ */ new WeakMap();
  var n = class {
    constructor(t4, e5, o5) {
      if (this._$cssResult$ = true, o5 !== s)
        throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t4, this.t = e5;
    }
    get styleSheet() {
      let t4 = this.o;
      const s4 = this.t;
      if (e && t4 === void 0) {
        const e5 = s4 !== void 0 && s4.length === 1;
        e5 && (t4 = o.get(s4)), t4 === void 0 && ((this.o = t4 = new CSSStyleSheet()).replaceSync(this.cssText), e5 && o.set(s4, t4));
      }
      return t4;
    }
    toString() {
      return this.cssText;
    }
  };
  var r = (t4) => new n(typeof t4 == "string" ? t4 : t4 + "", void 0, s);
  var i = (t4, ...e5) => {
    const o5 = t4.length === 1 ? t4[0] : e5.reduce((e6, s4, o6) => e6 + ((t5) => {
      if (t5._$cssResult$ === true)
        return t5.cssText;
      if (typeof t5 == "number")
        return t5;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t5 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s4) + t4[o6 + 1], t4[0]);
    return new n(o5, t4, s);
  };
  var S = (s4, o5) => {
    if (e)
      s4.adoptedStyleSheets = o5.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet);
    else
      for (const e5 of o5) {
        const o6 = document.createElement("style"), n5 = t.litNonce;
        n5 !== void 0 && o6.setAttribute("nonce", n5), o6.textContent = e5.cssText, s4.appendChild(o6);
      }
  };
  var c = e ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
    let e5 = "";
    for (const s4 of t5.cssRules)
      e5 += s4.cssText;
    return r(e5);
  })(t4) : t4;

  // node_modules/@lit/reactive-element/reactive-element.js
  var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: r2, getOwnPropertyNames: h, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
  var a = globalThis;
  var c2 = a.trustedTypes;
  var l = c2 ? c2.emptyScript : "";
  var p = a.reactiveElementPolyfillSupport;
  var d = (t4, s4) => t4;
  var u = { toAttribute(t4, s4) {
    switch (s4) {
      case Boolean:
        t4 = t4 ? l : null;
        break;
      case Object:
      case Array:
        t4 = t4 == null ? t4 : JSON.stringify(t4);
    }
    return t4;
  }, fromAttribute(t4, s4) {
    let i4 = t4;
    switch (s4) {
      case Boolean:
        i4 = t4 !== null;
        break;
      case Number:
        i4 = t4 === null ? null : Number(t4);
        break;
      case Object:
      case Array:
        try {
          i4 = JSON.parse(t4);
        } catch (t5) {
          i4 = null;
        }
    }
    return i4;
  } };
  var f = (t4, s4) => !i2(t4, s4);
  var y = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
  Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
  var b = class extends HTMLElement {
    static addInitializer(t4) {
      this._$Ei(), (this.l ??= []).push(t4);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t4, s4 = y) {
      if (s4.state && (s4.attribute = false), this._$Ei(), this.elementProperties.set(t4, s4), !s4.noAccessor) {
        const i4 = Symbol(), r6 = this.getPropertyDescriptor(t4, i4, s4);
        r6 !== void 0 && e2(this.prototype, t4, r6);
      }
    }
    static getPropertyDescriptor(t4, s4, i4) {
      const { get: e5, set: h3 } = r2(this.prototype, t4) ?? { get() {
        return this[s4];
      }, set(t5) {
        this[s4] = t5;
      } };
      return { get() {
        return e5?.call(this);
      }, set(s5) {
        const r6 = e5?.call(this);
        h3.call(this, s5), this.requestUpdate(t4, r6, i4);
      }, configurable: true, enumerable: true };
    }
    static getPropertyOptions(t4) {
      return this.elementProperties.get(t4) ?? y;
    }
    static _$Ei() {
      if (this.hasOwnProperty(d("elementProperties")))
        return;
      const t4 = n2(this);
      t4.finalize(), t4.l !== void 0 && (this.l = [...t4.l]), this.elementProperties = new Map(t4.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(d("finalized")))
        return;
      if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
        const t5 = this.properties, s4 = [...h(t5), ...o2(t5)];
        for (const i4 of s4)
          this.createProperty(i4, t5[i4]);
      }
      const t4 = this[Symbol.metadata];
      if (t4 !== null) {
        const s4 = litPropertyMetadata.get(t4);
        if (s4 !== void 0)
          for (const [t5, i4] of s4)
            this.elementProperties.set(t5, i4);
      }
      this._$Eh = /* @__PURE__ */ new Map();
      for (const [t5, s4] of this.elementProperties) {
        const i4 = this._$Eu(t5, s4);
        i4 !== void 0 && this._$Eh.set(i4, t5);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s4) {
      const i4 = [];
      if (Array.isArray(s4)) {
        const e5 = new Set(s4.flat(1 / 0).reverse());
        for (const s5 of e5)
          i4.unshift(c(s5));
      } else
        s4 !== void 0 && i4.push(c(s4));
      return i4;
    }
    static _$Eu(t4, s4) {
      const i4 = s4.attribute;
      return i4 === false ? void 0 : typeof i4 == "string" ? i4 : typeof t4 == "string" ? t4.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      this._$Eg = new Promise((t4) => this.enableUpdating = t4), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t4) => t4(this));
    }
    addController(t4) {
      (this._$ES ??= []).push(t4), this.renderRoot !== void 0 && this.isConnected && t4.hostConnected?.();
    }
    removeController(t4) {
      this._$ES?.splice(this._$ES.indexOf(t4) >>> 0, 1);
    }
    _$E_() {
      const t4 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
      for (const i4 of s4.keys())
        this.hasOwnProperty(i4) && (t4.set(i4, this[i4]), delete this[i4]);
      t4.size > 0 && (this._$Ep = t4);
    }
    createRenderRoot() {
      const t4 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return S(t4, this.constructor.elementStyles), t4;
    }
    connectedCallback() {
      this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$ES?.forEach((t4) => t4.hostConnected?.());
    }
    enableUpdating(t4) {
    }
    disconnectedCallback() {
      this._$ES?.forEach((t4) => t4.hostDisconnected?.());
    }
    attributeChangedCallback(t4, s4, i4) {
      this._$AK(t4, i4);
    }
    _$EO(t4, s4) {
      const i4 = this.constructor.elementProperties.get(t4), e5 = this.constructor._$Eu(t4, i4);
      if (e5 !== void 0 && i4.reflect === true) {
        const r6 = (i4.converter?.toAttribute !== void 0 ? i4.converter : u).toAttribute(s4, i4.type);
        this._$Em = t4, r6 == null ? this.removeAttribute(e5) : this.setAttribute(e5, r6), this._$Em = null;
      }
    }
    _$AK(t4, s4) {
      const i4 = this.constructor, e5 = i4._$Eh.get(t4);
      if (e5 !== void 0 && this._$Em !== e5) {
        const t5 = i4.getPropertyOptions(e5), r6 = typeof t5.converter == "function" ? { fromAttribute: t5.converter } : t5.converter?.fromAttribute !== void 0 ? t5.converter : u;
        this._$Em = e5, this[e5] = r6.fromAttribute(s4, t5.type), this._$Em = null;
      }
    }
    requestUpdate(t4, s4, i4, e5 = false, r6) {
      if (t4 !== void 0) {
        if (i4 ??= this.constructor.getPropertyOptions(t4), !(i4.hasChanged ?? f)(e5 ? r6 : this[t4], s4))
          return;
        this.C(t4, s4, i4);
      }
      this.isUpdatePending === false && (this._$Eg = this._$EP());
    }
    C(t4, s4, i4) {
      this._$AL.has(t4) || this._$AL.set(t4, s4), i4.reflect === true && this._$Em !== t4 && (this._$Ej ??= /* @__PURE__ */ new Set()).add(t4);
    }
    async _$EP() {
      this.isUpdatePending = true;
      try {
        await this._$Eg;
      } catch (t5) {
        Promise.reject(t5);
      }
      const t4 = this.scheduleUpdate();
      return t4 != null && await t4, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      if (!this.isUpdatePending)
        return;
      if (!this.hasUpdated) {
        if (this._$Ep) {
          for (const [t6, s5] of this._$Ep)
            this[t6] = s5;
          this._$Ep = void 0;
        }
        const t5 = this.constructor.elementProperties;
        if (t5.size > 0)
          for (const [s5, i4] of t5)
            i4.wrapped !== true || this._$AL.has(s5) || this[s5] === void 0 || this.C(s5, this[s5], i4);
      }
      let t4 = false;
      const s4 = this._$AL;
      try {
        t4 = this.shouldUpdate(s4), t4 ? (this.willUpdate(s4), this._$ES?.forEach((t5) => t5.hostUpdate?.()), this.update(s4)) : this._$ET();
      } catch (s5) {
        throw t4 = false, this._$ET(), s5;
      }
      t4 && this._$AE(s4);
    }
    willUpdate(t4) {
    }
    _$AE(t4) {
      this._$ES?.forEach((t5) => t5.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
    }
    _$ET() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$Eg;
    }
    shouldUpdate(t4) {
      return true;
    }
    update(t4) {
      this._$Ej &&= this._$Ej.forEach((t5) => this._$EO(t5, this[t5])), this._$ET();
    }
    updated(t4) {
    }
    firstUpdated(t4) {
    }
  };
  b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[d("elementProperties")] = /* @__PURE__ */ new Map(), b[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: b }), (a.reactiveElementVersions ??= []).push("2.0.1");

  // node_modules/lit-html/lit-html.js
  var t2 = globalThis;
  var i3 = t2.trustedTypes;
  var s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
  var e3 = "$lit$";
  var h2 = `lit$${(Math.random() + "").slice(9)}$`;
  var o3 = "?" + h2;
  var n3 = `<${o3}>`;
  var r3 = document;
  var l2 = () => r3.createComment("");
  var c3 = (t4) => t4 === null || typeof t4 != "object" && typeof t4 != "function";
  var a2 = Array.isArray;
  var u2 = (t4) => a2(t4) || typeof t4?.[Symbol.iterator] == "function";
  var d2 = "[ 	\n\f\r]";
  var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var v = /-->/g;
  var _ = />/g;
  var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var p2 = /'/g;
  var g = /"/g;
  var $ = /^(?:script|style|textarea|title)$/i;
  var y2 = (t4) => (i4, ...s4) => ({ _$litType$: t4, strings: i4, values: s4 });
  var x = y2(1);
  var b2 = y2(2);
  var w = Symbol.for("lit-noChange");
  var T = Symbol.for("lit-nothing");
  var A = /* @__PURE__ */ new WeakMap();
  var E = r3.createTreeWalker(r3, 129);
  function C(t4, i4) {
    if (!Array.isArray(t4) || !t4.hasOwnProperty("raw"))
      throw Error("invalid template strings array");
    return s2 !== void 0 ? s2.createHTML(i4) : i4;
  }
  var P = (t4, i4) => {
    const s4 = t4.length - 1, o5 = [];
    let r6, l3 = i4 === 2 ? "<svg>" : "", c4 = f2;
    for (let i5 = 0; i5 < s4; i5++) {
      const s5 = t4[i5];
      let a4, u3, d3 = -1, y3 = 0;
      for (; y3 < s5.length && (c4.lastIndex = y3, u3 = c4.exec(s5), u3 !== null); )
        y3 = c4.lastIndex, c4 === f2 ? u3[1] === "!--" ? c4 = v : u3[1] !== void 0 ? c4 = _ : u3[2] !== void 0 ? ($.test(u3[2]) && (r6 = RegExp("</" + u3[2], "g")), c4 = m) : u3[3] !== void 0 && (c4 = m) : c4 === m ? u3[0] === ">" ? (c4 = r6 ?? f2, d3 = -1) : u3[1] === void 0 ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a4 = u3[1], c4 = u3[3] === void 0 ? m : u3[3] === '"' ? g : p2) : c4 === g || c4 === p2 ? c4 = m : c4 === v || c4 === _ ? c4 = f2 : (c4 = m, r6 = void 0);
      const x2 = c4 === m && t4[i5 + 1].startsWith("/>") ? " " : "";
      l3 += c4 === f2 ? s5 + n3 : d3 >= 0 ? (o5.push(a4), s5.slice(0, d3) + e3 + s5.slice(d3) + h2 + x2) : s5 + h2 + (d3 === -2 ? i5 : x2);
    }
    return [C(t4, l3 + (t4[s4] || "<?>") + (i4 === 2 ? "</svg>" : "")), o5];
  };
  var V = class {
    constructor({ strings: t4, _$litType$: s4 }, n5) {
      let r6;
      this.parts = [];
      let c4 = 0, a4 = 0;
      const u3 = t4.length - 1, d3 = this.parts, [f3, v2] = P(t4, s4);
      if (this.el = V.createElement(f3, n5), E.currentNode = this.el.content, s4 === 2) {
        const t5 = this.el.content.firstChild;
        t5.replaceWith(...t5.childNodes);
      }
      for (; (r6 = E.nextNode()) !== null && d3.length < u3; ) {
        if (r6.nodeType === 1) {
          if (r6.hasAttributes())
            for (const t5 of r6.getAttributeNames())
              if (t5.endsWith(e3)) {
                const i4 = v2[a4++], s5 = r6.getAttribute(t5).split(h2), e5 = /([.?@])?(.*)/.exec(i4);
                d3.push({ type: 1, index: c4, name: e5[2], strings: s5, ctor: e5[1] === "." ? k : e5[1] === "?" ? H : e5[1] === "@" ? I : R }), r6.removeAttribute(t5);
              } else
                t5.startsWith(h2) && (d3.push({ type: 6, index: c4 }), r6.removeAttribute(t5));
          if ($.test(r6.tagName)) {
            const t5 = r6.textContent.split(h2), s5 = t5.length - 1;
            if (s5 > 0) {
              r6.textContent = i3 ? i3.emptyScript : "";
              for (let i4 = 0; i4 < s5; i4++)
                r6.append(t5[i4], l2()), E.nextNode(), d3.push({ type: 2, index: ++c4 });
              r6.append(t5[s5], l2());
            }
          }
        } else if (r6.nodeType === 8)
          if (r6.data === o3)
            d3.push({ type: 2, index: c4 });
          else {
            let t5 = -1;
            for (; (t5 = r6.data.indexOf(h2, t5 + 1)) !== -1; )
              d3.push({ type: 7, index: c4 }), t5 += h2.length - 1;
          }
        c4++;
      }
    }
    static createElement(t4, i4) {
      const s4 = r3.createElement("template");
      return s4.innerHTML = t4, s4;
    }
  };
  function N(t4, i4, s4 = t4, e5) {
    if (i4 === w)
      return i4;
    let h3 = e5 !== void 0 ? s4._$Co?.[e5] : s4._$Cl;
    const o5 = c3(i4) ? void 0 : i4._$litDirective$;
    return h3?.constructor !== o5 && (h3?._$AO?.(false), o5 === void 0 ? h3 = void 0 : (h3 = new o5(t4), h3._$AT(t4, s4, e5)), e5 !== void 0 ? (s4._$Co ??= [])[e5] = h3 : s4._$Cl = h3), h3 !== void 0 && (i4 = N(t4, h3._$AS(t4, i4.values), h3, e5)), i4;
  }
  var S2 = class {
    constructor(t4, i4) {
      this._$AV = [], this._$AN = void 0, this._$AD = t4, this._$AM = i4;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t4) {
      const { el: { content: i4 }, parts: s4 } = this._$AD, e5 = (t4?.creationScope ?? r3).importNode(i4, true);
      E.currentNode = e5;
      let h3 = E.nextNode(), o5 = 0, n5 = 0, l3 = s4[0];
      for (; l3 !== void 0; ) {
        if (o5 === l3.index) {
          let i5;
          l3.type === 2 ? i5 = new M(h3, h3.nextSibling, this, t4) : l3.type === 1 ? i5 = new l3.ctor(h3, l3.name, l3.strings, this, t4) : l3.type === 6 && (i5 = new L(h3, this, t4)), this._$AV.push(i5), l3 = s4[++n5];
        }
        o5 !== l3?.index && (h3 = E.nextNode(), o5++);
      }
      return E.currentNode = r3, e5;
    }
    p(t4) {
      let i4 = 0;
      for (const s4 of this._$AV)
        s4 !== void 0 && (s4.strings !== void 0 ? (s4._$AI(t4, s4, i4), i4 += s4.strings.length - 2) : s4._$AI(t4[i4])), i4++;
    }
  };
  var M = class {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t4, i4, s4, e5) {
      this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = t4, this._$AB = i4, this._$AM = s4, this.options = e5, this._$Cv = e5?.isConnected ?? true;
    }
    get parentNode() {
      let t4 = this._$AA.parentNode;
      const i4 = this._$AM;
      return i4 !== void 0 && t4?.nodeType === 11 && (t4 = i4.parentNode), t4;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t4, i4 = this) {
      t4 = N(this, t4, i4), c3(t4) ? t4 === T || t4 == null || t4 === "" ? (this._$AH !== T && this._$AR(), this._$AH = T) : t4 !== this._$AH && t4 !== w && this._(t4) : t4._$litType$ !== void 0 ? this.g(t4) : t4.nodeType !== void 0 ? this.$(t4) : u2(t4) ? this.T(t4) : this._(t4);
    }
    k(t4) {
      return this._$AA.parentNode.insertBefore(t4, this._$AB);
    }
    $(t4) {
      this._$AH !== t4 && (this._$AR(), this._$AH = this.k(t4));
    }
    _(t4) {
      this._$AH !== T && c3(this._$AH) ? this._$AA.nextSibling.data = t4 : this.$(r3.createTextNode(t4)), this._$AH = t4;
    }
    g(t4) {
      const { values: i4, _$litType$: s4 } = t4, e5 = typeof s4 == "number" ? this._$AC(t4) : (s4.el === void 0 && (s4.el = V.createElement(C(s4.h, s4.h[0]), this.options)), s4);
      if (this._$AH?._$AD === e5)
        this._$AH.p(i4);
      else {
        const t5 = new S2(e5, this), s5 = t5.u(this.options);
        t5.p(i4), this.$(s5), this._$AH = t5;
      }
    }
    _$AC(t4) {
      let i4 = A.get(t4.strings);
      return i4 === void 0 && A.set(t4.strings, i4 = new V(t4)), i4;
    }
    T(t4) {
      a2(this._$AH) || (this._$AH = [], this._$AR());
      const i4 = this._$AH;
      let s4, e5 = 0;
      for (const h3 of t4)
        e5 === i4.length ? i4.push(s4 = new M(this.k(l2()), this.k(l2()), this, this.options)) : s4 = i4[e5], s4._$AI(h3), e5++;
      e5 < i4.length && (this._$AR(s4 && s4._$AB.nextSibling, e5), i4.length = e5);
    }
    _$AR(t4 = this._$AA.nextSibling, i4) {
      for (this._$AP?.(false, true, i4); t4 && t4 !== this._$AB; ) {
        const i5 = t4.nextSibling;
        t4.remove(), t4 = i5;
      }
    }
    setConnected(t4) {
      this._$AM === void 0 && (this._$Cv = t4, this._$AP?.(t4));
    }
  };
  var R = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t4, i4, s4, e5, h3) {
      this.type = 1, this._$AH = T, this._$AN = void 0, this.element = t4, this.name = i4, this._$AM = e5, this.options = h3, s4.length > 2 || s4[0] !== "" || s4[1] !== "" ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = T;
    }
    _$AI(t4, i4 = this, s4, e5) {
      const h3 = this.strings;
      let o5 = false;
      if (h3 === void 0)
        t4 = N(this, t4, i4, 0), o5 = !c3(t4) || t4 !== this._$AH && t4 !== w, o5 && (this._$AH = t4);
      else {
        const e6 = t4;
        let n5, r6;
        for (t4 = h3[0], n5 = 0; n5 < h3.length - 1; n5++)
          r6 = N(this, e6[s4 + n5], i4, n5), r6 === w && (r6 = this._$AH[n5]), o5 ||= !c3(r6) || r6 !== this._$AH[n5], r6 === T ? t4 = T : t4 !== T && (t4 += (r6 ?? "") + h3[n5 + 1]), this._$AH[n5] = r6;
      }
      o5 && !e5 && this.O(t4);
    }
    O(t4) {
      t4 === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 ?? "");
    }
  };
  var k = class extends R {
    constructor() {
      super(...arguments), this.type = 3;
    }
    O(t4) {
      this.element[this.name] = t4 === T ? void 0 : t4;
    }
  };
  var H = class extends R {
    constructor() {
      super(...arguments), this.type = 4;
    }
    O(t4) {
      this.element.toggleAttribute(this.name, !!t4 && t4 !== T);
    }
  };
  var I = class extends R {
    constructor(t4, i4, s4, e5, h3) {
      super(t4, i4, s4, e5, h3), this.type = 5;
    }
    _$AI(t4, i4 = this) {
      if ((t4 = N(this, t4, i4, 0) ?? T) === w)
        return;
      const s4 = this._$AH, e5 = t4 === T && s4 !== T || t4.capture !== s4.capture || t4.once !== s4.once || t4.passive !== s4.passive, h3 = t4 !== T && (s4 === T || e5);
      e5 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
    }
    handleEvent(t4) {
      typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t4) : this._$AH.handleEvent(t4);
    }
  };
  var L = class {
    constructor(t4, i4, s4) {
      this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i4, this.options = s4;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t4) {
      N(this, t4);
    }
  };
  var Z = t2.litHtmlPolyfillSupport;
  Z?.(V, M), (t2.litHtmlVersions ??= []).push("3.0.2");
  var j = (t4, i4, s4) => {
    const e5 = s4?.renderBefore ?? i4;
    let h3 = e5._$litPart$;
    if (h3 === void 0) {
      const t5 = s4?.renderBefore ?? null;
      e5._$litPart$ = h3 = new M(i4.insertBefore(l2(), t5), t5, void 0, s4 ?? {});
    }
    return h3._$AI(t4), h3;
  };

  // node_modules/lit-element/lit-element.js
  var s3 = class extends b {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      const t4 = super.createRenderRoot();
      return this.renderOptions.renderBefore ??= t4.firstChild, t4;
    }
    update(t4) {
      const i4 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t4), this._$Do = j(i4, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(true);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(false);
    }
    render() {
      return w;
    }
  };
  s3._$litElement$ = true, s3["finalized", "finalized"] = true, globalThis.litElementHydrateSupport?.({ LitElement: s3 });
  var r4 = globalThis.litElementPolyfillSupport;
  r4?.({ LitElement: s3 });
  (globalThis.litElementVersions ??= []).push("4.0.1");

  // node_modules/@lit/reactive-element/decorators/custom-element.js
  var t3 = (t4) => (e5, o5) => {
    o5 !== void 0 ? o5.addInitializer(() => {
      customElements.define(t4, e5);
    }) : customElements.define(t4, e5);
  };

  // node_modules/@lit/reactive-element/decorators/property.js
  var o4 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
  var r5 = (t4 = o4, e5, r6) => {
    const { kind: n5, metadata: i4 } = r6;
    let s4 = globalThis.litPropertyMetadata.get(i4);
    if (s4 === void 0 && globalThis.litPropertyMetadata.set(i4, s4 = /* @__PURE__ */ new Map()), s4.set(r6.name, t4), n5 === "accessor") {
      const { name: o5 } = r6;
      return { set(r7) {
        const n6 = e5.get.call(this);
        e5.set.call(this, r7), this.requestUpdate(o5, n6, t4);
      }, init(e6) {
        return e6 !== void 0 && this.C(o5, void 0, t4), e6;
      } };
    }
    if (n5 === "setter") {
      const { name: o5 } = r6;
      return function(r7) {
        const n6 = this[o5];
        e5.call(this, r7), this.requestUpdate(o5, n6, t4);
      };
    }
    throw Error("Unsupported decorator location: " + n5);
  };
  function n4(t4) {
    return (e5, o5) => typeof o5 == "object" ? r5(t4, e5, o5) : ((t5, e6, o6) => {
      const r6 = e6.hasOwnProperty(o6);
      return e6.constructor.createProperty(o6, r6 ? { ...t5, wrapped: true } : t5), r6 ? Object.getOwnPropertyDescriptor(e6, o6) : void 0;
    })(t4, e5, o5);
  }

  // history.ts
  var SmartActionV3 = class {
    constructor(data2, forwardFunction, hasMultipleData, name, description) {
      this.fieldStorage = {};
      this.name = name;
      this.description = description;
      this.forwardFunction = forwardFunction;
      this.hasMultipleData = hasMultipleData;
      this.data = data2;
      if (hasMultipleData) {
        var tempObject = {};
        for (let [k2, v2] of Object.entries(data2)) {
          var setFunction = (target, prop, reciever) => {
            if (target[prop] != reciever) {
              this.fieldStorage[k2] = {};
              this.fieldStorage[k2][prop] = target[prop];
              target[prop] = reciever;
            }
            console.log(prop, "changed");
            return true;
          };
          var handler = {
            get(target, prop, reciever) {
              return target[prop];
            },
            set: setFunction
          };
          tempObject[k2] = new Proxy(v2, handler);
        }
        this.proxiedData = tempObject;
      } else {
        var setFunction = (target, prop, reciever) => {
          if (target[prop] != reciever) {
            this.fieldStorage[prop] = target[prop];
            target[prop] = reciever;
          }
          console.log(prop, "changed");
          return true;
        };
        var handler = {
          get(target, prop, reciever) {
            return target[prop];
          },
          set: setFunction
        };
        this.proxiedData = new Proxy(data2, handler);
      }
    }
    forward() {
      return this.forwardFunction(this.proxiedData);
    }
    backward() {
      if (this.hasMultipleData) {
        for (var [key, val] of Object.entries(this.fieldStorage)) {
          if (typeof val == "object") {
            for (let [k2, v2] of Object.entries(val)) {
              this.data[key][k2] = v2;
            }
          }
        }
      } else {
        for (let [k2, v2] of Object.entries(this.fieldStorage)) {
          this.data[k2] = v2;
        }
      }
      return true;
    }
  };
  var Session = class {
    constructor() {
      this.onLocationChange = [];
      this.actions = [{ forward: () => true, backward: () => true }];
      this.currentLocation = [0];
    }
    changedLocation() {
      for (let i4 of this.onLocationChange) {
        i4();
      }
    }
    currentBranch() {
      console.log(this.currentLocation);
      var getItemAt = (branch, currentLocationIndex) => {
        var d3 = branch[this.currentLocation[currentLocationIndex]];
        if (Array.isArray(d3)) {
          var nextBranch = d3[this.currentLocation[currentLocationIndex + 1]];
          return getItemAt(nextBranch, currentLocationIndex + 1);
        } else {
          return branch;
        }
      };
      return getItemAt(this.actions, 0);
    }
    currentAction() {
      return this.currentBranch()[this.currentLocation[this.currentLocation.length - 1]];
    }
    commitAction(actions) {
      let currentBranch = this.currentBranch();
      if (currentBranch.length - 1 == this.currentLocation[this.currentLocation.length - 1]) {
        this.currentLocation[this.currentLocation.length - 1] += actions.length;
        for (let i4 of actions) {
          i4.forward();
          currentBranch.push(i4);
        }
        this.changedLocation();
      } else {
        console.log("creating a new branhc at position");
        let newBranchJunctionLocation = currentBranch.indexOf(this.currentAction());
        let oldBranch = currentBranch.slice(newBranchJunctionLocation);
        currentBranch.splice(newBranchJunctionLocation);
        let newBranch = [];
        for (let i4 of actions) {
          i4.forward();
          newBranch.push(i4);
        }
        currentBranch[newBranchJunctionLocation] = [oldBranch, newBranch];
        this.currentLocation.push(1, 0);
        this.changedLocation();
      }
    }
    undo() {
      console.log(this.currentLocation);
      var decrementLastIndex = (onBranchLocation) => {
        if (this.currentLocation.length > 0) {
          if (this.currentLocation[this.currentLocation.length - 1] - 1 < 0) {
            var currentBranch = this.currentBranch();
            currentBranch[this.currentLocation[this.currentLocation.length - 1]].backward();
            this.currentLocation.pop();
            this.currentLocation.pop();
            decrementLastIndex(true);
          } else {
            if (onBranchLocation) {
              this.currentLocation[this.currentLocation.length - 1]--;
            } else {
              console.log(this.currentLocation, this.actions, this.currentAction());
              this.currentAction().backward();
              this.currentLocation[this.currentLocation.length - 1]--;
            }
          }
        } else {
        }
      };
      decrementLastIndex(false);
      this.changedLocation();
    }
    redo() {
      let currentBranch = this.currentBranch();
      if (this.currentLocation[this.currentLocation.length - 1] == currentBranch.length) {
        return false;
      } else {
        console.log(currentBranch);
        var traverseJunctions = (action) => {
          if (Array.isArray(action)) {
            let route = prompt("there is a diverging junction here, pick which route to take, (0-" + (action.length - 1) + "): ");
            this.currentLocation.push(parseInt(route ? route : "0"));
            this.currentLocation.push(0);
            return traverseJunctions(this.currentBranch()[0]);
          } else {
            console.log("going forward on", this.currentLocation);
            action.forward();
            return true;
          }
        };
        this.currentLocation[this.currentLocation.length - 1]++;
        this.changedLocation();
        return traverseJunctions(currentBranch[this.currentLocation[this.currentLocation.length - 1]]);
      }
    }
  };

  // main.ts
  var data = {
    name: "martini",
    age: "12"
  };
  var session = new Session();
  var input = document.getElementById("name");
  var a3 = new SmartActionV3({ d: data }, (data2) => {
    data2.d.name = "a woof of space";
    return true;
  }, true, "update name");
  session.commitAction([a3]);
  console.log(data);
  console.log("loc", session.currentLocation);
  var _a;
  (_a = document.getElementById("commit")) == null ? void 0 : _a.addEventListener("click", () => {
    var inputValue = input.value;
    let a4 = new SmartActionV3({ d: data }, (data2) => {
      data2.d.name = inputValue;
      console.log("im in the forward function", inputValue);
      return true;
    }, true, "update name to" + inputValue);
    session.commitAction([a4]);
    console.log(data, "loc", session.currentLocation);
  });
  var _a2;
  (_a2 = document.getElementById("undo")) == null ? void 0 : _a2.addEventListener("click", () => {
    session.undo();
    input.value = data.name;
    console.log(data, session, "loc", session.currentLocation);
  });
  var _a3;
  (_a3 = document.getElementById("redo")) == null ? void 0 : _a3.addEventListener("click", () => {
    console.log(session.redo());
    input.value = data.name;
    console.log(data, "loc", session.currentLocation);
  });
  var HistoryTreeComponent = class extends s3 {
    constructor() {
      super();
      this.session = session;
      this.session.onLocationChange.push(() => {
        this.requestUpdate("session");
      });
    }
    branch(branch) {
      return x`<div class="branch">${branch.map((v2) => Array.isArray(v2) ? this.branchJunction(v2) : x`<button class="action ${this.session.currentAction() == v2 ? "current" : ""}">${v2.name}</button>`)}</div>`;
    }
    branchJunction(junction) {
      return x`
            <div class="branch-junction">${junction.map((v2) => this.branch(v2))}</div>
        `;
    }
    render() {
      return x`
            ${this.branch(this.session.actions)}
        `;
    }
  };
  HistoryTreeComponent.styles = i`
        :host {
            width: 100%;
            display: flex;
        }
        .branch {
            display: flex;
        }
        .action.current {
            color: red;
        }
        .branch-junction {
            display: flex;
            flex-direction: column;
        }
    `;
  __decorateClass([
    n4()
  ], HistoryTreeComponent.prototype, "session", 2);
  HistoryTreeComponent = __decorateClass([
    t3("history-tree")
  ], HistoryTreeComponent);
})();
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
